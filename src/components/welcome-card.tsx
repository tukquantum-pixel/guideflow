"use client"

import Link from "next/link"
import { MountainIcon, MapIcon, BookmarkIcon, ChartIcon, StarIcon, type IconProps } from "@/components/icons"

const STEPS: { Icon: React.FC<IconProps>; title: string; desc: string }[] = [
    { Icon: MapIcon, title: "Explora rutas", desc: "Encuentra rutas cerca de ti" },
    { Icon: BookmarkIcon, title: "Guarda favoritas", desc: "Márcalas para más tarde" },
    { Icon: ChartIcon, title: "Ve tu progreso", desc: "Estadísticas y logros" },
]

export function WelcomeCard({ userName }: { userName: string }) {
    return (
        <div className="bg-gradient-to-br from-musgo to-musgo-dark rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
                <MountainIcon className="w-8 h-8 text-white/80" />
                <div>
                    <h2 className="text-lg font-bold">Bienvenido, {userName}</h2>
                    <p className="text-white/60 text-sm">Tu aventura empieza aquí</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
                {STEPS.map((s, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
                        <s.Icon className="w-5 h-5 mx-auto mb-1 text-white/80" />
                        <p className="text-xs font-medium">{s.title}</p>
                        <p className="text-[10px] text-white/50 mt-0.5">{s.desc}</p>
                    </div>
                ))}
            </div>
            <Link href="/explorar" className="block w-full text-center py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition">
                <span className="flex items-center justify-center gap-1.5"><StarIcon className="w-4 h-4" /> Comenzar a explorar</span>
            </Link>
        </div>
    )
}
