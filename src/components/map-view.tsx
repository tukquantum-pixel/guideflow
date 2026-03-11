"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { TILE_LAYERS, TRACK_STYLE, markerHtml, ensureLeafletCss, cleanMapContainer, type MapLayer } from "@/lib/map-utils"
import { MapLayerControl } from "./map-layer-control"

interface Props {
    lat: number
    lng: number
    address?: string
    className?: string
    interactive?: boolean
    trackGeoJSON?: string
    showLayerControl?: boolean
}

export function MapView({ lat, lng, address, className = "w-full h-48", interactive = false, trackGeoJSON, showLayerControl = true }: Props) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapObjRef = useRef<any>(null)
    const tileRef = useRef<any>(null)
    const [layer, setLayer] = useState<MapLayer>("street")

    const switchLayer = useCallback((newLayer: MapLayer) => {
        setLayer(newLayer)
        if (!mapObjRef.current) return
        import("leaflet").then(({ default: L }) => {
            if (tileRef.current) mapObjRef.current.removeLayer(tileRef.current)
            const cfg = TILE_LAYERS[newLayer]
            tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom || 19 }).addTo(mapObjRef.current)
        })
    }, [])

    useEffect(() => {
        if (!mapRef.current) return
        const container = mapRef.current
        cleanMapContainer(container, mapObjRef)
        let cancelled = false

        const loadMap = async () => {
            const L = (await import("leaflet")).default
            if (cancelled) return
            ensureLeafletCss()

            const map = L.map(container, { scrollWheelZoom: interactive, zoomControl: true, dragging: true, touchZoom: true }).setView([lat, lng], 14)
            mapObjRef.current = map

            const cfg = TILE_LAYERS[layer]
            tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attr, maxZoom: cfg.maxZoom || 19 }).addTo(map)

            if (trackGeoJSON) {
                try {
                    const trackLayer = L.geoJSON(JSON.parse(trackGeoJSON), { style: TRACK_STYLE }).addTo(map)
                    map.fitBounds(trackLayer.getBounds(), { padding: [30, 30] })
                } catch { /* ignore invalid geojson */ }
            }

            const icon = L.divIcon({ html: markerHtml(), iconSize: [24, 24], iconAnchor: [12, 24], className: "" })
            const marker = L.marker([lat, lng], { icon }).addTo(map)
            if (address) marker.bindPopup(`<b>📍 Punto de encuentro</b><br/>${address}`).openPopup()
        }
        loadMap()

        return () => { cancelled = true; cleanMapContainer(mapRef.current!, mapObjRef) }
    }, [lat, lng, trackGeoJSON, interactive, address])

    return (
        <div className={`${className} rounded-xl overflow-hidden border border-roca-dark/20 relative`}>
            {showLayerControl && <MapLayerControl current={layer} onChange={switchLayer} />}
            <div ref={mapRef} className="w-full h-full" />
        </div>
    )
}
