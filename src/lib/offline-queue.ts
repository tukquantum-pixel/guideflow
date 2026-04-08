export interface BufferedRecording {
    id: string;
    title: string;
    coordinates: number[][]; // [lng, lat, alt, time]
    distance: number;
    elevationGain: number;
    duration: number;
    startedAt: string;
    finishedAt: string;
}

const QUEUE_KEY = 'pathy_offline_queue';

export function getOfflineQueue(): BufferedRecording[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function enqueueRecording(recording: Omit<BufferedRecording, 'id'>): void {
    if (typeof window === 'undefined') return;
    const queue = getOfflineQueue();
    const newRecord: BufferedRecording = {
        ...recording,
        id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
    queue.push(newRecord);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(QUEUE_KEY);
}

export function removeRecordingFromQueue(id: string): void {
    if (typeof window === 'undefined') return;
    const queue = getOfflineQueue();
    const newQueue = queue.filter(r => r.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
}

/**
 * Intenta sincronizar toda la cola.
 * Retorna true si procesó la cola (o si estaba vacía con éxito),
 * false si falló y quedan pendientes.
 */
export async function syncPendingRecordings(): Promise<boolean> {
    if (typeof window === 'undefined') return true;
    
    if (!navigator.onLine) {
        return false;
    }

    const queue = getOfflineQueue();
    if (queue.length === 0) return true;

    let hasErrors = false;

    // Procesamos cada registro de forma secuencial
    for (const record of queue) {
        try {
            // Re-adaptamos la data para que coincida con el backend
            const payload = {
                title: record.title,
                coordinates: record.coordinates,
                distance: record.distance,
                elevationGain: record.elevationGain,
                duration: record.duration,
                startedAt: record.startedAt,
                finishedAt: record.finishedAt
            };

            const res = await fetch("/api/user/recorded-routes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                removeRecordingFromQueue(record.id);
            } else {
                hasErrors = true;
            }
        } catch (error) {
            console.error("Error sincronizando ruta:", error);
            hasErrors = true;
        }
    }

    return !hasErrors;
}
