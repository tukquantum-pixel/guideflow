"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { Checkpoint } from "./types"
import { TILE_LAYERS, TRACK_STYLE, startMarkerHtml, endMarkerHtml, ensureLeafletCss, cleanMapContainer, type MapLayer } from "@/lib/map-utils"
import { MapLayerControl } from "@/components/map-layer-control"

const CP_ICONS: Record<string, string> = {
    viewpoint: "👁️", water: "💧", shelter: "🏕️", summit: "⛰️",
    photo_spot: "📸", danger: "⚠️", rest: "🪑", food: "🍽️",
}

interface Props {
    geojson: string
    checkpoints: Checkpoint[]
    meetingLat?: number | null
    meetingLng?: number | null
    onMapReady?: (map: any, coords: number[][], leaflet: any) => void
}

export function RouteMap({ geojson, checkpoints, meetingLat, meetingLng, onMapReady }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const mapRef = useRef<any>(null)
    const tileRef = useRef<any>(null)
    const [layer, setLayer] = useState<MapLayer>("street")

    const switchLayer = useCallback((newLayer: MapLayer) => {
        setLayer(newLayer)
        if (!mapRef.current) return
        import("leaflet").then(({ default: L }) => {
            if (tileRef.current) mapRef.current.removeLayer(tileRef.current)
            const cfg = TILE_LAYERS[newLayer]
            tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom || 19 }).addTo(mapRef.current)
        })
    }, [])

    useEffect(() => {
        if (!ref.current) return
        const container = ref.current
        cleanMapContainer(container, mapRef)
        let cancelled = false

        const loadMap = async () => {
            const L = (await import("leaflet")).default
            if (cancelled || !ref.current) return
            ensureLeafletCss()

            const map = L.map(container, { scrollWheelZoom: true })
            mapRef.current = map
            const cfg = TILE_LAYERS[layer]
            tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom || 19 }).addTo(map)

            let coords: number[][] = []
            try {
                const data = JSON.parse(geojson)
                const trackLayer = L.geoJSON(data, { style: TRACK_STYLE }).addTo(map)
                map.fitBounds(trackLayer.getBounds(), { padding: [30, 30] })
                coords = data.geometry?.coordinates || []
                if (coords.length >= 2) {
                    L.marker([coords[0][1], coords[0][0]], { icon: L.divIcon({ html: startMarkerHtml, iconSize: [28, 28], iconAnchor: [14, 28], className: "" }) }).addTo(map).bindPopup("Inicio")
                    L.marker([coords[coords.length - 1][1], coords[coords.length - 1][0]], { icon: L.divIcon({ html: endMarkerHtml, iconSize: [28, 28], iconAnchor: [14, 28], className: "" }) }).addTo(map).bindPopup("Fin")
                }
            } catch { /* invalid geojson */ }

            checkpoints.forEach(cp => {
                const icon = CP_ICONS[cp.type] || "📌"
                L.marker([cp.lat, cp.lng], { icon: L.divIcon({ html: `<span style="font-size:22px">${icon}</span>`, className: "bg-transparent border-none", iconSize: [28, 28], iconAnchor: [14, 14] }) })
                    .addTo(map).bindPopup(`<b>${cp.name}</b>${cp.elevation ? `<br>${Math.round(cp.elevation)}m` : ""}${cp.description ? `<br><small>${cp.description}</small>` : ""}`)
            })

            if (meetingLat && meetingLng) {
                L.marker([meetingLat, meetingLng], { icon: L.divIcon({ html: `<span style="font-size:22px">📍</span>`, className: "bg-transparent border-none", iconSize: [28, 28], iconAnchor: [14, 14] }) }).addTo(map).bindPopup("Punto de encuentro")
            }

            if (onMapReady) onMapReady(map, coords, L)
        }
        loadMap()

        return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
    }, [geojson, checkpoints, meetingLat, meetingLng, onMapReady])

    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl overflow-hidden relative">
            <MapLayerControl current={layer} onChange={switchLayer} />
            <div ref={ref} style={{ height: 400 }} className="w-full" />
        </div>
    )
}
