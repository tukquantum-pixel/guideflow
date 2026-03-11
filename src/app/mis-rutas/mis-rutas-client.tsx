"use client"

import Link from "next/link"
import { useState } from "react"
import { DistanceIcon, ElevationIcon, DurationIcon, MapIcon, CategoryIcon, BookmarkIcon, DownloadIcon, SearchIcon, MountainIcon, CheckIcon, StarIcon, ChartIcon, PhotoIcon, type IconProps } from "@/components/icons"
import { WelcomeCard } from "@/components/welcome-card"
import { PremiumTrigger } from "@/components/premium-trigger"

interface SavedRouteItem {
    id: string; savedAt: Date; notes: string | null
    activity: {
        id: string; title: string; category: string; difficulty: string
        priceCents: number; durationMinutes: number; photos: string[]
        track: { distance: number | null; elevationGain: number | null; routeType: string | null } | null
        guide: { name: string; slug: string; avatarUrl: string | null }
    }
}

interface Stats { totalKm: number; totalElevation: number; totalHours: number; totalRoutes: number }

interface Props {
    routes: SavedRouteItem[]; plan: string; stats: Stats; userName: string; isGuide: boolean
}

const DIFF_COLOR: Record<string, string> = {
    easy: "bg-musgo/10 text-musgo", moderate: "bg-atardecer/10 text-atardecer",
    hard: "bg-red-100 text-red-600", expert: "bg-pizarra/10 text-pizarra",
}

