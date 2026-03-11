/** Haversine distance in meters between two lat/lon points */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Min distance from a point to any coordinate in a GeoJSON LineString (sampled) */
export function minDistToCoords(lat: number, lon: number, coords: number[][], sampleRate = 10): number {
    let min = Infinity
    for (let i = 0; i < coords.length; i += sampleRate) {
        const [cLon, cLat] = coords[i] // GeoJSON: [lon, lat]
        const d = haversine(lat, lon, cLat, cLon)
        if (d < min) min = d
    }
    return min
}
