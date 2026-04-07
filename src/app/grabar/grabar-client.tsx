"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { MapIcon, DistanceIcon, ElevationIcon, DurationIcon, CheckIcon, MountainIcon } from "@/components/icons"
import { TILE_LAYERS, TRACK_STYLE, currentPosHtml, ensureLeafletCss, cleanMapContainer, type MapLayer } from "@/lib/map-utils"

type RecState = "idle" | "recording" | "paused" | "done"
type GpsError = "denied" | "unavailable" | "timeout" | "none"
interface GeoPoint { lat: number; lng: number; alt: number; time: number }

function fmt(s: number) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`
}
function calcDist(a: GeoPoint, b: GeoPoint) {
    const R = 6371000, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

const LAYERS = TILE_LAYERS

function GpsHelp({ type, onRetry }: { type: GpsError; onRetry: () => void }) {
    const msgs: Record<string, { icon: string; title: string; steps: string[] }> = {
        denied: { icon: "🔒", title: "Permisos de ubicación necesarios", steps: ["Abre Ajustes del navegador", "Permite 'Ubicación' para PATHY", "Vuelve y pulsa 'Intentar de nuevo'"] },
        unavailable: { icon: "📡", title: "GPS no disponible", steps: ["Sal al exterior (cielo abierto)", "Espera 10-15 segundos", "Pulsa 'Intentar de nuevo'"] },
        timeout: { icon: "⏱️", title: "Señal GPS lenta", steps: ["Verifica que el GPS esté activado", "Cierra otras apps con GPS", "Pulsa 'Intentar de nuevo'"] },
    }
    const m = msgs[type]; if (!m) return null
    return (
        <div className="bg-atardecer/10 border border-atardecer/30 rounded-2xl p-5 text-center space-y-3">
            <p className="text-3xl">{m.icon}</p>
            <h3 className="font-bold text-pizarra">{m.title}</h3>
            <div className="text-left bg-white/60 rounded-xl p-3 space-y-1.5">
                {m.steps.map((s, i) => <div key={i} className="flex items-start gap-2 text-sm"><span className="w-5 h-5 bg-atardecer/20 text-atardecer rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span><span className="text-granito">{s}</span></div>)}
            </div>
            <button onClick={onRetry} className="w-full py-3 bg-musgo hover:bg-musgo-dark text-white rounded-xl font-bold transition">↻ Intentar de nuevo</button>
        </div>
    )
}

function AccuracyBadge({ accuracy }: { accuracy: number | null }) {
    if (accuracy === null) return <span className="text-[10px] text-granito animate-pulse">📡 Buscando...</span>
    const color = accuracy < 10 ? "bg-green-500" : accuracy < 30 ? "bg-amber-500" : "bg-red-500"
    const label = accuracy < 10 ? "GPS preciso" : accuracy < 30 ? "Precisión media" : "Señal débil"
    return (
        <span className="inline-flex items-center gap-1.5 text-[10px]">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-granito">{label} · ±{Math.round(accuracy)}m</span>
        </span>
    )
}

export function GrabarClient({ userName }: { userName: string }) {
    const [state, setState] = useState<RecState>("idle")
    const [points, setPoints] = useState<GeoPoint[]>([])
    const [distance, setDistance] = useState(0)
    const [elevation, setElevation] = useState(0)
    const [elapsed, setElapsed] = useState(0)
    const [gpsError, setGpsError] = useState<GpsError>("none")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [title, setTitle] = useState("")
    const [showConfetti, setShowConfetti] = useState(false)
    const [followUser, setFollowUser] = useState(true)
    const [activeLayer, setActiveLayer] = useState<MapLayer>("topo")
    const [showLayerPicker, setShowLayerPicker] = useState(false)
    const [accuracy, setAccuracy] = useState<number | null>(null)

    const watchIdRef = useRef<number | null>(null)
    const startTimeRef = useRef(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const lastPointRef = useRef<GeoPoint | null>(null)
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<any>(null)
    const tileLayerRef = useRef<any>(null)
    const polylineRef = useRef<any>(null)
    const markerRef = useRef<any>(null)
    const startMarkerRef = useRef<any>(null)
    const accuracyCircleRef = useRef<any>(null)

    // Init map
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return
        import("leaflet").then(L => {
            if (!mapRef.current) return
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement("link"); link.rel = "stylesheet"
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(link)
            }
            if (!document.getElementById("pathy-pulse-css")) {
                const style = document.createElement("style"); style.id = "pathy-pulse-css"
                style.textContent = `
                    @keyframes pathy-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }
                    .pathy-pos{width:16px;height:16px;background:#5B8C5A;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(91,140,90,.5);animation:pathy-pulse 2s infinite}
                    .pathy-start{width:10px;height:10px;background:#3B9EBF;border:2px solid white;border-radius:50%;box-shadow:0 0 4px rgba(59,158,191,.4)}
                `
                document.head.appendChild(style)
            }
            if ((mapRef.current as any)._leaflet_id) delete (mapRef.current as any)._leaflet_id
            const map = L.map(mapRef.current, { scrollWheelZoom: true, zoomControl: false }).setView([40.0, -3.5], 6)
            L.control.zoom({ position: "topright" }).addTo(map)
            const lyr = LAYERS[activeLayer]
            tileLayerRef.current = L.tileLayer(lyr.url, { attribution: lyr.attr, maxZoom: lyr.maxZoom || 19 }).addTo(map)
            mapInstance.current = map
            polylineRef.current = L.polyline([], { color: "#5B8C5A", weight: 4, opacity: 0.85 }).addTo(map)

            // Request initial location to prompt permission and center map before recording
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setAccuracy(pos.coords.accuracy); setGpsError("none")
                        const p: GeoPoint = { lat: pos.coords.latitude, lng: pos.coords.longitude, alt: pos.coords.altitude || 0, time: Date.now() }
                        lastPointRef.current = p
                        if (mapInstance.current) {
                            mapInstance.current.setView([p.lat, p.lng], 15)
                            markerRef.current = L.marker([p.lat, p.lng], { icon: L.divIcon({ html: '<div class="pathy-pos"></div>', className: "", iconSize: [16, 16], iconAnchor: [8, 8] }) }).addTo(mapInstance.current)
                            if (pos.coords.accuracy < 100) {
                                accuracyCircleRef.current = L.circle([p.lat, p.lng], { radius: pos.coords.accuracy, color: "#5B8C5A", weight: 1, fillOpacity: 0.08 }).addTo(mapInstance.current)
                            }
                        }
                    },
                    (err) => console.log("Initial GPS failed:", err),
                    { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
                )
            }
        })
        return () => {
            try { mapInstance.current?.remove() } catch (e) { }
            mapInstance.current = null
        }
    }, [])

    // Switch layer
    const switchLayer = useCallback((key: MapLayer) => {
        if (!mapInstance.current) return
        import("leaflet").then(L => {
            if (tileLayerRef.current) mapInstance.current.removeLayer(tileLayerRef.current)
            const layer = LAYERS[key]
            tileLayerRef.current = L.tileLayer(layer.url, { attribution: layer.attr, maxZoom: layer.maxZoom || 19 }).addTo(mapInstance.current)
            setActiveLayer(key); setShowLayerPicker(false)
        })
    }, [])

    // Update map when points change
    useEffect(() => {
        if (!mapInstance.current || points.length === 0) return
        import("leaflet").then(L => {
            const last = points[points.length - 1]
            polylineRef.current?.setLatLngs(points.map(p => [p.lat, p.lng]))
            if (markerRef.current) { markerRef.current.setLatLng([last.lat, last.lng]) }
            else { markerRef.current = L.marker([last.lat, last.lng], { icon: L.divIcon({ html: '<div class="pathy-pos"></div>', className: "", iconSize: [16, 16], iconAnchor: [8, 8] }) }).addTo(mapInstance.current) }
            if (points.length <= 2 && !startMarkerRef.current) { startMarkerRef.current = L.marker([points[0].lat, points[0].lng], { icon: L.divIcon({ html: '<div class="pathy-start"></div>', className: "", iconSize: [10, 10], iconAnchor: [5, 5] }) }).addTo(mapInstance.current).bindPopup("Inicio") }
            // Accuracy circle
            if (accuracy !== null && accuracy < 100) {
                if (accuracyCircleRef.current) { accuracyCircleRef.current.setLatLng([last.lat, last.lng]).setRadius(accuracy) }
                else { accuracyCircleRef.current = L.circle([last.lat, last.lng], { radius: accuracy, color: accuracy < 10 ? "#5B8C5A" : accuracy < 30 ? "#d97706" : "#ef4444", weight: 1, fillOpacity: 0.08 }).addTo(mapInstance.current) }
            }
            if (followUser) mapInstance.current.setView([last.lat, last.lng], Math.max(mapInstance.current.getZoom(), 15))
        })
    }, [points, followUser, accuracy])

    const handleGpsError = useCallback((err: GeolocationPositionError) => {
        setGpsError(err.code === 1 ? "denied" : err.code === 2 ? "unavailable" : "timeout"); setState("idle")
        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
        if (timerRef.current) clearInterval(timerRef.current)
    }, [])

    const onPosition = useCallback((pos: GeolocationPosition) => {
        setGpsError("none"); setAccuracy(pos.coords.accuracy)
        
        // 1. FILTERING: Ignore highly inaccurate points (common when falling back to cell towers)
        // If accuracy is worse than 40 meters, we update the UI accuracy badge but don't draw the point or count distance.
        if (state === "recording" && pos.coords.accuracy > 40) {
            console.log("GPS Ignorado (poca precisión):", pos.coords.accuracy, "m");
            return;
        }

        const p: GeoPoint = { lat: pos.coords.latitude, lng: pos.coords.longitude, alt: pos.coords.altitude || 0, time: Date.now() }
        setPoints(prev => [...prev, p])

        if (lastPointRef.current && state === "recording") {
            const d = calcDist(lastPointRef.current, p)
            // 2. ANTI-DRIFT: Only sum distance if we moved more than 5 meters (ignores standing-still jitter)
            // and require strict accuracy (<20m) to count towards total distance.
            if (d > 5 && pos.coords.accuracy < 20) { 
                setDistance(prev => prev + d); 
                const g = p.alt - lastPointRef.current.alt; 
                // Only count elevation if the change is significant to avoid altimeter noise
                if (g > 2) setElevation(prev => prev + g) 
            }
        }
        lastPointRef.current = p
    }, [state])

    const wakeLockRef = useRef<any>(null)

    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator && wakeLockRef.current === null) {
                wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                wakeLockRef.current.addEventListener('release', () => console.log('Wake Lock released'));
            }
        } catch (err) { console.error('Wake Lock error:', err); }
    }

    const releaseWakeLock = () => {
        if (wakeLockRef.current !== null) {
            wakeLockRef.current.release().then(() => { wakeLockRef.current = null; });
        }
    }

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (wakeLockRef.current !== null && document.visibilityState === 'visible' && state === "recording") {
                requestWakeLock();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [state]);

    const startRecording = useCallback(() => {
        if (!navigator.geolocation) { setGpsError("unavailable"); return }
        setGpsError("none"); setState("recording"); startTimeRef.current = Date.now(); setAccuracy(null)
        timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000)
        requestWakeLock()

        // Try high accuracy first, fallback to low accuracy after 60s timeout
        const tryWatch = (highAccuracy: boolean) => {
            watchIdRef.current = navigator.geolocation.watchPosition(
                onPosition,
                (err) => {
                    if (highAccuracy && (err.code === 2 || err.code === 3)) {
                        // High accuracy failed → retry with low accuracy (WiFi/cell)
                        console.log("⚠️ GPS preciso no disponible o tardó mucho, usando WiFi/antenas...")
                        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
                        tryWatch(false)
                    } else {
                        handleGpsError(err)
                    }
                },
                // Critical fix: maximumAge 0 forces fresh GPS poll. 60s timeout.
                { enableHighAccuracy: highAccuracy, maximumAge: 0, timeout: highAccuracy ? 60000 : 120000 }
            )
        }
        tryWatch(true)
    }, [onPosition, handleGpsError])

    const pauseRecording = () => { setState("paused"); if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); if (timerRef.current) clearInterval(timerRef.current); releaseWakeLock(); }
    const resumeRecording = () => { setState("recording"); timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000); watchIdRef.current = navigator.geolocation.watchPosition(onPosition, handleGpsError, { enableHighAccuracy: true, maximumAge: 0, timeout: 60000 }); requestWakeLock(); }
    const stopRecording = () => { setState("done"); if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); if (timerRef.current) clearInterval(timerRef.current); setFollowUser(false); releaseWakeLock(); }

    const saveRoute = async () => {
        if (points.length < 2) return; setSaving(true)
        try {
            const res = await fetch("/api/user/recorded-routes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title || `Ruta ${new Date().toLocaleDateString("es-ES")}`, coordinates: points.map(p => [p.lng, p.lat, p.alt, p.time]), distance, elevationGain: elevation, duration: elapsed, startedAt: new Date(startTimeRef.current).toISOString(), finishedAt: new Date().toISOString() }) })
            if (res.ok) { setSaved(true); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000) }
        } catch { }; setSaving(false)
    }

    const resetAll = () => {
        setState("idle"); setPoints([]); setDistance(0); setElevation(0); setElapsed(0)
        setSaved(false); setTitle(""); setGpsError("none"); setFollowUser(true); setAccuracy(null); lastPointRef.current = null
        polylineRef.current?.setLatLngs([]); if (markerRef.current) { mapInstance.current?.removeLayer(markerRef.current); markerRef.current = null }
        if (startMarkerRef.current) { mapInstance.current?.removeLayer(startMarkerRef.current); startMarkerRef.current = null }
        if (accuracyCircleRef.current) { mapInstance.current?.removeLayer(accuracyCircleRef.current); accuracyCircleRef.current = null }
        mapInstance.current?.setView([40.0, -3.5], 6)
    }

    const centerOnUser = () => { if (points.length > 0) { const l = points[points.length - 1]; mapInstance.current?.setView([l.lat, l.lng], 15); setFollowUser(true) } }

    useEffect(() => { return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); if (timerRef.current) clearInterval(timerRef.current); releaseWakeLock(); } }, [])

    const km = Math.round(distance / 100) / 10
    const speed = elapsed > 0 ? ((distance / 1000) / (elapsed / 3600)).toFixed(1) : "0.0"
    const isActive = state === "recording" || state === "paused"

    return (
        <div className="min-h-screen bg-niebla flex flex-col">
            <nav className="bg-pizarra text-white py-2.5 flex-shrink-0">
                <div className="max-w-lg mx-auto px-4 flex items-center justify-between">
                    <Link href="/mis-rutas" className="text-musgo-light hover:text-white transition text-sm">← Mis rutas</Link>
                    <div className="flex items-center gap-2">
                        {isActive && <span className={`w-2 h-2 rounded-full ${state === "recording" ? "bg-green-400 animate-pulse" : "bg-amber-400"}`} />}
                        <span className="text-sm font-medium">{isActive ? fmt(elapsed) : "Grabar Ruta"}</span>
                    </div>
                    <MountainIcon className="w-4 h-4 text-white/50" />
                </div>
            </nav>

            {showConfetti && <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"><div className="text-6xl animate-bounce">🎉</div></div>}
            {gpsError !== "none" && <div className="max-w-lg mx-auto px-4 py-4"><GpsHelp type={gpsError} onRetry={() => { setGpsError("none"); startRecording() }} /></div>}

            {gpsError === "none" && (
                <>
                    {/* MAP */}
                    <div className="relative flex-1 min-h-[55vh]">
                        <div ref={mapRef} className="absolute inset-0" />

                        {/* Layer picker */}
                        <div className="absolute top-3 left-3 z-[1000]">
                            <button onClick={() => setShowLayerPicker(!showLayerPicker)} className="w-10 h-10 bg-white rounded-lg shadow-lg border border-roca-dark/20 flex items-center justify-center text-lg hover:bg-niebla transition" title="Cambiar mapa">
                                {LAYERS[activeLayer].icon}
                            </button>
                            {showLayerPicker && (
                                <div className="absolute top-12 left-0 bg-white rounded-xl shadow-xl border border-roca-dark/20 overflow-hidden min-w-[160px]">
                                    {(Object.keys(LAYERS) as MapLayer[]).map(k => (
                                        <button key={k} onClick={() => switchLayer(k)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-niebla transition text-left ${activeLayer === k ? "bg-musgo/10 text-musgo font-medium" : "text-pizarra"}`}>
                                            <span className="text-lg">{LAYERS[k].icon}</span>
                                            <span>{LAYERS[k].name}</span>
                                            {activeLayer === k && <span className="ml-auto text-musgo">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Map controls overlay */}
                        {isActive && (
                            <div className="absolute bottom-3 left-3 z-[1000] flex gap-2">
                                <button onClick={centerOnUser} className="w-10 h-10 bg-white rounded-full shadow-lg border border-roca-dark/20 flex items-center justify-center text-lg hover:bg-niebla transition">📍</button>
                                <button onClick={() => setFollowUser(!followUser)} className={`px-3 h-10 rounded-full shadow-lg border text-xs font-medium transition ${followUser ? "bg-musgo text-white border-musgo" : "bg-white text-granito border-roca-dark/20"}`}>
                                    {followUser ? "🔒 Siguiendo" : "🔓 Libre"}
                                </button>
                            </div>
                        )}

                        {/* GPS searching */}
                        {state === "recording" && points.length === 0 && (
                            <div className="absolute inset-0 z-[999] bg-pizarra/60 flex items-center justify-center">
                                <div className="text-center text-white space-y-3">
                                    <p className="text-3xl animate-pulse">📡</p>
                                    <p className="font-bold">Buscando señal GPS...</p>
                                    <p className="text-sm text-white/70">Asegúrate de estar al aire libre</p>
                                    <button onClick={() => { stopRecording(); resetAll() }} className="mt-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition">
                                        ✕ Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats bar */}
                    <div className="flex-shrink-0 bg-white border-t border-roca-dark/15 shadow-inner">
                        <div className="max-w-lg mx-auto px-4 py-2">
                            {/* Accuracy indicator */}
                            <div className="flex justify-center mb-1.5">
                                <AccuracyBadge accuracy={state === "idle" ? null : accuracy} />
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div><DistanceIcon className="w-4 h-4 text-musgo mx-auto" /><p className="text-lg font-bold text-pizarra">{km}</p><p className="text-[10px] text-granito">km</p></div>
                                <div><ElevationIcon className="w-4 h-4 text-atardecer mx-auto" /><p className="text-lg font-bold text-pizarra">{Math.round(elevation)}</p><p className="text-[10px] text-granito">m ↑</p></div>
                                <div><DurationIcon className="w-4 h-4 text-lago mx-auto" /><p className="text-lg font-bold text-pizarra">{fmt(elapsed)}</p><p className="text-[10px] text-granito">tiempo</p></div>
                                <div><MapIcon className="w-4 h-4 text-granito mx-auto" /><p className="text-lg font-bold text-pizarra">{speed}</p><p className="text-[10px] text-granito">km/h</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-shrink-0 bg-niebla border-t border-roca-dark/10">
                        <div className="max-w-lg mx-auto px-4 py-3">
                            {state === "idle" && (
                                <div className="space-y-3">
                                    <button onClick={startRecording} className="w-full py-4 bg-musgo hover:bg-musgo-dark text-white rounded-xl text-lg font-bold transition shadow-lg shadow-musgo/30 flex items-center justify-center gap-2">
                                        <MapIcon className="w-6 h-6" /> Empezar a grabar
                                    </button>
                                    <div className="bg-lago/5 border border-lago/20 rounded-xl p-3">
                                        <p className="text-xs font-medium text-lago mb-1">💡 Consejos</p>
                                        <p className="text-[11px] text-granito">Sal al exterior · Usa mapa topográfico (⛰️) en montaña · Mantén pantalla activa</p>
                                    </div>
                                </div>
                            )}
                            {state === "recording" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={pauseRecording} className="py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition text-sm">⏸ Pausar</button>
                                    <button onClick={stopRecording} className="py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition text-sm">⏹ Finalizar</button>
                                </div>
                            )}
                            {state === "paused" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={resumeRecording} className="py-3.5 bg-musgo hover:bg-musgo-dark text-white rounded-xl font-bold transition text-sm">▶ Reanudar</button>
                                    <button onClick={stopRecording} className="py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition text-sm">⏹ Finalizar</button>
                                </div>
                            )}
                            {state === "done" && !saved && (
                                <div className="space-y-3">
                                    <div className="bg-musgo/5 border border-musgo/20 rounded-xl p-3 text-center">
                                        <p className="font-bold text-pizarra">🏔️ ¡Ruta completada!</p>
                                        <p className="text-sm text-granito">{km} km · {fmt(elapsed)} · +{Math.round(elevation)}m</p>
                                    </div>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nombre de la ruta (ej: Ruta del valle)"
                                        className="w-full px-4 py-3 bg-white border border-roca-dark/20 rounded-xl text-sm focus:ring-2 focus:ring-musgo/30 outline-none" />
                                    <button onClick={saveRoute} disabled={saving} className="w-full py-3.5 bg-musgo hover:bg-musgo-dark text-white rounded-xl font-bold transition disabled:opacity-50 flex items-center justify-center gap-2">
                                        {saving ? "Guardando..." : <><CheckIcon className="w-5 h-5" /> Guardar ruta</>}
                                    </button>
                                    <button onClick={resetAll} className="w-full py-2 text-sm text-granito hover:text-pizarra transition">Descartar</button>
                                </div>
                            )}
                            {saved && (
                                <div className="bg-musgo/10 border border-musgo/20 rounded-2xl p-5 text-center space-y-3">
                                    <MountainIcon className="w-10 h-10 text-musgo mx-auto" />
                                    <p className="font-bold text-pizarra text-lg">🎉 ¡Ruta guardada!</p>
                                    <p className="text-sm text-granito">{title || "Tu ruta"} · {km} km · +{Math.round(elevation)}m</p>
                                    <div className="flex gap-2 justify-center">
                                        <a href={`https://wa.me/?text=¡He completado ${km}km con PATHY! 🏔️`} target="_blank" rel="noopener" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">📱 WhatsApp</a>
                                        <button onClick={() => navigator.clipboard?.writeText(`¡He completado ${km}km con PATHY! 🏔️`)} className="px-4 py-2 bg-pizarra/10 hover:bg-pizarra/20 text-pizarra rounded-lg text-sm font-medium transition">📋 Copiar</button>
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <Link href="/mis-rutas" className="px-5 py-2.5 bg-musgo text-white rounded-xl text-sm font-medium hover:bg-musgo-dark transition">Ver mis rutas</Link>
                                        <button onClick={resetAll} className="px-5 py-2.5 bg-white border border-roca-dark/20 text-pizarra rounded-xl text-sm font-medium hover:bg-niebla transition">Grabar otra</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
