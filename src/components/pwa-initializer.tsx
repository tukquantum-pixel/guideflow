"use client"

import { useEffect } from 'react';
import { useNetwork } from '@/hooks/use-network';
import { syncPendingRecordings, getOfflineQueue } from '@/lib/offline-queue';

export function PwaInitializer() {
    const isOnline = useNetwork();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('SW registrado con éxito:', registration.scope);
                })
                .catch(error => {
                    console.error('Fallo al registrar SW:', error);
                });
        }
    }, []);

    useEffect(() => {
        if (isOnline) {
            // Auto-sync routes if network comes back online
            const queue = getOfflineQueue();
            if (queue.length > 0) {
                console.log(`📡 Conexión restaurada. Sincronizando ${queue.length} rutas pendientes...`);
                syncPendingRecordings().then(success => {
                    if (success) {
                        console.log('✅ Rutas offline sincronizadas exitosamente.');
                    } else {
                        console.error('❌ Error al sincronizar rutas offline. Se reintentará luego.');
                    }
                });
            }
        }
    }, [isOnline]);

    return null;
}
