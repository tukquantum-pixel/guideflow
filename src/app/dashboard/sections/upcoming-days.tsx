"use client"

import type { UpcomingBooking } from "../types"
import { CAT_ICONS } from "../types"

export function UpcomingDays({ bookings }: { bookings: UpcomingBooking[] }) {
    const byDate: Record<string, UpcomingBooking[]> = {}
    bookings.forEach(b => {
        const key = new Date(b.timeSlot.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })
        if (!byDate[key]) byDate[key] = []
        byDate[key].push(b)
    })

    if (Object.keys(byDate).length === 0) return (
        <div className="bg-white border border-roca-dark/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-pizarra mb-3">📆 Próximos 7 días</h3>
            <div className="text-center py-4 bg-niebla rounded-xl">
                <p className="text-granito">Sin reservas próximas</p>
                <p className="text-xs text-granito/60 mt-1">Comparte tu página para conseguir más reservas</p>
            </div>
        </div>
    )

    return (
        <div className="bg-white border border-roca-dark/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-pizarra mb-4">📆 Próximos días</h3>
            <div className="space-y-4">
                {Object.entries(byDate).map(([label, items]) => (
                    <div key={label}>
                        <p className="text-xs font-bold text-granito uppercase tracking-wider mb-2">{label} · {items.length} reserva{items.length !== 1 ? "s" : ""}</p>
                        <div className="space-y-2">
                            {items.map(b => (
                                <div key={b.id} className="flex items-center gap-3 p-2 bg-niebla rounded-lg">
                                    <span className="text-sm shrink-0">{CAT_ICONS[b.timeSlot.activity.category] || "🧭"}</span>
                                    <span className="text-sm text-musgo font-medium shrink-0">{b.timeSlot.startTime}h</span>
                                    <span className="text-sm text-pizarra truncate">{b.customerName} <span className="text-granito">· {b.numPeople} pax</span></span>
                                    <span className="text-xs text-granito truncate ml-auto">{b.timeSlot.activity.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
