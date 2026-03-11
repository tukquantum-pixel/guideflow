"use client"

import type { ActivityStat } from "../types"
import { CAT_ICONS } from "../types"

export function PopularActivities({ stats }: { stats: ActivityStat[] }) {
    const total = stats.reduce((s, a) => s + a.bookings, 0)
    if (stats.length === 0 || total === 0) return null

    return (
        <div className="bg-white border border-roca-dark/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-pizarra mb-4">🔥 Actividades más reservadas</h3>
            <div className="space-y-3">
                {stats.slice(0, 5).map((a, i) => {
                    const pct = Math.round((a.bookings / total) * 100)
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-lg shrink-0">{CAT_ICONS[a.category] || "🧭"}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-pizarra truncate">{a.title}</span>
                                    <span className="text-xs text-granito shrink-0">{a.bookings} reserva{a.bookings !== 1 ? "s" : ""} · {pct}%</span>
                                </div>
                                <div className="h-2 bg-niebla rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-musgo to-lago rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
