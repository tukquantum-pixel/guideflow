"use client"

import { useState, useRef } from "react"

interface TrackData {
    name: string; distance: number | null; elevationGain: number | null
    elevationLoss: number | null; durationEst: number | null
}

interface Props {
    activityId: string
    track?: TrackData | null
    onUpload?: (track: TrackData) => void
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.round((seconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}min` : `${m}min`
}

export function GPXUploader({ activityId, track: initialTrack, onUpload }: Props) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const [track, setTrack] = useState<TrackData | null>(initialTrack || null)
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleFile(file: File) {
        if (!file.name.endsWith(".gpx")) { setError("Solo archivos .gpx"); return }
        if (file.size > 10 * 1024 * 1024) { setError("Máximo 10MB"); return }
        setUploading(true)
        setError("")
        const fd = new FormData()
        fd.append("gpx", file)
        fd.append("activityId", activityId)
        try {
            const res = await fetch("/api/tracks", { method: "POST", body: fd })
            if (!res.ok) { const d = await res.json(); setError(d.error || "Error"); return }
            const data = await res.json()
            setTrack(data.track)
            onUpload?.(data.track)
        } catch { setError("Error de red") }
        finally { setUploading(false) }
    }

    async function handleRemove() {
        if (!confirm("¿Eliminar track?")) return
        await fetch("/api/tracks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activityId }) })
        setTrack(null)
    }

    return (
        <div>
            <label className="block text-sm font-medium text-pizarra mb-2">🗺️ Track GPX</label>
            {track ? (
                <div className="bg-musgo/5 border border-musgo/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-pizarra">📄 {track.name}</p>
                        <button onClick={handleRemove} className="text-xs text-atardecer hover:text-atardecer-dark transition">Eliminar</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {track.distance != null && (
                            <div className="bg-white rounded-lg p-2 text-center">
                                <p className="text-xs text-granito">Distancia</p>
                                <p className="text-sm font-bold text-pizarra">{(track.distance / 1000).toFixed(1)} km</p>
                            </div>
                        )}
                        {track.elevationGain != null && (
                            <div className="bg-white rounded-lg p-2 text-center">
                                <p className="text-xs text-granito">Desnivel ↑</p>
                                <p className="text-sm font-bold text-musgo">{track.elevationGain} m</p>
                            </div>
                        )}
                        {track.durationEst != null && (
                            <div className="bg-white rounded-lg p-2 text-center">
                                <p className="text-xs text-granito">Duración est.</p>
                                <p className="text-sm font-bold text-pizarra">{formatDuration(track.durationEst)}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={() => inputRef.current?.click()} className="text-xs text-lago hover:text-lago-dark mt-2 transition">Reemplazar track</button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                    className="border-2 border-dashed border-roca-dark/30 rounded-xl p-6 text-center cursor-pointer hover:border-musgo/50 hover:bg-musgo/5 transition"
                >
                    {uploading ? (
                        <p className="text-granito text-sm">⏳ Subiendo y procesando...</p>
                    ) : (
                        <>
                            <p className="text-granito text-sm mb-1">📂 Arrastra un archivo GPX o haz clic</p>
                            <p className="text-xs text-granito/60">Formato: .gpx · Máx: 10MB</p>
                        </>
                    )}
                </div>
            )}
            <input ref={inputRef} type="file" accept=".gpx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            {error && <p className="text-xs text-atardecer mt-1">{error}</p>}
        </div>
    )
}
