"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { MountainIcon, ClipboardIcon, ChartIcon, UserIcon, LogoutIcon } from "@/components/icons"
import type { GuideData, TodayBooking, UpcomingBooking, ActivityStat, MonthStats } from "./types"
import { TodayBookings } from "./sections/today-bookings"
import { PendingActions } from "./sections/pending-actions"
import { UpcomingDays } from "./sections/upcoming-days"
import { MonthlyMetrics } from "./sections/monthly-metrics"
import { PopularActivities } from "./sections/popular-activities"
import { QuickActions } from "./sections/quick-actions"

interface Props {
    guide: GuideData
    todayBookings: TodayBooking[]
    upcomingBookings: UpcomingBooking[]
    monthStats: MonthStats
    activityStats: ActivityStat[]
}

function greeting() {
    const h = new Date().getHours()
    if (h < 12) return "Buenos días"
    if (h < 20) return "Buenas tardes"
    return "Buenas noches"
}

export function DashboardContent({ guide, todayBookings, upcomingBookings, monthStats, activityStats }: Props) {
    const [connecting, setConnecting] = useState(false)
    const initials = guide.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

    async function connectStripe() {
        setConnecting(true)
        try {
            const res = await fetch("/api/stripe/connect", { method: "POST" })
            const data = await res.json()
            if (data.url) window.location.href = data.url
        } catch { setConnecting(false) }
    }

    return (
        <div className="min-h-screen bg-niebla pb-20 md:pb-0">
            {/* Navbar */}
            <nav className="border-b border-roca-dark/30 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            <MountainIcon className="w-6 h-6 text-musgo" />
                            <h1 className="text-lg font-bold text-pizarra">PATHY</h1>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <a href="/dashboard/activities" className="text-sm text-granito hover:text-pizarra transition flex items-center gap-1.5"><ClipboardIcon className="w-4 h-4" /> Actividades</a>
                            <a href="/dashboard/bookings" className="text-sm text-granito hover:text-pizarra transition flex items-center gap-1.5"><ChartIcon className="w-4 h-4" /> Reservas</a>
                            <a href="/dashboard/profile" className="text-sm text-granito hover:text-pizarra transition flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> Perfil</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={`/${guide.slug}`} target="_blank" className="text-xs text-lago hover:text-lago-dark font-medium hidden sm:block">@{guide.slug}</a>
                        <div className="w-8 h-8 rounded-full bg-musgo/10 border border-musgo/20 flex items-center justify-center overflow-hidden">
                            {guide.avatarUrl ? <img src={guide.avatarUrl} alt={guide.name} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-musgo">{initials}</span>}
                        </div>
                        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-granito hover:text-pizarra transition" title="Cerrar sesión"><LogoutIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 animate-fade-in space-y-6">
                {/* Greeting */}
                <div>
                    <h2 className="text-2xl font-bold text-pizarra mb-1">{greeting()}, {guide.name} 👋</h2>
                    <p className="text-granito">{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>

                {/* 🔴 PRIORITY 1: Today */}
                <TodayBookings bookings={todayBookings} />

                {/* 🟡 PRIORITY 2: Pending Actions */}
                <PendingActions
                    stripeStatus={guide.stripeStatus}
                    activityCount={guide._count.activities}
                    hasAvatar={!!guide.avatarUrl}
                    onConnectStripe={connectStripe}
                />

                {/* 🟢 PRIORITY 3: Upcoming */}
                <UpcomingDays bookings={upcomingBookings} />

                {/* 📊 METRICS */}
                <MonthlyMetrics stats={monthStats} activityCount={guide._count.activities} slug={guide.slug} />

                {/* 🔥 POPULAR */}
                <PopularActivities stats={activityStats} />

                {/* ⚡ QUICK ACTIONS */}
                <QuickActions />

                {/* Empty state */}
                {guide._count.activities === 0 && (
                    <div className="bg-white border border-dashed border-roca-dark/30 rounded-2xl p-12 text-center">
                        <MountainIcon className="w-12 h-12 text-musgo/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-pizarra mb-2">🚀 Tu aventura empieza aquí</h3>
                        <p className="text-granito mb-6 max-w-md mx-auto">Crea tu primera actividad en menos de 5 minutos y tus clientes podrán reservar.</p>
                        <a href="/dashboard/activities" className="inline-block px-6 py-3 bg-musgo hover:bg-musgo-dark text-white font-medium rounded-lg transition shadow-lg shadow-musgo/25">Crear mi primera actividad →</a>
                    </div>
                )}
            </main>

            {/* Mobile nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-roca-dark/20 px-4 py-2 z-40">
                <div className="flex justify-around">
                    <a href="/dashboard" className="flex flex-col items-center text-musgo text-xs font-medium py-1"><MountainIcon className="w-5 h-5 mb-0.5" />Inicio</a>
                    <a href="/dashboard/activities" className="flex flex-col items-center text-granito text-xs py-1"><ClipboardIcon className="w-5 h-5 mb-0.5" />Actividades</a>
                    <a href="/dashboard/bookings" className="flex flex-col items-center text-granito text-xs py-1"><ChartIcon className="w-5 h-5 mb-0.5" />Reservas</a>
                    <a href="/dashboard/profile" className="flex flex-col items-center text-granito text-xs py-1"><UserIcon className="w-5 h-5 mb-0.5" />Perfil</a>
                </div>
            </div>
        </div>
    )
}
