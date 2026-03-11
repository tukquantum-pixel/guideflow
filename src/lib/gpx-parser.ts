import { DOMParser } from "@xmldom/xmldom"
import * as toGeoJSON from "@tmcw/togeojson"

interface TrackStats {
    distance: number       // meters
    elevationGain: number  // meters
    elevationLoss: number  // meters
    durationEst: number    // seconds (Naismith's rule)
    geojson: string        // stringified GeoJSON
}

export function parseGPX(gpxContent: string): TrackStats {
    const parser = new DOMParser()
    const doc = parser.parseFromString(gpxContent, "text/xml")
    const geojson = toGeoJSON.gpx(doc)
    const coords = extractCoords(geojson)
    const distance = calcDistance(coords)
    const { gain, loss } = calcElevation(coords)
    const durationEst = Math.round((distance / 1000) * 720 + (gain / 600) * 3600) // Naismith: 12min/km + 1h/600m gain
    return { distance, elevationGain: gain, elevationLoss: loss, durationEst, geojson: JSON.stringify(geojson) }
}

function extractCoords(geojson: GeoJSON.FeatureCollection): number[][] {
    const coords: number[][] = []
    for (const feature of geojson.features) {
        const geom = feature.geometry
        if (geom.type === "LineString") coords.push(...(geom.coordinates as number[][]))
        else if (geom.type === "MultiLineString") for (const line of (geom.coordinates as number[][][])) coords.push(...line)
    }
    return coords
}

function calcDistance(coords: number[][]): number {
    let d = 0
    for (let i = 1; i < coords.length; i++) d += haversine(coords[i - 1], coords[i])
    return d
}

function calcElevation(coords: number[][]): { gain: number; loss: number } {
    let gain = 0, loss = 0
    for (let i = 1; i < coords.length; i++) {
        const ele1 = coords[i - 1][2], ele2 = coords[i][2]
        if (ele1 != null && ele2 != null) {
            const diff = ele2 - ele1
            if (diff > 0) gain += diff; else loss += Math.abs(diff)
        }
    }
    return { gain: Math.round(gain), loss: Math.round(loss) }
}

function haversine(a: number[], b: number[]): number {
    const R = 6371000
    const toRad = (x: number) => (x * Math.PI) / 180
    const dLat = toRad(b[1] - a[1])
    const dLon = toRad(b[0] - a[0])
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}
