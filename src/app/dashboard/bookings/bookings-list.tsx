"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { ClipboardIcon, MoneyIcon, CalendarIcon, ChartIcon, PhoneIcon, MountainIcon, CategoryIcon, CheckIcon, UserIcon } from "@/components/icons"

interface Booking {
    id: string; customerName: string; customerEmail: string; customerPhone: string | null
    numPeople: number; status: string; notes: string | null; createdAt: Date | string
    timeSlot: { date: Date | string; startTime: string; activity: { title: string; priceCents: number; category: string } }
    payment: { amountCents: number; status: string } | null
}

const STATUS_MAP: Record<string, { label: string; dot: string; className: string }> = {
    CONFIRMED: { label: "Confirmada", dot: "bg-green-500", className: "bg-green-50 text-green-700 border-green-200" },
    CANCELLED: { label: "Cancelada", dot: "bg-red-500", className: "bg-red-50 text-red-600 border-red-200" },
    COMPLETED: { label: "Completada", dot: "bg-lago", className: "bg-lago/10 text-lago border-lago/20" },
    PENDING: { label: "Pendiente", dot: "bg-amber-500", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

function waLink(phone: string, name: string) {
    return `https://wa.me/${phone.replace(/\s+/g, "")}?text=${encodeURIComponent(`Hola ${name}! Soy tu guía. ¿Alguna duda sobre la actividad?`)}`
}

function isToday(d: Date) { const t = new Date(); return d.toDateString() === t.toDateString() }
function isTomorrow(d: Date) { const t = new Date(); t.setDate(t.getDate() + 1); return d.toDateString() === t.toDateString() }
function isThisWeek(d: Date) { const t = new Date(); const end = new Date(t); end.setDate(end.getDate() + 7); return d >= t && d <= end }

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0`}>{icon}</div>
            <div><p className="text-xl font-bold text-pizarra">{value}</p><p className="text-[11px] text-granito">{label}</p>{sub && <p className="text-[10px] text-musgo">{sub}</p>}</div>
        </div>
    )
}

export function BookingsList({ bookings }: { bookings: Booking[] }) {
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")
    const router = useRouter()

    const stats = useMemo(() => {
        const now = new Date(); const active = bookings.filter(b => b.status !== "CANCELLED")
        const today = active.filter(b => isToday(new Date(b.timeSlot.date)))
        const tomorrow = active.filter(b => isTomorrow(new Date(b.timeSlot.date)))
        const week = active.filter(b => isThisWeek(new Date(b.timeSlot.date)))
        const month = active.filter(b => { const d = new Date(b.timeSlot.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
        const revenue = month.reduce((s, b) => s + (b.timeSlot.activity.priceCents * b.numPeople / 100), 0)
        return { today: today.length, tomorrow: tomorrow.length, week: week.length, revenue }
    }, [bookings])

    const filtered = useMemo(() => bookings.filter(b => {
        if (filter !== "all" && b.status !== filter) return false
        if (search && !b.customerName.toLowerCase().includes(search.toLowerCase()) && !b.timeSlot.activity.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }), [bookings, filter, search])

    // Group by date
    const grouped = useMemo(() => {
        const g: Record<string, Booking[]> = {}
        filtered.forEach(b => {
            const d = new Date(b.timeSlot.date)
            let label = isToday(d) ? "📅 HOY" : isTomorrow(d) ? "📅 MAÑANA" : `📅 ${d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}`
            if (!g[label]) g[label] = []
            g[label].push(b)
        })
        return g
    }, [filtered])

    async function updateStatus(id: string, action: "check-in" | "cancel") {
        if (action === "cancel" && !confirm("¿Cancelar esta reserva? Se liberarán las plazas.")) return
        await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: action === "check-in" ? "COMPLETED" : "CANCELLED" }) })
        router.refresh()
    }

    const FILTERS = [
        { v: "all", l: "Todas", dot: "bg-granito" },
        { v: "CONFIRMED", l: "Confirmadas", dot: "bg-green-500" },
        { v: "PENDING", l: "Pendientes", dot: "bg-amber-500" },
        { v: "COMPLETED", l: "Completadas", dot: "bg-lago" },
        { v: "CANCELLED", l: "Canceladas", dot: "bg-red-500" },
    ]

    return (
        <div className="min-h-screen bg-niebla pb-20 md:pb-0">
            <nav className="border-b border-roca-dark/20 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 flex items-center gap-3">
                    <a href="/dashboard" className="text-musgo hover:text-musgo-dark transition text-sm font-medium">← Volver</a>
                    <span className="text-granito/30">|</span>
                    <a href="/dashboard" className="text-lg font-bold text-pizarra flex items-center gap-1.5"><MountainIcon className="w-4 h-4" /> PATHY</a>
                    <span className="text-granito/30">›</span>
                    <span className="text-musgo font-medium">Reservas</span>
                    <span className="ml-auto text-xs text-granito">{bookings.length} total</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6 animate-fade-in">
                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={<CalendarIcon className="w-5 h-5 text-green-600" />} label="Hoy" value={stats.today} sub={stats.today > 0 ? "activas" : ""} color="bg-green-50" />
                    <StatCard icon={<CalendarIcon className="w-5 h-5 text-lago" />} label="Mañana" value={stats.tomorrow} color="bg-lago/10" />
                    <StatCard icon={<ChartIcon className="w-5 h-5 text-purple-600" />} label="Esta semana" value={stats.week} color="bg-purple-50" />
                    <StatCard icon={<MoneyIcon className="w-5 h-5 text-musgo" />} label="Ingresos mes" value={stats.revenue > 0 ? `${stats.revenue.toFixed(0)}€` : "—"} color="bg-musgo/10" />
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-pizarra">Mis Reservas</h2>
                    <div className="flex flex-wrap gap-2 items-center">
                        <input type="text" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)}
                            className="px-3 py-1.5 text-sm bg-white border border-roca-dark/20 rounded-lg focus:ring-2 focus:ring-musgo/30 focus:outline-none w-44" />
                        {FILTERS.map(f => (
                            <button key={f.v} onClick={() => setFilter(f.v)}
                                className={`px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1.5 ${filter === f.v ? "bg-pizarra text-white" : "bg-white border border-roca-dark/20 text-granito hover:text-pizarra"}`}>
                                <span className={`w-2 h-2 rounded-full ${f.dot}`} />
                                {f.l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-dashed border-roca-dark/30 rounded-2xl p-10 text-center">
                        <ClipboardIcon className="w-10 h-10 text-musgo/20 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-pizarra mb-1">{search ? "Sin resultados" : "Sin reservas"}</h3>
                        <p className="text-sm text-granito">{search ? "Prueba otro término." : "Las reservas aparecerán aquí."}</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {Object.entries(grouped).map(([dateLabel, dateBookings]) => (
                            <div key={dateLabel}>
                                <p className="text-xs font-bold text-granito uppercase tracking-wide mb-2.5">{dateLabel} · {dateBookings.length} reserva{dateBookings.length !== 1 ? "s" : ""}</p>
                                <div className="space-y-2.5">
                                    {dateBookings.map(b => {
                                        const st = STATUS_MAP[b.status] || STATUS_MAP.PENDING
                                        const paid = b.payment?.status === "SUCCEEDED"
                                        const total = (b.timeSlot.activity.priceCents * b.numPeople / 100).toFixed(0)
                                        return (
                                            <div key={b.id} className="bg-white border border-roca-dark/15 rounded-xl p-4 hover:shadow-md transition group">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <CategoryIcon category={b.timeSlot.activity.category} className="w-8 h-8 text-musgo mt-0.5 shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className="text-sm font-bold text-musgo">{b.timeSlot.startTime}h</span>
                                                                <span className="font-semibold text-pizarra">{b.customerName}</span>
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${st.className}`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                                    {st.label}
                                                                </span>
                                                                {b.numPeople > 1 && <span className="text-[10px] text-granito bg-niebla px-2 py-0.5 rounded-full">👥 {b.numPeople} pers.</span>}
                                                            </div>
                                                            <p className="text-sm text-granito mb-1">
                                                                {b.timeSlot.activity.title} · <span className="font-medium">{total}€</span>
                                                                {paid ? <span className="text-musgo text-xs ml-1.5">✓ Pagado</span> : <span className="text-amber-500 text-xs ml-1.5">⏳ Pago pendiente</span>}
                                                            </p>
                                                            <div className="flex gap-3 text-[11px] text-granito">
                                                                <span>📧 {b.customerEmail}</span>
                                                                {b.customerPhone && <span>📞 {b.customerPhone}</span>}
                                                            </div>
                                                            {b.notes && <p className="text-[11px] text-granito/60 italic mt-1.5 bg-niebla rounded-lg px-2.5 py-1">📝 {b.notes}</p>}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition">
                                                        {b.customerPhone && (
                                                            <>
                                                                <a href={waLink(b.customerPhone, b.customerName)} target="_blank" rel="noopener noreferrer"
                                                                    className="p-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition" title="WhatsApp">
                                                                    <PhoneIcon className="w-4 h-4 text-[#25D366]" />
                                                                </a>
                                                                <a href={`tel:${b.customerPhone.replace(/\s+/g, "")}`}
                                                                    className="p-2 bg-lago/10 hover:bg-lago/20 rounded-lg transition" title="Llamar">
                                                                    <PhoneIcon className="w-4 h-4 text-lago" />
                                                                </a>
                                                            </>
                                                        )}
                                                        {b.status === "CONFIRMED" && (
                                                            <>
                                                                <button onClick={() => updateStatus(b.id, "check-in")}
                                                                    className="px-2.5 py-1.5 text-[10px] bg-musgo/10 hover:bg-musgo/20 text-musgo rounded-lg transition font-medium" title="Marcar completada">
                                                                    ✅ Check-in
                                                                </button>
                                                                <button onClick={() => updateStatus(b.id, "cancel")}
                                                                    className="px-2.5 py-1.5 text-[10px] bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition font-medium">
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Mobile nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-roca-dark/20 px-4 py-2 z-40">
                <div className="flex justify-around">
                    <a href="/dashboard" className="flex flex-col items-center text-granito text-xs py-1"><MountainIcon className="w-5 h-5 mb-0.5" />Inicio</a>
                    <a href="/dashboard/activities" className="flex flex-col items-center text-granito text-xs py-1"><ClipboardIcon className="w-5 h-5 mb-0.5" />Actividades</a>
                    <a href="/dashboard/bookings" className="flex flex-col items-center text-musgo text-xs font-medium py-1"><ChartIcon className="w-5 h-5 mb-0.5" />Reservas</a>
                    <a href="/dashboard/profile" className="flex flex-col items-center text-granito text-xs py-1"><UserIcon className="w-5 h-5 mb-0.5" />Perfil</a>
                </div>
            </div>
        </div>
    )
}
