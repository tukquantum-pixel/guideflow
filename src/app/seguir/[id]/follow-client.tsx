"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

const FollowMap = dynamic(() => import("./follow-map").then(m => ({ default: m.FollowMap })), {
    ssr: false, loading: () => <div className="flex-1 bg-roca flex items-center justify-center text-granito">🗺️ Cargando mapa...</div>,
})

interface Activity {
    id: string; title: string; category: string; difficulty: string
    track: { geojson: string; distance: number | null; elevationGain: number | null }
}

export function FollowClient({ activity }: { activity: Activity }) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
    const [accuracy, setAccuracy] = useState<number>(0)
    const [distToTrack, setDistToTrack] = useState<number | null>(null)
    const [gpsError, setGpsError] = useState<string | null>(null)
    const [elapsed, setElapsed] = useState(0)
    const [tracking, setTracking] = useState(false)
    const watchRef = useRef<number | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const coordsRef = useRef<number[][]>([])

    // Parse track coords once
    useEffect(() => {
        try {
            const data = JSON.parse(activity.track.geojson)
            coordsRef.current = data.geometry?.coordinates || []
        } catch { coordsRef.current = [] }
    }, [activity.track.geojson])

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) { setGpsError("GPS no disponible"); return }
        setTracking(true)
        setElapsed(0)
        timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)

        watchRef.current = navigator.geolocation.watchPosition(
            (p) => {
                const lat = p.coords.latitude, lng = p.coords.longitude
                setPosition({ lat, lng })
                setAccuracy(p.coords.accuracy)
                setGpsError(null)
                // Distance to nearest point on track
                const d = minDistToTrack(lng, lat, coordsRef.current)
                setDistToTrack(d)
            },
            (err) => setGpsError(err.message),
            { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
        )
    }, [])

    const stopTracking = useCallback(() => {
        if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current)
        if (timerRef.current) clearInterval(timerRef.current)
        setTracking(false)
    }, [])

    useEffect(() => () => { stopTracking() }, [stopTracking])

    const fmtTime = (s: number) => `${Math.floor(s / 3600).toString().padStart(2, "0")}:${Math.floor((s % 3600) / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`
    const isOffRoute = distToTrack !== null && distToTrack > 50

    return (
        <div className="h-screen flex flex-col bg-pizarra">
            {/* Header */}
            <div className="bg-pizarra text-white px-4 py-3 flex items-center justify-between shrink-0 z-10">
                <Link href={`/ruta/${activity.id}`} className="text-musgo-light hover:text-white text-sm">← Salir</Link>
                <div className="text-center">
                    <p className="font-bold text-sm truncate max-w-[200px]">{activity.title}</p>
                    <p className="text-xs text-white/50">{activity.track.distance ? `${(activity.track.distance / 1000).toFixed(1)} km` : ""}</p>
                </div>
                <span className="text-xs text-white/40">{activity.difficulty}</span>
            </div>

            {/* Off-route alert */}
            {isOffRoute && tracking && (
                <div className="bg-atardecer text-white px-4 py-2 text-center font-bold text-sm animate-pulse shrink-0 z-10">
                    ⚠️ Te has desviado del sendero · {Math.round(distToTrack!)}m
                </div>
            )}

            {/* Map */}
            <div className="flex-1 relative">
                <FollowMap geojson={activity.track.geojson} userPosition={position} />
            </div>

            {/* Bottom panel */}
            <div className="bg-white border-t border-roca-dark/20 px-4 py-3 shrink-0 z-10">
                {!tracking ? (
                    <button onClick={startTracking}
                        className="w-full py-4 bg-gradient-to-r from-musgo to-musgo-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-musgo/25 flex items-center justify-center gap-2">
                        ▶️ COMENZAR SEGUIMIENTO
                    </button>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                            <div>
                                <p className="text-xs text-granito">Tiempo</p>
                                <p className="font-bold text-pizarra font-mono">{fmtTime(elapsed)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-granito">Distancia al track</p>
                                <p className={`font-bold ${isOffRoute ? "text-atardecer" : "text-musgo"}`}>
                                    {distToTrack !== null ? `${Math.round(distToTrack)}m` : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-granito">Precisión GPS</p>
                                <p className="font-bold text-pizarra">{accuracy ? `±${Math.round(accuracy)}m` : "—"}</p>
                            </div>
                        </div>
                        <button onClick={stopTracking}
                            className="w-full py-3 bg-atardecer/10 text-atardecer rounded-xl font-bold border border-atardecer/30">
                            ⏹️ Finalizar
                        </button>
                    </>
                )}
                {gpsError && <p className="text-xs text-atardecer text-center mt-2">⚠️ {gpsError}</p>}
            </div>
        </div>
    )
}

function minDistToTrack(lng: number, lat: number, coords: number[][]): number {
    if (coords.length === 0) return 0
    let min = Infinity
    for (const c of coords) {
        const d = haversine(lat, lng, c[1], c[0])
        if (d < min) min = d
    }
    return min
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
