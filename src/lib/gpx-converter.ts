import { OsmRoute } from "./osm-client"

export function routeToGpx(route: OsmRoute): string {
    const points = route.coordinates
        .map(c => `      <trkpt lat="${c.lat}" lon="${c.lng}">${c.ele ? `<ele>${c.ele}</ele>` : ""}</trkpt>`)
        .join("\n")

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="PATHY OSM Importer">
  <trk>
    <name>${escapeXml(route.name)}</name>
    <trkseg>
${points}
    </trkseg>
  </trk>
</gpx>`
}

export function routeToGeojson(route: OsmRoute): string {
    return JSON.stringify({
        type: "Feature",
        properties: { name: route.name, distance: route.distance },
        geometry: {
            type: "LineString",
            coordinates: route.coordinates.map(c => [c.lng, c.lat]),
        },
    })
}

function escapeXml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
