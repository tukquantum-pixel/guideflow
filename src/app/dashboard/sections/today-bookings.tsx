"use client"

import { PhoneIcon } from "@/components/icons"
import type { TodayBooking, CAT_ICONS } from "../types"
import { CAT_ICONS as ICONS } from "../types"

function waLink(phone: string, name: string, activity: string, time: string) {
    const msg = encodeURIComponent(`Hola ${name}! Te confirmo la actividad "${activity}" hoy a las ${time}h. ¿Alguna duda? 🏔️`)
    return `https://wa.me/${phone.replace(/\s+/g, "")}?text=${msg}`
}

export function TodayBookings({ bookings }: { bookings: TodayBooking[] }) {
    const totalPax = bookings.reduce((s, b) => s + b.numPeople, 0)

    return (
        <div className="bg-white border border-roca-dark/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-pizarra flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-musgo rounded-full animate-pulse" />📅 Hoy
                </h3>
                <div className="flex gap-2">
                    <span className="text-sm bg-musgo/10 text-musgo px-3 py-1 rounded-full font-medium">{bookings.length} reserva{bookings.length !== 1 ? "s" : ""}</span>
                    {totalPax > 0 && <span className="text-sm bg-lago/10 text-lago px-3 py-1 rounded-full font-medium">{totalPax} pax</span>}
                </div>
            </div>
            {bookings.length === 0 ? (
                <div className="text-center py-6 bg-niebla rounded-xl">
                    <p className="text-2xl mb-2">🎉</p>
                    <p className="text-granito font-medium">Sin reservas para hoy. ¡Día libre!</p>
                    <a href="/dashboard/activities" className="text-sm text-musgo hover:text-musgo-dark font-medium mt-2 inline-block">Ver actividades →</a>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map(b => (
                        <div key={b.id} className="flex items-center justify-between p-3 bg-niebla rounded-xl hover:bg-roca/50 transition">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-lg shrink-0">{ICONS[b.timeSlot.activity.category] || "🧭"}</span>
                                <div className="min-w-0">
                                    <p className="font-medium text-pizarra truncate">
                                        <span className="text-musgo font-bold">{b.timeSlot.startTime}h</span> · {b.customerName} <span className="text-xs text-granito">· {b.numPeople} pax</span>
                                    </p>
                                    <p className="text-sm text-granito truncate">{b.timeSlot.activity.title}</p>
                                    {b.notes && <p className="text-xs text-granito/60 italic mt-0.5 truncate">📝 {b.notes}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {b.payment && <span className="text-xs font-medium text-musgo">{(b.payment.amountCents / 100).toFixed(0)}€</span>}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status === "CONFIRMED" ? "bg-musgo/10 text-musgo" : "bg-atardecer/10 text-atardecer"}`}>
                                    {b.status === "CONFIRMED" ? "✅" : "⏳"}
                                </span>
                                {b.customerPhone && (
                                    <a href={waLink(b.customerPhone, b.customerName, b.timeSlot.activity.title, b.timeSlot.startTime)} target="_blank" rel="noopener noreferrer"
                                        className="p-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition" title="WhatsApp">
                                        <PhoneIcon className="w-4 h-4 text-[#25D366]" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
