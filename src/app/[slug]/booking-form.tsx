"use client"

import { useState } from "react"
import { CheckIcon } from "@/components/icons"

interface BookingFormProps {
    slot: { id: string; date: Date | string; startTime: string; spotsRemaining: number }
    activity: { title: string; priceCents: number }
    guideName: string
    onClose: () => void
}

export function BookingForm({ slot, activity, guideName, onClose }: BookingFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const fd = new FormData(e.currentTarget)

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                timeSlotId: slot.id,
                customerName: fd.get("name"),
                customerEmail: fd.get("email"),
                customerPhone: fd.get("phone"),
                numPeople: Number(fd.get("people")),
                notes: fd.get("notes"),
            }),
        })

        if (!res.ok) {
            const data = await res.json()
            setError(data.error || "Error al reservar")
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
    }

    const dateStr = new Date(slot.date).toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long",
    })

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {success ? (
                    <div className="p-8 text-center">
                        <CheckIcon className="w-12 h-12 text-musgo mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Reserva confirmada!</h3>
                        <p className="text-gray-500 mb-1">{activity.title} con {guideName}</p>
                        <p className="text-gray-500 mb-6">{dateStr} a las {slot.startTime}h</p>
                        <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition">
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                                    <p className="text-sm text-gray-500">{dateStr} · {slot.startTime}h</p>
                                </div>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                                <input name="name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input name="email" type="email" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input name="phone" type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nº personas</label>
                                <input name="people" type="number" min="1" max={slot.spotsRemaining} defaultValue="1" required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                <p className="text-xs text-gray-400 mt-1">{slot.spotsRemaining} plazas disponibles</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                                <textarea name="notes" rows={2} placeholder="Algún comentario o petición especial..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50 shadow-lg shadow-blue-600/25">
                                {loading ? "Reservando..." : `Reservar — ${(activity.priceCents / 100).toFixed(0)}€/persona`}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
