"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface RouteItem {
    id: string; name: string; distance: number | null; elevationGain: number | null
    routeType: string | null; activityId: string; activityTitle: string
    category: string; difficulty: string; lat: number; lng: number
}

const CAT_ICONS: Record<string, string> = {
    senderismo: "🥾", hiking: "🥾", climbing: "🧗", biking: "🚵", ski: "🎿", other: "🧭",
}
const DIF_LABEL: Record<string, string> = { LOW: "🟢 Fácil", MEDIUM: "🟡 Moderado", HIGH: "🔴 Difícil" }

export function ExplorarRutasClient() {
    const [routes, setRoutes] = useState<RouteItem[]>([])
    const [filtered, setFiltered] = useState<RouteItem[]>([])
    const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<RouteItem | null>(null)
    const [filter, setFilter] = useState("")
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<any>(null)
    const markersRef = useRef<any[]>([])

    // Load all routes
    useEffect(() => {
        fetch("/api/routes/all").then(r => r.json()).then(d => {
            setRoutes(d.routes || [])
            setFiltered(d.routes || [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    // Ask for geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
                () => { } // silent fail
            )
        }
    }, [])

    // Init map
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return
        import("leaflet").then(L => {
            if (!mapRef.current) return
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement("link")
                link.rel = "stylesheet"
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                document.head.appendChild(link)
            }
            if ((mapRef.current as any)._leaflet_id) delete (mapRef.current as any)._leaflet_id

            const map = L.map(mapRef.current, { scrollWheelZoom: true }).setView([40.0, -2.5], 6)
            mapInstance.current = map
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org">OSM</a>',
            }).addTo(map)
        })
        return () => { mapInstance.current?.remove(); mapInstance.current = null }
    }, [])

    // Place markers when routes or filter change
    useEffect(() => {
        if (!mapInstance.current || filtered.length === 0) return
        import("leaflet").then(L => {
            markersRef.current.forEach(m => mapInstance.current.removeLayer(m))
            markersRef.current = []

            filtered.forEach(r => {
                const icon = L.divIcon({
                    html: `<span style="font-size:20px">${CAT_ICONS[r.category] || "📍"}</span>`,
                    className: "bg-transparent border-none", iconSize: [24, 24], iconAnchor: [12, 12],
                })
                const m = L.marker([r.lat, r.lng], { icon }).addTo(mapInstance.current)
                    .bindPopup(`<b>${r.name}</b><br>${r.activityTitle}<br>${r.distance ? r.distance.toFixed(0) + "km" : ""}`)
                m.on("click", () => setSelected(r))
                markersRef.current.push(m)
            })

            if (userLoc) {
                const userIcon = L.divIcon({
                    html: '<span style="font-size:22px">📍</span>',
                    className: "bg-transparent border-none", iconSize: [24, 24], iconAnchor: [12, 12],
                })
                const um = L.marker([userLoc.lat, userLoc.lng], { icon: userIcon }).addTo(mapInstance.current)
                    .bindPopup("Tu ubicación").openPopup()
                markersRef.current.push(um)
                mapInstance.current.setView([userLoc.lat, userLoc.lng], 8)
            }
        })
    }, [filtered, userLoc])

    // Filter logic
    useEffect(() => {
        if (!filter) { setFiltered(routes); return }
        setFiltered(routes.filter(r =>
            r.name.toLowerCase().includes(filter.toLowerCase()) ||
            r.activityTitle.toLowerCase().includes(filter.toLowerCase()) ||
            r.category.toLowerCase().includes(filter.toLowerCase())
        ))
    }, [filter, routes])

    // Sort by distance to user
    function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }

    const sorted = userLoc
        ? [...filtered].sort((a, b) => haversine(userLoc.lat, userLoc.lng, a.lat, a.lng) - haversine(userLoc.lat, userLoc.lng, b.lat, b.lng))
        : filtered

    return (
        <div className="min-h-screen bg-niebla">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-pizarra">🗺️ Explorador de Rutas GR/PR/SL</h1>
                    <p className="text-granito mt-1">{loading ? "Cargando..." : `${routes.length} rutas oficiales verificadas en toda España`}</p>
                </div>

                <div className="grid md:grid-cols-5 gap-5">
                    {/* Map */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl border border-roca-dark/20 overflow-hidden shadow-sm">
                            <div className="p-3 bg-pizarra/5 border-b border-roca-dark/10 flex items-center justify-between">
                                <input
                                    type="text" value={filter} onChange={e => setFilter(e.target.value)}
                                    placeholder="Filtrar rutas por nombre, zona..."
                                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-roca-dark/20 focus:outline-none focus:ring-2 focus:ring-musgo/30"
                                />
                                <span className="ml-3 text-xs text-granito whitespace-nowrap">{filtered.length} rutas</span>
                            </div>
                            <div className="relative">
                                <div ref={mapRef} className="w-full h-[400px] md:h-[500px]" />
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-roca">
                                        <p className="text-3xl animate-pulse">🗺️</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Route list */}
                    <div className="md:col-span-2 space-y-3">
                        {userLoc && (
                            <div className="bg-musgo/10 border border-musgo/20 rounded-xl px-4 py-2">
                                <p className="text-xs text-musgo font-medium">📍 Rutas ordenadas por cercanía a tu ubicación</p>
                            </div>
                        )}

                        {selected && (
                            <div className="bg-lago/5 border border-lago/20 rounded-xl p-4">
                                <p className="font-bold text-pizarra">{CAT_ICONS[selected.category] || "🧭"} {selected.name}</p>
                                <p className="text-xs text-granito">{selected.activityTitle}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selected.distance && <span className="text-xs bg-roca px-2 py-0.5 rounded-full">{(selected.distance / 1000).toFixed(0)}km</span>}
                                    {selected.elevationGain && <span className="text-xs bg-roca px-2 py-0.5 rounded-full">+{selected.elevationGain.toFixed(0)}m</span>}
                                    {selected.routeType && <span className="text-xs bg-roca px-2 py-0.5 rounded-full">{selected.routeType}</span>}
                                    <span className="text-xs bg-roca px-2 py-0.5 rounded-full">{DIF_LABEL[selected.difficulty] || selected.difficulty}</span>
                                    {userLoc && <span className="text-xs bg-musgo/10 text-musgo px-2 py-0.5 rounded-full">
                                        A {haversine(userLoc.lat, userLoc.lng, selected.lat, selected.lng).toFixed(0)}km de ti
                                    </span>}
                                </div>
                                <Link href={`/ruta/${selected.activityId}`} className="inline-block mt-2 text-sm text-musgo hover:text-musgo-dark font-medium">
                                    Ver ruta completa →
                                </Link>
                            </div>
                        )}

                        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
                            {sorted.slice(0, 20).map((r, i) => (
                                <button key={r.id} onClick={() => { setSelected(r); mapInstance.current?.setView([r.lat, r.lng], 10) }}
                                    className={`w-full text-left bg-white border rounded-xl p-3 hover:shadow-md transition ${selected?.id === r.id ? "border-lago ring-1 ring-lago/30" : "border-roca-dark/20"}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{CAT_ICONS[r.category] || "📍"}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-pizarra truncate">{r.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {r.distance && <span className="text-xs text-granito">{(r.distance / 1000).toFixed(0)}km</span>}
                                                {userLoc && <span className="text-xs text-musgo">📍 {haversine(userLoc.lat, userLoc.lng, r.lat, r.lng).toFixed(0)}km</span>}
                                                <span className="text-xs text-granito">{DIF_LABEL[r.difficulty] || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {sorted.length > 20 && (
                            <p className="text-xs text-granito text-center">Mostrando 20 de {sorted.length} — usa el filtro para encontrar más</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
