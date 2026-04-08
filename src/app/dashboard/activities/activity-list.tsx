"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateActivityForm } from "./create-form"
import { MountainIcon, ClockIcon, GroupIcon, PlusIcon, TrashIcon, EditIcon, CopyIcon, ClipboardIcon, ChartIcon, UserIcon } from "@/components/icons"

const CAT_ICONS: Record<string, string> = {
    hiking: "🥾", climbing: "🧗", biking: "🚵", kayak: "🏊", ski: "🎿", camping: "🏕️", other: "🧭",
}

interface Activity {
    id: string; title: string; priceCents: number; durationMinutes: number
    maxParticipants: number; active: boolean; category: string; difficulty: string
    _count: { timeSlots: number }; bookingCount: number; totalPax: number
}

export function ActivityList({ activities }: { activities: Activity[] }) {
    const [showForm, setShowForm] = useState(false)
    const router = useRouter()

    async function toggleActive(id: string, active: boolean) {
        await fetch(`/api/activities/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) })
        router.refresh()
    }
    async function deleteActivity(id: string) {
        if (!confirm("¿Eliminar esta actividad?")) return
        await fetch(`/api/activities/${id}`, { method: "DELETE" })
        router.refresh()
    }
    async function cloneActivity(id: string) {
        const res = await fetch(`/api/activities/${id}/clone`, { method: "POST" })
        if (res.ok) router.refresh()
    }

    return (
        <div className="min-h-screen bg-niebla pb-20 md:pb-0">
            <nav className="border-b border-roca-dark/30 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
                    <a href="/dashboard" className="text-musgo hover:text-musgo-dark transition text-sm font-medium">← Volver</a>
                    <span className="text-granito/30">|</span>
                    <a href="/dashboard" className="text-lg font-bold text-pizarra">PATHY</a>
                    <span className="text-granito/30">›</span>
                    <span className="text-musgo font-medium">Actividades</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-pizarra">Mis Actividades</h2>
                    <button onClick={() => setShowForm(!showForm)}
                        className={`px-5 py-2.5 font-medium rounded-lg transition flex items-center gap-2 ${showForm ? "bg-white border border-roca-dark/30 text-granito" : "bg-musgo hover:bg-musgo-dark text-white shadow-lg shadow-musgo/25"}`}>
                        {showForm ? "Cancelar" : <><PlusIcon className="w-4 h-4" /> Nueva actividad</>}
                    </button>
                </div>

                {showForm && <CreateActivityForm onDone={() => { setShowForm(false); router.refresh() }} />}

                {activities.length === 0 && !showForm && (
                    <div className="bg-white border border-dashed border-roca-dark/30 rounded-2xl p-12 text-center">
                        <MountainIcon className="w-12 h-12 text-musgo/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-pizarra mb-2">Sin actividades</h3>
                        <p className="text-granito">Crea tu primera actividad para que tus clientes puedan reservar.</p>
                    </div>
                )}

                <div className="grid gap-4">
                    {activities.map((a) => (
                        <div key={a.id} className="bg-white border border-roca-dark/20 rounded-xl p-6 flex items-center justify-between group hover:shadow-md transition">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-lg">{CAT_ICONS[a.category] || "🧭"}</span>
                                    <h3 className="text-lg font-semibold text-pizarra">{a.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.active ? "bg-musgo/10 text-musgo" : "bg-atardecer/10 text-atardecer"}`}>
                                        {a.active ? "Activa" : "Pausada"}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-roca text-granito">
                                        {a.difficulty === "LOW" ? "Fácil" : a.difficulty === "HIGH" ? "Difícil" : "Media"}
                                    </span>
                                </div>
                                <div className="flex gap-5 text-sm text-granito flex-wrap">
                                    <span className="font-semibold text-pizarra">{(a.priceCents / 100).toFixed(0)}€</span>
                                    <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {a.durationMinutes} min</span>
                                    <span className="flex items-center gap-1"><GroupIcon className="w-3.5 h-3.5" /> Máx {a.maxParticipants}</span>
                                    <span>{a._count.timeSlots} horarios</span>
                                    {a.bookingCount > 0 && (
                                        <span className="text-musgo font-medium">📊 {a.bookingCount} reservas · {(a.totalPax * a.priceCents / 100).toFixed(0)}€</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <a href={`/dashboard/activities/${a.id}/edit`} className="px-3 py-1.5 text-sm bg-lago/10 hover:bg-lago/20 text-lago rounded-lg transition font-medium flex items-center gap-1" title="Editar">
                                    <EditIcon className="w-3.5 h-3.5" /> Editar
                                </a>
                                <button onClick={() => cloneActivity(a.id)} className="px-3 py-1.5 text-sm bg-musgo/10 hover:bg-musgo/20 text-musgo rounded-lg transition font-medium flex items-center gap-1" title="Clonar">
                                    <CopyIcon className="w-3.5 h-3.5" /> Clonar
                                </button>
                                <a href={`/dashboard/activities/${a.id}`} className="px-3 py-1.5 text-sm bg-musgo/10 hover:bg-musgo/20 text-musgo rounded-lg transition font-medium">Horarios</a>
                                <button onClick={() => toggleActive(a.id, a.active)} className="px-3 py-1.5 text-sm bg-roca hover:bg-roca-dark text-granito rounded-lg transition">
                                    {a.active ? "Pausar" : "Activar"}
                                </button>
                                <button onClick={() => deleteActivity(a.id)} className="px-3 py-1.5 text-sm bg-atardecer/10 hover:bg-atardecer/20 text-atardecer rounded-lg transition">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Mobile nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-roca-dark/20 px-4 py-2 z-40">
                <div className="flex justify-around">
                    <a href="/dashboard" className="flex flex-col items-center text-granito text-xs py-1"><MountainIcon className="w-5 h-5 mb-0.5" />Inicio</a>
                    <a href="/dashboard/activities" className="flex flex-col items-center text-musgo text-xs font-medium py-1"><ClipboardIcon className="w-5 h-5 mb-0.5" />Actividades</a>
                    <a href="/dashboard/bookings" className="flex flex-col items-center text-granito text-xs py-1"><ChartIcon className="w-5 h-5 mb-0.5" />Reservas</a>
                    <a href="/dashboard/profile" className="flex flex-col items-center text-granito text-xs py-1"><UserIcon className="w-5 h-5 mb-0.5" />Perfil</a>
                </div>
            </div>
        </div>
    )
}
