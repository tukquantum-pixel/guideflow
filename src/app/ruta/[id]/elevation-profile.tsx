"use client"

import { useMemo, useRef, useCallback } from "react"

interface Point { dist: number; ele: number; idx: number }

interface Props {
    geojson: string
    onHover?: (index: number | null) => void
}

export function ElevationProfile({ geojson, onHover }: Props) {
    const points = useMemo(() => extractPoints(geojson), [geojson])
    const svgRef = useRef<SVGSVGElement>(null)

    const handleMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!onHover || !svgRef.current || points.length < 2) return
        const rect = svgRef.current.getBoundingClientRect()
        const xPct = (e.clientX - rect.left) / rect.width
        const idx = Math.round(xPct * (points.length - 1))
        if (idx >= 0 && idx < points.length) onHover(points[idx].idx)
    }, [onHover, points])

    const handleLeave = useCallback(() => { if (onHover) onHover(null) }, [onHover])

    if (points.length < 2) return null

    const maxDist = points[points.length - 1].dist
    const minEle = Math.min(...points.map(p => p.ele))
    const maxEle = Math.max(...points.map(p => p.ele))
    const range = maxEle - minEle || 1
    const W = 700, H = 160, P = 30

    const toX = (d: number) => P + (d / maxDist) * (W - 2 * P)
    const toY = (e: number) => P + (1 - (e - minEle) / range) * (H - 2 * P)
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.dist).toFixed(1)},${toY(p.ele).toFixed(1)}`).join(" ")
    const fill = `${path} L${toX(maxDist).toFixed(1)},${toY(minEle).toFixed(1)} L${toX(0).toFixed(1)},${toY(minEle).toFixed(1)} Z`

    // Mid-point labels
    const midEle = Math.round(minEle + range / 2)
    const midDist = maxDist / 2

    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-pizarra mb-2">📈 Perfil de elevación</h3>
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto cursor-crosshair"
                onMouseMove={handleMove} onMouseLeave={handleLeave}>
                <defs>
                    <linearGradient id="elGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2d6a4f" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <path d={fill} fill="url(#elGrad)" />
                <path d={path} fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinejoin="round" />
                {/* Grid lines */}
                <line x1={P} y1={toY(maxEle)} x2={W - P} y2={toY(maxEle)} stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1={P} y1={toY(midEle)} x2={W - P} y2={toY(midEle)} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1={P} y1={toY(minEle)} x2={W - P} y2={toY(minEle)} stroke="#e5e7eb" strokeWidth="0.5" />
                {/* Y labels */}
                <text x={P - 4} y={toY(maxEle)} fontSize="9" fill="#6b7280" textAnchor="end" dominantBaseline="middle">{Math.round(maxEle)}m</text>
                <text x={P - 4} y={toY(midEle)} fontSize="9" fill="#6b7280" textAnchor="end" dominantBaseline="middle">{midEle}m</text>
                <text x={P - 4} y={toY(minEle)} fontSize="9" fill="#6b7280" textAnchor="end" dominantBaseline="middle">{Math.round(minEle)}m</text>
                {/* X labels */}
                <text x={toX(0)} y={H - 4} fontSize="9" fill="#6b7280" textAnchor="start">0km</text>
                <text x={toX(midDist)} y={H - 4} fontSize="9" fill="#6b7280" textAnchor="middle">{(midDist / 1000).toFixed(1)}km</text>
                <text x={toX(maxDist)} y={H - 4} fontSize="9" fill="#6b7280" textAnchor="end">{(maxDist / 1000).toFixed(1)}km</text>
            </svg>
            <p className="text-xs text-granito mt-1 text-center">Pasa el ratón sobre el perfil para ver el punto en el mapa</p>
        </div>
    )
}

function extractPoints(geojson: string): Point[] {
    try {
        const data = JSON.parse(geojson)
        const coords: number[][] = data.geometry?.coordinates || []
        if (!coords.length || !coords[0]?.[2]) return []
        let dist = 0
        return coords.map((c, i) => {
            if (i > 0) dist += haversine(coords[i - 1][1], coords[i - 1][0], c[1], c[0])
            return { dist, ele: c[2] || 0, idx: i }
        })
    } catch { return [] }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
