"use client"

import { useState } from "react"
import { type MapLayer, TILE_LAYERS } from "@/lib/map-utils"

interface Props {
    current: MapLayer
    onChange: (layer: MapLayer) => void
    className?: string
}

export function MapLayerControl({ current, onChange, className = "" }: Props) {
    const [open, setOpen] = useState(false)
    return (
        <div className={`absolute top-2 right-2 z-[1000] ${className}`}>
            <button onClick={() => setOpen(!open)} className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-sm hover:bg-gray-50 transition border border-gray-200" title="Capas de mapa">
                🗺️
            </button>
            {open && (
                <div className="mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[140px]">
                    {(Object.keys(TILE_LAYERS) as MapLayer[]).map(k => (
                        <button key={k} onClick={() => { onChange(k); setOpen(false) }}
                            className={`w-full px-3 py-2 text-xs text-left flex items-center gap-2 hover:bg-gray-50 transition ${k === current ? "bg-musgo/10 text-musgo font-medium" : "text-pizarra"}`}>
                            {TILE_LAYERS[k].icon} {TILE_LAYERS[k].name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
