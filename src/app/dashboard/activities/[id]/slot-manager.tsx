"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface TimeSlot {
    id: string
    date: Date | string
    startTime: string
    spotsRemaining: number
    status: string
    _count: { bookings: number }
}

interface Activity {
    id: string
    title: string
    maxParticipants: number
    timeSlots: TimeSlot[]
}

export function SlotManager({ activity }: { activity: Activity }) {
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function addSlot(e: React.FormEvent) {
        e.preventDefault()
        if (!date || !time) return
        setLoading(true)

        await fetch(`/api/activities/${activity.id}/slots`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, startTime: time }),
        })

        setDate("")
        setTime("")
        setLoading(false)
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <a href="/dashboard" className="text-xl font-bold text-white">PATHY</a>
                    <span className="text-white/30">›</span>
                    <a href="/dashboard/activities" className="text-blue-300 hover:text-blue-200">Actividades</a>
                    <span className="text-white/30">›</span>
                    <span className="text-white">{activity.title}</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-white mb-6">Horarios disponibles</h2>

                {/* Add slot form */}
                <form onSubmit={addSlot} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 flex gap-4 items-end flex-wrap">
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Fecha</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                            min={new Date().toISOString().split("T")[0]}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Hora inicio</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg shadow-blue-600/25">
                        {loading ? "Añadiendo..." : "+ Añadir horario"}
                    </button>
                </form>

                {/* Slot list */}
                {activity.timeSlots.length === 0 ? (
                    <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-10 text-center">
                        <p className="text-white/40">No hay horarios. Añade fechas y horas para que tus clientes reserven.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {activity.timeSlots.map((slot) => (
                            <div key={slot.id} className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="text-white font-medium">
                                        {new Date(slot.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                                    </div>
                                    <div className="text-blue-300">{slot.startTime}h</div>
                                    <div className={`text-sm px-2 py-0.5 rounded-full ${slot.status === "FULL" ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                                        {slot.spotsRemaining}/{activity.maxParticipants} plazas
                                    </div>
                                </div>
                                <div className="text-sm text-white/40">
                                    {slot._count.bookings} reservas
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
