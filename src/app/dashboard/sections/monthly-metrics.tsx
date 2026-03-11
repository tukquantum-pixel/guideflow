"use client"

import type { MonthStats } from "../types"

export function MonthlyMetrics({ stats, activityCount, slug }: { stats: MonthStats; activityCount: number; slug: string }) {
    const revenue = stats.revenue > 0 ? (stats.revenue / 100).toFixed(0) : "0"

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-roca-dark/20 rounded-xl p-4 hover:shadow-md transition">
                <p className="text-2xl mb-1">🧗</p>
                <p className="text-2xl font-bold text-pizarra">{activityCount}</p>
                <p className="text-xs text-granito">Actividades</p>
                <a href="/dashboard/activities" className="text-xs text-musgo hover:underline mt-1 inline-block">Gestionar →</a>
            </div>
            <div className="bg-white border border-roca-dark/20 rounded-xl p-4 hover:shadow-md transition">
                <p className="text-2xl mb-1">📋</p>
                <p className="text-2xl font-bold text-pizarra">{stats.count}</p>
                <p className="text-xs text-granito">Reservas este mes</p>
                <a href="/dashboard/bookings" className="text-xs text-musgo hover:underline mt-1 inline-block">Ver todas →</a>
            </div>
            <div className="bg-white border border-roca-dark/20 rounded-xl p-4 hover:shadow-md transition">
                <p className="text-2xl mb-1">💰</p>
                <p className="text-2xl font-bold text-musgo">{stats.revenue > 0 ? `${revenue}€` : "—"}</p>
                <p className="text-xs text-granito">Ingresos este mes</p>
            </div>
            <div className="bg-white border border-roca-dark/20 rounded-xl p-4 hover:shadow-md transition">
                <p className="text-2xl mb-1">🔗</p>
                <a href={`/${slug}`} target="_blank" className="text-sm text-lago hover:text-lago-dark font-medium">@{slug}</a>
                <p className="text-xs text-granito mt-1">Tu página pública</p>
            </div>
        </div>
    )
}
