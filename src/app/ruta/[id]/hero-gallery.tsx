"use client"

import { useState } from "react"
import type { Activity } from "./types"
import { MountainIcon, PhotoIcon } from "@/components/icons"

export function HeroGallery({ photos, title, difficulty, category }: Pick<Activity, "photos" | "title" | "difficulty" | "category">) {
    const [lightbox, setLightbox] = useState<number | null>(null)
    const diffLabel = difficulty === "LOW" ? "Fácil" : difficulty === "HIGH" ? "Difícil" : "Moderado"
    const diffColor = difficulty === "LOW" ? "bg-musgo" : difficulty === "HIGH" ? "bg-atardecer" : "bg-lago"

    return (
        <>
            <div className="relative h-72 md:h-[420px] overflow-hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-1 md:rounded-b-2xl">
                <div className="md:col-span-3 md:row-span-2 relative cursor-pointer" onClick={() => photos[0] && setLightbox(0)}>
                    {photos[0] ? (
                        <img src={photos[0]} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pizarra via-pizarra-dark to-musgo/30 flex flex-col items-center justify-center gap-4">
                            <MountainIcon className="w-20 h-20 opacity-30 text-white" />
                            <p className="text-white/20 text-sm font-medium tracking-wider uppercase">Sin fotos disponibles</p>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-pizarra/80 via-pizarra/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex gap-2">
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold text-white ${diffColor} shadow-lg backdrop-blur-sm`}>{diffLabel}</span>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-pizarra/60 backdrop-blur-sm shadow-lg">{category}</span>
                    </div>
                    {photos.length > 3 && (
                        <button className="absolute bottom-5 right-5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
                            <span className="flex items-center gap-1"><PhotoIcon className="w-3.5 h-3.5" /> Ver {photos.length} fotos</span>
                        </button>
                    )}
                </div>
                {photos.slice(1, 3).map((p, i) => (
                    <div key={i} className="hidden md:block relative cursor-pointer overflow-hidden" onClick={() => setLightbox(i + 1)}>
                        <img src={p} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        {i === 1 && photos.length > 3 && (
                            <div className="absolute inset-0 bg-pizarra/60 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="text-white font-bold text-lg">+{photos.length - 3} más</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {lightbox !== null && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={() => setLightbox(null)}>
                    <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white/80 text-3xl hover:text-white transition z-50">✕</button>
                    {lightbox > 0 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }} className="absolute left-6 text-white/60 text-5xl hover:text-white transition">‹</button>}
                    <img src={photos[lightbox]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
                    {lightbox < photos.length - 1 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }} className="absolute right-6 text-white/60 text-5xl hover:text-white transition">›</button>}
                    <div className="absolute bottom-6 text-white/50 text-sm font-medium">{lightbox + 1} / {photos.length}</div>
                </div>
            )}
        </>
    )
}
