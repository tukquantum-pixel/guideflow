"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { DistanceIcon, ElevationIcon, DurationIcon, MapIcon, StarIcon, MountainIcon, BookmarkIcon, ChartIcon, EditIcon, XIcon, CheckIcon, type IconProps } from "@/components/icons"
import { AchievementsSection } from "@/components/achievements-section"
import { WeeklyChallengeCard } from "@/components/weekly-challenge-card"
import { PremiumTrigger } from "@/components/premium-trigger"
import { MobileTabBar } from "@/components/mobile-tab-bar"
import type { UserAchievement } from "@/lib/achievements"
import type { WeeklyChallenge } from "@/lib/weekly-challenge"
import { useNetwork } from "@/hooks/use-network"
import { getOfflineQueue, syncPendingRecordings } from "@/lib/offline-queue"

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
    const isOnline = useNetwork()
    const [pendingCount, setPendingCount] = useState(0)
    const [isSyncing, setIsSyncing] = useState(false)
    
    // Perfil Edit States
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(userName)
    const [editAvatar, setEditAvatar] = useState(avatarUrl)
    const [isSaving, setIsSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const isPremium = plan === "EXPLORER" || plan === "PEAK"
    const maxKm = Math.max(...monthlyKm.map(m => m.km), 1)

    useEffect(() => {
        // Only run on client
        setPendingCount(getOfflineQueue().length)
    }, [isOnline])

    const handleSync = async () => {
        setIsSyncing(true)
        const success = await syncPendingRecordings()
        setIsSyncing(false)
        if (success) setPendingCount(0)
        else setPendingCount(getOfflineQueue().length)
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingAvatar(true)
        try {
            const formData = new FormData(); formData.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (res.ok && data.url) setEditAvatar(data.url)
            else alert(data.error || "Error subiendo archivo")
        } catch { alert("Error subiendo foto") }
        setUploadingAvatar(false)
    }

    const handleSaveProfile = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, avatarUrl: editAvatar })
            })
            if (res.ok) window.location.reload()
            else { alert("Error al guardar perfil"); setIsSaving(false) }
        } catch { alert("Error de red"); setIsSaving(false) }
    }

    return (
        <div className="min-h-screen bg-niebla pb-20 md:pb-0">
            <nav className="bg-pizarra text-white py-3">
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                    <Link href={isGuide ? "/dashboard" : "/explorar"} className="text-musgo-light hover:text-white transition text-sm">← Volver</Link>
                    <Link href="/mis-rutas" className="text-sm text-white/70 hover:text-white transition">Mis rutas</Link>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {!isOnline && (
                    <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                        <p className="font-bold flex items-center gap-1.5"><MountainIcon className="w-5 h-5"/> Modo Offline Activo</p>
                        <p className="text-sm mt-1">Sin conexión. Puedes seguir grabando rutas, se guardarán y subirán cuando recuperes la red.</p>
                        {pendingCount > 0 && <p className="text-xs font-semibold mt-2 text-amber-900 bg-amber-200/50 px-3 py-1 rounded-full">{pendingCount} rutas pendientes</p>}
                    </div>
                )}
                
                {isOnline && pendingCount > 0 && (
                    <div className="bg-musgo/10 border border-musgo/30 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                        <p className="font-bold text-pizarra mt-1">Rutas pendientes de subir</p>
                        <p className="text-sm text-granito mt-1">Tienes conectividad de vuelta. Puedes intentar forzar la subida.</p>
                        <button onClick={handleSync} disabled={isSyncing} className="mt-3 px-5 py-2.5 bg-musgo text-white rounded-xl text-sm font-bold shadow-md hover:bg-musgo-dark disabled:opacity-50 transition">
                            {isSyncing ? "Subiendo..." : `Subir ${pendingCount} rutas ahora ⬆️`}
                        </button>
                    </div>
                )}

                {/* Profile header */}
                <div className="bg-gradient-to-br from-musgo to-musgo-dark rounded-xl p-6 text-white relative">
                    <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md" title="Editar Perfil">
                        <EditIcon className="w-5 h-5 text-white" />
                    </button>
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

            {/* Modal de edición */}
            {isEditing && (
                <div className="fixed inset-0 bg-pizarra/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-musgo text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold">Editar Perfil</h3>
                            <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-white/20 transition"><XIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-5 space-y-6">
                            <div className="flex flex-col items-center">
                                <div 
                                    className="w-24 h-24 rounded-full bg-niebla border-2 border-dashed border-roca-dark/40 overflow-hidden relative group cursor-pointer flex items-center justify-center shadow-inner"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    {editAvatar ? <img src={editAvatar} className="w-full h-full object-cover" /> : <span className="text-3xl text-granito font-bold">{editName[0]?.toUpperCase() || "?"}</span>}
                                    <div className="absolute inset-0 bg-pizarra/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <EditIcon className="w-6 h-6 text-white" />
                                    </div>
                                    {uploadingAvatar && <div className="absolute inset-0 bg-pizarra/70 flex items-center justify-center"><span className="text-white text-xs font-medium animate-pulse">Subiendo...</span></div>}
                                </div>
                                <input type="file" ref={avatarInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} />
                                <p className="text-xs text-musgo font-medium mt-2 bg-musgo/10 px-3 py-1 rounded-full cursor-pointer hover:bg-musgo/20 transition" onClick={() => avatarInputRef.current?.click()}>Cambiar foto de perfil</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-pizarra mb-1.5 focus-within:text-musgo transition">Nombre / Alias en la app</label>
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-roca-dark/20 rounded-xl px-4 py-3.5 text-pizarra font-medium bg-white focus:outline-none focus:ring-2 focus:ring-musgo focus:border-transparent transition shadow-sm"
                                    placeholder="Tu nombre completo"
                                />
                            </div>

                            <button onClick={handleSaveProfile} disabled={isSaving || uploadingAvatar || !editName.trim()} 
                                className="w-full py-3.5 bg-musgo text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-musgo-dark transition shadow-lg shadow-musgo/30 disabled:opacity-50 disabled:shadow-none">
                                {isSaving ? "Guardando..." : <><CheckIcon className="w-5 h-5" /> Guardar Cambios</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
