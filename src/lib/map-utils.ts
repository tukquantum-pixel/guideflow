// Shared map constants for consistent UX across PATHY
// All maps use these same layers, markers, and track styles

export type MapLayer = "street" | "satellite" | "topo"

export const TILE_LAYERS: Record<MapLayer, { name: string; icon: string; url: string; attr: string; maxZoom?: number }> = {
    street: { name: "Callejero", icon: "🗺️", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "© OSM" },
    satellite: { name: "Satélite", icon: "🛰️", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "© ESRI, Maxar" },
    topo: { name: "Topográfico 3D", icon: "🏔️", url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", attr: "© Google Terrain", maxZoom: 19 },
}

// Brand colors — musgo green
export const TRACK_COLOR = "#5B8C5A"
export const TRACK_WEIGHT = 4
export const TRACK_OPACITY = 0.85
export const TRACK_STYLE = { color: TRACK_COLOR, weight: TRACK_WEIGHT, opacity: TRACK_OPACITY }

// Marker HTML generators
export const markerHtml = (size = 24) =>
    `<div style="background:${TRACK_COLOR};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`

export const pinMarkerHtml = (size = 28) =>
    `<div style="background:${TRACK_COLOR};width:${size}px;height:${size}px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><svg width="${size / 2}" height="${size / 2}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 21s-8-4.5-8-11.2A8 8 0 0112 2a8 8 0 018 7.8c0 6.7-8 11.2-8 11.2z"/><circle cx="12" cy="10" r="3"/></svg></div>`

export const startMarkerHtml = `<div style="background:#22c55e;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:14px">🏁</div>`

export const endMarkerHtml = `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:14px">🔴</div>`

export const currentPosHtml = `<div style="width:18px;height:18px;border-radius:50%;background:${TRACK_COLOR};border:3px solid white;box-shadow:0 0 0 4px rgba(91,140,90,.3),0 2px 6px rgba(0,0,0,.3)"></div>`

// Ensure leaflet CSS is loaded (idempotent)
export function ensureLeafletCss() {
    if (typeof document === "undefined") return
    if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
    }
}

// Clean HMR orphan leaflet instances
export function cleanMapContainer(container: HTMLElement | null, mapRef: { current: any }) {
    if (mapRef.current) { try { mapRef.current.remove() } catch { /* noop */ }; mapRef.current = null }
    if (container && (container as any)._leaflet_id) delete (container as any)._leaflet_id
}