export function MisRutasClient({ routes, plan, stats, userName, isGuide }: Props) {
    const [items, setItems] = useState(routes)
    const isPremium = plan === "EXPLORER" || plan === "PEAK"
    const maxSaved = isPremium ? "∞" : "5"

    async function handleRemove(activityId: string) {
        const res = await fetch("/api/user/saved-routes", {
            method: "DELETE", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activityId }),
        })
        if (res.ok) setItems(prev => prev.filter(r => r.activity.id !== activityId))
    }

    return (
        <div className="min-h-screen bg-niebla">
            {/* Header */}
            <nav className="bg-pizarra text-white py-3">
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                    <Link href={isGuide ? "/dashboard" : "/explorar"} className="text-musgo-light hover:text-white transition text-sm">← Volver</Link>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isPremium ? "bg-musgo/20 text-musgo-light" : "bg-white/10 text-white/60"}`}>
                            {plan === "FREE" ? "Plan Gratuito" : `Plan ${plan}`}
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Greeting */}
                <div>
                    <h1 className="text-2xl font-bold text-pizarra">Mis rutas</h1>
                    <p className="text-sm text-granito mt-0.5">Hola {userName}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={DistanceIcon} value={`${stats.totalKm}`} unit="km" label="Distancia total" color="from-musgo/10 to-musgo/5" iconColor="text-musgo" />
                    <StatCard icon={ElevationIcon} value={`${stats.totalElevation}`} unit="m" label="Desnivel +" color="from-atardecer/10 to-atardecer/5" iconColor="text-atardecer" />
                    <StatCard icon={DurationIcon} value={`${stats.totalHours}`} unit="h" label="Tiempo total" color="from-lago/10 to-lago/5" iconColor="text-lago" />
                    <StatCard icon={MapIcon} value={`${stats.totalRoutes}`} unit="" label="Rutas guardadas" color="from-pizarra/10 to-pizarra/5" iconColor="text-pizarra" />
                </div>

                {/* CTA - Record route or Premium */}
                {isPremium ? (
                    <div className="bg-gradient-to-r from-musgo to-musgo-dark rounded-xl p-5 text-white flex items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-lg flex items-center gap-2"><PhotoIcon className="w-5 h-5" /> Grabar nueva ruta</p>
                            <p className="text-white/70 text-sm mt-0.5">Próximamente en la app móvil</p>
                        </div>
                        <span className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium whitespace-nowrap">Pronto</span>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-musgo/5 to-lago/5 border border-musgo/20 rounded-xl p-5">
                        <div className="flex items-start gap-4">
                            <BookmarkIcon className="w-8 h-8 text-musgo" />
                            <div className="flex-1">
                                <p className="font-bold text-pizarra">Desbloquea todo el potencial</p>
                                <p className="text-sm text-granito mt-1">Con Premium puedes guardar todas las rutas que quieras, exportar GPX y mucho más.</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {[
                                        { Icon: BookmarkIcon, label: "Guardar rutas" },
                                        { Icon: DownloadIcon, label: "Exportar GPX" },
                                        { Icon: ChartIcon, label: "Estadísticas" },
                                        { Icon: PhotoIcon, label: "Grabar rutas" },
                                    ].map(f => (
                                        <span key={f.label} className="text-xs bg-white px-2.5 py-1 rounded-full text-pizarra border border-roca-dark/20 flex items-center gap-1"><f.Icon className="w-3.5 h-3.5" /> {f.label}</span>
                                    ))}
                                </div>
                                <Link href="/premium" className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-musgo text-white rounded-lg hover:bg-musgo-dark transition text-sm font-medium shadow-lg shadow-musgo/25">
                                    <StarIcon className="w-4 h-4" /> Actualizar a Explorer · 9,99€/año
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Saved Routes */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-pizarra flex items-center gap-2">
                            <BookmarkIcon className="w-5 h-5 text-musgo" /> Rutas guardadas
                            {!isPremium && <span className="text-sm font-normal text-granito">({items.length}/{maxSaved})</span>}
                        </h2>
                        <Link href="/explorar" className="text-sm text-musgo hover:text-musgo-dark font-medium">Explorar →</Link>
                    </div>

                    {items.length === 0 ? (
                        <WelcomeCard userName={userName} />
                    ) : (
                        <div className="space-y-3">
                            {items.map(r => (
                                <div key={r.id} className="bg-white border border-roca-dark/15 rounded-xl overflow-hidden hover:shadow-md transition group">
                                    <div className="flex gap-0">
                                        {/* Photo */}
                                        <Link href={`/ruta/${r.activity.id}`} className="w-28 md:w-36 shrink-0 relative overflow-hidden">
                                            {r.activity.photos[0] ? (
                                                <img src={r.activity.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="w-full h-full bg-roca flex items-center justify-center min-h-[100px]">
                                                    <CategoryIcon category={r.activity.category} className="w-10 h-10 text-granito" />
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content */}
                                        <div className="flex-1 p-3 md:p-4 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link href={`/ruta/${r.activity.id}`} className="font-bold text-pizarra hover:text-musgo transition truncate block text-sm md:text-base">
                                                        {r.activity.title}
                                                    </Link>
                                                    <button onClick={() => handleRemove(r.activity.id)} title="Eliminar"
                                                        className="text-granito/40 hover:text-atardecer transition text-sm shrink-0 opacity-0 group-hover:opacity-100">✕</button>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLOR[r.activity.difficulty] || "bg-roca text-pizarra"}`}>
                                                        {r.activity.difficulty}
                                                    </span>
                                                    {r.activity.track?.routeType && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-pizarra/5 text-granito">{r.activity.track.routeType}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 text-xs text-granito">
                                                {r.activity.track?.distance && <span className="flex items-center gap-1"><DistanceIcon className="w-3.5 h-3.5" /> {(r.activity.track.distance / 1000).toFixed(1)} km</span>}
                                                {r.activity.track?.elevationGain && <span className="flex items-center gap-1"><ElevationIcon className="w-3.5 h-3.5" /> {Math.round(r.activity.track.elevationGain)}m</span>}
                                                <span className="flex items-center gap-1"><DurationIcon className="w-3.5 h-3.5" /> {Math.round(r.activity.durationMinutes / 60)}h</span>
                                                <span className="hidden md:inline">{r.activity.guide.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Premium trigger when approaching limit */}
                {!isPremium && items.length >= 4 && (
                    <PremiumTrigger type={items.length >= 5 ? "save_limit" : "limit_warning"} currentCount={items.length} maxCount={5} />
                )}

                {/* Locked features for FREE */}
                {plan === "FREE" && (
                    <div className="bg-white border border-roca-dark/15 rounded-xl p-5">
                        <h3 className="font-bold text-pizarra mb-3 flex items-center gap-2"><BookmarkIcon className="w-5 h-5" /> Funcionalidades Premium</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                                { Icon: BookmarkIcon, title: "Guardar rutas ilimitadas", desc: "Plan Explorer" },
                                { Icon: MapIcon, title: "Seguir rutas en vivo", desc: "Plan Peak" },
                                { Icon: DownloadIcon, title: "Exportar GPX", desc: "Plan Explorer+" },
                                { Icon: PhotoIcon, title: "Grabar rutas", desc: "Próximamente" },
                                { Icon: ChartIcon, title: "Estadísticas detalladas", desc: "Plan Explorer+" },
                                { Icon: MapIcon, title: "Mapas offline", desc: "Próximamente" },
                            ].map(f => (
                                <div key={f.title} className="flex items-center gap-3 p-2.5 bg-niebla rounded-lg opacity-60">
                                    <f.Icon className="w-5 h-5 text-granito" />
                                    <div>
                                        <p className="text-sm font-medium text-pizarra">{f.title}</p>
                                        <p className="text-xs text-granito">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/premium" className="flex items-center justify-center gap-1.5 mt-4 text-center px-5 py-2.5 bg-musgo text-white rounded-lg hover:bg-musgo-dark transition text-sm font-medium">
                            <StarIcon className="w-4 h-4" /> Ver planes Premium
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}

function StatCard({ icon: Icon, value, unit, label, color, iconColor }: { icon: React.FC<IconProps>; value: string; unit: string; label: string; color: string; iconColor: string }) {
    return (
        <div className={`bg-gradient-to-br ${color} rounded-xl p-3 text-center border border-white/50`}>
            <div className="flex justify-center mb-0.5"><Icon className={`w-6 h-6 ${iconColor}`} /></div>
            <p className="text-xl font-bold text-pizarra">{value}<span className="text-sm font-normal text-granito ml-0.5">{unit}</span></p>
            <p className="text-xs text-granito">{label}</p>
        </div>
    )
}
