"use client"

import Link from "next/link"
import { DistanceIcon, ElevationIcon, DurationIcon, MapIcon, StarIcon, MountainIcon, BookmarkIcon, ChartIcon, type IconProps } from "@/components/icons"
import { AchievementsSection } from "@/components/achievements-section"
import { WeeklyChallengeCard } from "@/components/weekly-challenge-card"
import { PremiumTrigger } from "@/components/premium-trigger"
import { MobileTabBar } from "@/components/mobile-tab-bar"
import type { UserAchievement } from "@/lib/achievements"
import type { WeeklyChallenge } from "@/lib/weekly-challenge"

interface Props {
    userName: string; avatarUrl: string | null; plan: string
    memberSince: string; isGuide: boolean
    stats: { totalKm: number; totalElevation: number; totalHours: number; totalRoutes: number }
    records: { longestRoute: { title: string; km: number }; highestElevation: { title: string; m: number } }
    monthlyKm: { month: string; km: number }[]
    recentRoutes: { id: string; title: string; category: string; km: number; date: string }[]
    achievements: UserAchievement[]
    challenge: WeeklyChallenge & { current: number; progress: number; completed: boolean }
}

export function PerfilClient({ userName, avatarUrl, plan, memberSince, stats, records, monthlyKm, recentRoutes, achievements, challenge, isGuide }: Props) {
    const isPremium = plan === "EXPLORER" || plan === "PEAK"
    const maxKm = Math.max(...monthlyKm.map(m => m.km), 1)

    return (
        <div className="min-h-screen bg-niebla pb-20 md:pb-0">
            <nav className="bg-pizarra text-white py-3">
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                    <Link href={isGuide ? "/dashboard" : "/explorar"} className="text-musgo-light hover:text-white transition text-sm">← Volver</Link>
                    <Link href="/mis-rutas" className="text-sm text-white/70 hover:text-white transition">Mis rutas</Link>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Profile header */}
                <div className="bg-gradient-to-br from-musgo to-musgo-dark rounded-xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden ring-2 ring-white/30 flex items-center justify-center">
                            {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" /> :
                                <span className="text-2xl font-bold text-white/80">{userName[0]}</span>}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{userName}</h1>
                            <p className="text-white/60 text-sm">Miembro desde {memberSince}</p>
                            <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${isPremium ? "bg-white/20 text-white" : "bg-white/10 text-white/60"}`}>
                                {plan === "FREE" ? "Plan Gratuito" : `Plan ${plan}`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={DistanceIcon} value={`${stats.totalKm}`} unit="km" label="Distancia total" color="from-musgo/10 to-musgo/5" iconColor="text-musgo" />
                    <StatCard icon={ElevationIcon} value={`${stats.totalElevation}`} unit="m" label="Desnivel +" color="from-atardecer/10 to-atardecer/5" iconColor="text-atardecer" />
                    <StatCard icon={DurationIcon} value={`${stats.totalHours}`} unit="h" label="Tiempo total" color="from-lago/10 to-lago/5" iconColor="text-lago" />
                    <StatCard icon={MapIcon} value={`${stats.totalRoutes}`} unit="" label="Rutas" color="from-pizarra/10 to-pizarra/5" iconColor="text-pizarra" />
                </div>

                {/* Weekly challenge */}
                <WeeklyChallengeCard
                    challenge={challenge}
                    current={challenge.current}
                    progress={challenge.progress}
                    completed={challenge.completed}
                    isPremium={isPremium}
                />

                {/* Monthly progress */}
                <div className="bg-white border border-roca-dark/15 rounded-xl p-5">
                    <h2 className="font-bold text-pizarra mb-4 flex items-center gap-2"><ChartIcon className="w-5 h-5" /> Progreso mensual</h2>
                    <div className="flex items-end gap-2 h-32">
                        {monthlyKm.map(m => (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] text-granito font-medium">{m.km > 0 ? `${m.km}` : ""}</span>
                                <div className="w-full rounded-t-md bg-musgo/20 relative" style={{ height: `${Math.max((m.km / maxKm) * 100, 4)}%` }}>
                                    <div className="absolute inset-0 bg-musgo rounded-t-md" style={{ opacity: m.km > 0 ? 0.7 : 0.15 }} />
                                </div>
                                <span className="text-[10px] text-granito capitalize">{m.month}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-granito mt-3 text-center">Kilómetros recorridos por mes</p>
                </div>

                {/* Achievements */}
                <AchievementsSection achievements={achievements} />

                {/* Personal records */}
                {(records.longestRoute.km > 0 || records.highestElevation.m > 0) && (
                    <div className="bg-white border border-roca-dark/15 rounded-xl p-5">
                        <h2 className="font-bold text-pizarra mb-3 flex items-center gap-2"><StarIcon className="w-5 h-5" /> Mejores marcas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {records.longestRoute.km > 0 && (
                                <div className="bg-musgo/5 rounded-lg p-3">
                                    <p className="text-xs text-granito">Ruta más larga</p>
                                    <p className="font-semibold text-pizarra">{records.longestRoute.km} km</p>
                                    <p className="text-xs text-granito truncate">{records.longestRoute.title}</p>
                                </div>
                            )}
                            {records.highestElevation.m > 0 && (
                                <div className="bg-atardecer/5 rounded-lg p-3">
                                    <p className="text-xs text-granito">Mayor desnivel</p>
                                    <p className="font-semibold text-pizarra">{records.highestElevation.m} m</p>
                                    <p className="text-xs text-granito truncate">{records.highestElevation.title}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Recent routes */}
                {recentRoutes.length > 0 && (
                    <div className="bg-white border border-roca-dark/15 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-pizarra flex items-center gap-2"><BookmarkIcon className="w-5 h-5" /> Últimas rutas</h2>
                            <Link href="/mis-rutas" className="text-sm text-musgo hover:text-musgo-dark font-medium">Ver todas →</Link>
                        </div>
                        <div className="space-y-2">
                            {recentRoutes.map(r => (
                                <Link key={r.id} href={`/ruta/${r.id}`} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-niebla transition">
                                    <div>
                                        <p className="text-sm font-medium text-pizarra">{r.title}</p>
                                        <p className="text-xs text-granito">{r.category} · {r.km} km</p>
                                    </div>
                                    <span className="text-xs text-granito whitespace-nowrap">{r.date}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Premium conversion triggers for free users */}
                {!isPremium && stats.totalRoutes >= 3 && (
                    <PremiumTrigger type="limit_warning" currentCount={stats.totalRoutes} maxCount={5} />
                )}

                {/* Premium CTA for free users */}
                {!isPremium && (
                    <div className="bg-gradient-to-r from-musgo/5 to-lago/5 border border-musgo/20 rounded-xl p-5 text-center">
                        <MountainIcon className="w-10 h-10 text-musgo mx-auto mb-2" />
                        <p className="font-bold text-pizarra">Desbloquea más estadísticas</p>
                        <p className="text-sm text-granito mt-1 mb-4">Con Premium accedes a estadísticas avanzadas, mapas offline y mucho más</p>
                        <Link href="/premium" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-musgo text-white rounded-lg hover:bg-musgo-dark transition text-sm font-medium shadow-lg shadow-musgo/25">
                            <StarIcon className="w-4 h-4" /> Ver planes Premium
                        </Link>
                    </div>
                )}
            </main>
            <MobileTabBar active="perfil" />
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
