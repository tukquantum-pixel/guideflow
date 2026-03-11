"use client"

import { useEffect, useRef } from "react"

interface Props {
    geojson: string
    userPosition: { lat: number; lng: number } | null
}

export function FollowMap({ geojson, userPosition }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const mapRef = useRef<any>(null)
    const userMarkerRef = useRef<any>(null)
    const circleRef = useRef<any>(null)
    const initDone = useRef(false)

    useEffect(() => {
        if (!ref.current) return
        const container = ref.current

        // Destroy previous instance
        if (mapRef.current) { try { mapRef.current.remove() } catch { }; mapRef.current = null }
        // Clear orphan leaflet id from HMR
        if ((container as any)._leaflet_id) delete (container as any)._leaflet_id

        let cancelled = false

        const loadMap = async () => {
            const L = (await import("leaflet")).default
            if (cancelled || !ref.current) return

            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement("link"); link.rel = "stylesheet"
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(link)
            }

            const map = L.map(container, { zoomControl: false, attributionControl: false })
            mapRef.current = map

            L.control.zoom({ position: "topright" }).addTo(map)

            const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 })
            const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { maxZoom: 17 })
            const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 18 })
            osm.addTo(map)
            L.control.layers({ "Mapa": osm, "Topo": topo, "Satélite": sat }, {}, { position: "topright" }).addTo(map)

            try {
                const data = JSON.parse(geojson)
                const layer = L.geoJSON(data, { style: { color: "#2d6a4f", weight: 5, opacity: 0.9 } }).addTo(map)
                map.fitBounds(layer.getBounds(), { padding: [40, 40] })

                const coords = data.geometry?.coordinates || []
                if (coords.length >= 2) {
                    L.marker([coords[0][1], coords[0][0]], { icon: emojiIcon(L, "🟢") }).addTo(map).bindPopup("Inicio")
                    L.marker([coords[coords.length - 1][1], coords[coords.length - 1][0]], { icon: emojiIcon(L, "🔴") }).addTo(map).bindPopup("Fin")
                }
            } catch { /* invalid geojson */ }
        }
        loadMap()

        return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
    }, [geojson])

    // Update user position marker
    useEffect(() => {
        const map = mapRef.current
        if (!map || !userPosition) return
        import("leaflet").then(({ default: L }) => {
            if (userMarkerRef.current) { userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]) }
            else {
                userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
                    icon: L.divIcon({ html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,.5)"></div>`, className: "bg-transparent border-none", iconSize: [18, 18], iconAnchor: [9, 9] }),
                    zIndexOffset: 1000,
                }).addTo(map)
            }
            if (circleRef.current) { circleRef.current.setLatLng([userPosition.lat, userPosition.lng]) }
            else { circleRef.current = L.circle([userPosition.lat, userPosition.lng], { radius: 20, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1 }).addTo(map) }
            if (!initDone.current) { map.setView([userPosition.lat, userPosition.lng], 16); initDone.current = true }
        })
    }, [userPosition])

    return <div ref={ref} className="w-full h-full" />
}

function emojiIcon(L: any, emoji: string) {
    return L.divIcon({ html: `<span style="font-size:22px">${emoji}</span>`, className: "bg-transparent border-none", iconSize: [28, 28], iconAnchor: [14, 14] })
}
