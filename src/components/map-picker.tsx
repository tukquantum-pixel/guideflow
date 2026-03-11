"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { PinIcon } from "@/components/icons"
import { TILE_LAYERS, pinMarkerHtml, ensureLeafletCss, cleanMapContainer, type MapLayer } from "@/lib/map-utils"
import { MapLayerControl } from "./map-layer-control"

interface Props {
    lat: number | null
    lng: number | null
    address: string
    onChange: (lat: number, lng: number) => void
}

let lastGeoTime = 0

export function MapPicker({ lat, lng, address, onChange }: Props) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapObjRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)
    const iconRef = useRef<L.DivIcon | null>(null)
    const tileRef = useRef<any>(null)
    const [searching, setSearching] = useState(false)
    const [geoError, setGeoError] = useState("")
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(lat && lng ? { lat, lng } : null)
    const [layer, setLayer] = useState<MapLayer>("street")

    const handleChange = useCallback((newLat: number, newLng: number) => {
        setCoords({ lat: newLat, lng: newLng })
        onChange(newLat, newLng)
    }, [onChange])

    const switchLayer = useCallback((newLayer: MapLayer) => {
        setLayer(newLayer)
        if (!mapObjRef.current) return
        import("leaflet").then(({ default: L }) => {
            if (tileRef.current) mapObjRef.current!.removeLayer(tileRef.current)
            const cfg = TILE_LAYERS[newLayer]
            tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom || 19 }).addTo(mapObjRef.current!)
        })
    }, [])

    useEffect(() => {
        if (!mapRef.current) return
        const container = mapRef.current
        cleanMapContainer(container, mapObjRef)
        markerRef.current = null

        const loadMap = async () => {
            const L = (await import("leaflet")).default
            ensureLeafletCss()

            const map = L.map(container, { scrollWheelZoom: true }).setView([lat || 42.2, lng || -0.5], lat ? 14 : 7)
            mapObjRef.current = map

            const cfg = TILE_LAYERS[layer]
            tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom || 19 }).addTo(map)

            const icon = L.divIcon({ html: pinMarkerHtml(), iconSize: [28, 28], iconAnchor: [14, 28], className: "" })
            iconRef.current = icon

            function placeMarker(pos: { lat: number; lng: number }) {
                if (markerRef.current) { markerRef.current.setLatLng([pos.lat, pos.lng]) }
                else { const m = L.marker([pos.lat, pos.lng], { icon, draggable: true }).addTo(map); m.on("dragend", () => { const p = m.getLatLng(); handleChange(p.lat, p.lng) }); markerRef.current = m }
                handleChange(pos.lat, pos.lng)
            }
            if (lat && lng) placeMarker({ lat, lng })
            map.on("click", (e: L.LeafletMouseEvent) => placeMarker(e.latlng))
        }
        loadMap()

        return () => { if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null; markerRef.current = null } }
    }, [])

    async function searchAddress() {
        if (!address.trim()) return
        const now = Date.now()
        if (now - lastGeoTime < 1100) { setGeoError("⏳ Espera un momento"); return }
        lastGeoTime = now; setSearching(true); setGeoError("")
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&accept-language=es`, { headers: { "User-Agent": "PATHY/1.0" } })
            const data = await res.json()
            if (data.length > 0) {
                const nLat = parseFloat(data[0].lat), nLng = parseFloat(data[0].lon)
                handleChange(nLat, nLng)
                if (mapObjRef.current) mapObjRef.current.setView([nLat, nLng], 14)
                if (markerRef.current) { markerRef.current.setLatLng([nLat, nLng]) }
                else if (mapObjRef.current && iconRef.current) {
                    const L = (await import("leaflet")).default
                    const m = L.marker([nLat, nLng], { icon: iconRef.current, draggable: true }).addTo(mapObjRef.current)
                    m.on("dragend", () => { const p = m.getLatLng(); handleChange(p.lat, p.lng) }); markerRef.current = m
                }
            } else { setGeoError("No se encontró. Pon el pin manualmente.") }
        } catch { setGeoError("Error de conexión. Pon el pin manualmente.") }
        setSearching(false)
    }

    return (
        <div>
            <label className="block text-sm font-medium text-pizarra mb-2"><PinIcon className="w-4 h-4 inline mr-1 text-musgo" /> Punto de encuentro en el mapa</label>
            <div className="flex gap-2 mb-2">
                <button type="button" onClick={searchAddress} disabled={searching || !address.trim()} className="px-4 py-2 bg-musgo/10 hover:bg-musgo/20 text-musgo text-sm font-medium rounded-lg transition disabled:opacity-50 shrink-0">
                    {searching ? "Buscando..." : "📍 Ubicar dirección"}
                </button>
                <span className="text-xs text-granito self-center">o haz clic en el mapa</span>
            </div>
            {geoError && <p className="text-xs text-atardecer mb-2">{geoError}</p>}
            <div className="relative">
                <MapLayerControl current={layer} onChange={switchLayer} />
                <div ref={mapRef} className="w-full h-64 rounded-xl border border-roca-dark/20 overflow-hidden z-0" />
            </div>
            {coords && <p className="text-xs text-granito mt-1">📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>}
        </div>
    )
}
