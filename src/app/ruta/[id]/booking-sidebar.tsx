"use client"

import { useState } from "react"
import type { Activity, TimeSlot } from "./types"
import { BookingForm } from "@/app/[slug]/booking-form"

interface Props { activity: Pick<Activity, "id" | "title" | "priceCents" | "maxParticipants" | "timeSlots" | "guide"> }

export function BookingSidebar({ activity: a }: Props) {
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    return (
        <div className="bg-white border-2 border-musgo/30 rounded-xl p-5 shadow-lg shadow-musgo/10">
            <p className="text-3xl font-bold text-pizarra">{(a.priceCents / 100).toFixed(0)}€ <span className="text-sm font-normal text-granito">/ persona</span></p>
            <p className="text-xs text-granito mt-1">Máx. {a.maxParticipants} participantes</p>

            {a.timeSlots.length > 0 ? (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-pizarra">Elige una fecha:</p>
                    {a.timeSlots.map(s => (
                        <button key={s.id} onClick={() => setSelectedSlot(s)}
                            className="w-full flex items-center justify-between text-sm bg-niebla hover:bg-musgo/10 rounded-lg px-3 py-2.5 transition text-left group">
                            <span className="text-pizarra font-medium">{new Date(s.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {s.startTime}</span>
                            <span className="text-xs text-granito bg-white group-hover:bg-musgo group-hover:text-white px-2 py-0.5 rounded-full transition">{s.spotsRemaining} plazas</span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-granito bg-niebla rounded-lg px-3 py-3 text-center">No hay fechas disponibles ahora</p>
            )}

            <button onClick={() => a.timeSlots[0] && setSelectedSlot(a.timeSlots[0])}
                disabled={a.timeSlots.length === 0}
                className="block mt-5 w-full py-3.5 bg-musgo hover:bg-musgo-dark disabled:bg-granito disabled:cursor-not-allowed text-white text-center font-semibold rounded-xl transition shadow-lg shadow-musgo/25 text-lg">
                🗓️ Reservar esta ruta
            </button>
            <p className="text-xs text-center text-granito mt-2">Pago seguro con Stripe</p>

            {selectedSlot && (
                <BookingForm
                    slot={selectedSlot}
                    activity={{ title: a.title, priceCents: a.priceCents }}
                    guideName={a.guide.name}
                    onClose={() => setSelectedSlot(null)}
                />
            )}
        </div>
    )
}
