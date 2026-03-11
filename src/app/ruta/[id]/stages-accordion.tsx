"use client"

import { useState } from "react"
import type { Stage } from "./types"
import { PinIcon, DistanceIcon, ElevationIcon, DurationIcon, HikingIcon, PhotoIcon, MountainIcon, CampingIcon, WarningIcon } from "@/components/icons"

// Checkpoint type icons — use inline SVGs for those without standalone files
const CP_ICON_MAP: Record<string, React.ReactNode> = {
    viewpoint: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8" /></svg>,
    water: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8 8 4 12 4 16a8 8 0 0016 0c0-4-4-8-8-14z" /></svg>,
    shelter: <CampingIcon className="w-4 h-4" />,
    summit: <MountainIcon className="w-4 h-4" />,
    photo_spot: <PhotoIcon className="w-4 h-4" />,
    danger: <WarningIcon className="w-4 h-4" />,
    rest: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 21h14M12 3v14M8 7l4-4 4 4" /></svg>,
    food: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 2v6m0 0a3 3 0 006 0V2M8 2v4M5 8v13M19 2v18l-4-4" /></svg>,
}
const DIFF_COLORS: Record<string, string> = { facil: "bg-musgo/20 text-musgo", media: "bg-lago/20 text-lago", dificil: "bg-atardecer/20 text-atardecer", muy_dificil: "bg-red-200 text-red-800" }

export function StagesAccordion({ stages }: { stages: Stage[] }) {
    const [open, setOpen] = useState<string | null>(stages[0]?.id || null)
    if (!stages.length) return null

    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl p-6">
            <h2 className="font-semibold text-pizarra text-lg mb-4 flex items-center gap-2"><PinIcon className="w-5 h-5" /> Etapas de la ruta ({stages.length})</h2>
            <div className="relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-musgo/20" />
                <div className="space-y-3">
                    {stages.map((s, i) => (
                        <div key={s.id} className="relative pl-10">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-musgo/10 border-2 border-musgo/30 flex items-center justify-center text-xs font-bold text-musgo z-10">{i + 1}</div>
                            <div className="border border-roca-dark/15 rounded-lg overflow-hidden">
                                <button onClick={() => setOpen(open === s.id ? null : s.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-niebla/50 transition text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-pizarra text-sm">{s.name}</span>
                                        {s.difficulty && <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFF_COLORS[s.difficulty] || "bg-roca text-granito"}`}>{s.difficulty}</span>}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-granito">
                                        {s.distance && <span className="flex items-center gap-1"><DistanceIcon className="w-3.5 h-3.5" /> {(s.distance / 1000).toFixed(1)}km</span>}
                                        {s.elevationGain && <span className="flex items-center gap-1"><ElevationIcon className="w-3.5 h-3.5" /> {Math.round(s.elevationGain)}m</span>}
                                        {s.duration && <span className="flex items-center gap-1"><DurationIcon className="w-3.5 h-3.5" /> {Math.round(s.duration / 60)}h</span>}
                                        <span className="text-lg">{open === s.id ? "▾" : "▸"}</span>
                                    </div>
                                </button>
                                {open === s.id && (
                                    <div className="px-4 pb-4 border-t border-roca-dark/10">
                                        {s.terrain && <p className="text-xs text-granito mt-2 flex items-center gap-1"><HikingIcon className="w-3.5 h-3.5" /> Terreno: {s.terrain}</p>}
                                        {s.description && <p className="text-sm text-granito mt-2 leading-relaxed">{s.description}</p>}
                                        {s.checkpoints.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-xs font-medium text-pizarra">Puntos de interés:</p>
                                                {s.checkpoints.map(cp => (
                                                    <div key={cp.id} className="flex items-start gap-2 ml-2">
                                                        <span className="text-sm">{CP_ICON_MAP[cp.type] || <PinIcon className="w-4 h-4" />}</span>
                                                        <div>
                                                            <p className="text-sm font-medium text-pizarra">{cp.name}</p>
                                                            {cp.description && <p className="text-xs text-granito">{cp.description}</p>}
                                                            {cp.elevation && <p className="text-xs text-granito">{Math.round(cp.elevation)}m altitud</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {s.photos.length > 0 && (
                                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                                {s.photos.map(p => (
                                                    <img key={p.id} src={p.url} alt={p.caption || s.name} className="w-28 h-20 object-cover rounded-lg shrink-0 hover:opacity-90 transition" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
