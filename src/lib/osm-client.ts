// Overpass API client — fetches QUALITY hiking routes (GR/PR/SL, official networks)
const OVERPASS_API = "https://overpass-api.de/api/interpreter"

export interface OsmRoute {
    id: number
    name: string
    distance: number
    elevationGain: number
    coordinates: { lat: number; lng: number; ele?: number }[]
    tags: Record<string, string>
}

interface OsmElement {
    type: string; id: number; lat?: number; lon?: number
    nodes?: number[]; members?: { type: string; ref: number; role: string }[]
    tags?: Record<string, string>
}

export async function fetchHikingRoutes(
    bbox: { south: number; west: number; north: number; east: number },
    limit = 50,
): Promise<OsmRoute[]> {
    const { south, west, north, east } = bbox
    const b = `${south},${west},${north},${east}`

    // Query: only official hiking routes (GR/PR/SL) + network-classified routes
    const query = `
        [out:json][timeout:90];
        (
          relation["route"="hiking"]["ref"~"^(GR|PR|SL)"](${b});
          relation["route"="hiking"]["network"~"^(iwn|nwn|rwn|lwn)$"](${b});
          relation["route"="foot"]["ref"~"^(GR|PR|SL)"](${b});
          way["route"="hiking"]["ref"~"^(GR|PR|SL)"](${b});
        );
        out body;
        >;
        out skel qt;
    `
    const res = await fetch(OVERPASS_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
    })
    if (!res.ok) throw new Error(`Overpass API error: ${res.status}`)
    const data = await res.json()
    return parseOsmResponse(data, limit)
}

const EXCLUDE_WORDS = ["calle", "carrer", "rue", "street", "plaza", "avenida", "paseo", "parking"]
const MIN_DISTANCE = 3000 // 3km minimum

function parseOsmResponse(data: { elements: OsmElement[] }, limit: number): OsmRoute[] {
    const nodes = new Map<number, { lat: number; lon: number }>()
    const ways = new Map<number, number[]>()
    const relations: OsmElement[] = []
    const standaloneWays: OsmElement[] = []

    for (const el of data.elements) {
        if (el.type === "node" && el.lat && el.lon) nodes.set(el.id, { lat: el.lat, lon: el.lon })
        if (el.type === "way" && el.nodes) {
            ways.set(el.id, el.nodes)
            if (el.tags?.name) standaloneWays.push(el)
        }
        if (el.type === "relation" && el.tags?.name) relations.push(el)
    }

    const routes: OsmRoute[] = []

    // Process relations first (these are complete route definitions)
    for (const rel of relations) {
        const coords = resolveRelationCoords(rel, ways, nodes)
        if (coords.length < 2) continue
        const dist = calcDistance(coords)
        if (dist < MIN_DISTANCE) continue
        if (isUrban(rel.tags?.name || "")) continue
        routes.push(buildRoute(rel, coords, dist))
    }

    // Then standalone ways with route tags (fallback)
    for (const way of standaloneWays) {
        if (routes.some(r => r.name === way.tags!.name)) continue
        const coords = (way.nodes || []).map(nid => nodes.get(nid)).filter(Boolean).map(n => ({ lat: n!.lat, lng: n!.lon }))
        const dist = calcDistance(coords)
        if (dist < MIN_DISTANCE) continue
        if (isUrban(way.tags?.name || "")) continue
        routes.push(buildRoute(way, coords, dist))
    }

    return routes.sort((a, b) => b.distance - a.distance).slice(0, limit)
}

function resolveRelationCoords(
    rel: OsmElement,
    waysMap: Map<number, number[]>,
    nodesMap: Map<number, { lat: number; lon: number }>,
): { lat: number; lng: number }[] {
    const coords: { lat: number; lng: number }[] = []
    for (const member of rel.members || []) {
        if (member.type !== "way") continue
        const nodeIds = waysMap.get(member.ref)
        if (!nodeIds) continue
        for (const nid of nodeIds) {
            const n = nodesMap.get(nid)
            if (n) coords.push({ lat: n.lat, lng: n.lon })
        }
    }
    return coords
}

function buildRoute(el: OsmElement, coords: { lat: number; lng: number }[], distance: number): OsmRoute {
    const ref = el.tags?.ref || ""
    const name = el.tags?.name || `Ruta ${ref || el.id}`
    return { id: el.id, name: ref ? `${ref} — ${name}` : name, distance, elevationGain: 0, coordinates: coords, tags: el.tags || {} }
}

function isUrban(name: string): boolean {
    const lower = name.toLowerCase()
    return EXCLUDE_WORDS.some(w => lower.includes(w))
}

function calcDistance(coords: { lat: number; lng: number }[]): number {
    let total = 0
    for (let i = 1; i < coords.length; i++) {
        const R = 6371000
        const dLat = (coords[i].lat - coords[i - 1].lat) * Math.PI / 180
        const dLng = (coords[i].lng - coords[i - 1].lng) * Math.PI / 180
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(coords[i - 1].lat * Math.PI / 180) * Math.cos(coords[i].lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
        total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    return Math.round(total)
}
