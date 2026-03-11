"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BootIcon, EditIcon, CheckIcon, MountainIcon, CategoryIcon } from "@/components/icons"
import { PhotoUploader } from "@/components/photo-uploader"
import dynamic from "next/dynamic"

const MapPicker = dynamic(() => import("@/components/map-picker").then(m => m.MapPicker), { ssr: false, loading: () => <div className="w-full h-64 bg-roca rounded-xl animate-pulse" /> })

const CATEGORIES = [
    { id: "hiking", label: "Senderismo" },
    { id: "climbing", label: "Escalada" },
    { id: "biking", label: "BTT" },
    { id: "kayak", label: "Kayak" },
    { id: "ski", label: "Esquí" },
    { id: "camping", label: "Camping" },
    { id: "photography", label: "Fotografía" },
    { id: "yoga", label: "Yoga outdoor" },
    { id: "other", label: "Otro" },
]

const DIFFICULTIES = [
    { v: "LOW", l: "Fácil", color: "bg-green-500", border: "border-green-300", bg: "bg-green-50", desc: "Apto para principiantes. Terreno llano o suave." },
    { v: "MEDIUM", l: "Moderado", color: "bg-amber-500", border: "border-amber-300", bg: "bg-amber-50", desc: "Requiere forma física media. Desnivel moderado." },
    { v: "HIGH", l: "Difícil", color: "bg-red-500", border: "border-red-300", bg: "bg-red-50", desc: "Solo con experiencia previa. Terreno exigente." },
]

const QUICK_INCLUDES = ["Guía titulado", "Seguro de accidentes", "Fotografías", "Material técnico", "Snack/picnic"]
const QUICK_BRING = ["Agua (mín 1.5L)", "Calzado de montaña", "Protección solar", "Ropa impermeable", "Mochila pequeña"]

interface ActivityData {
    id?: string; title: string; description: string | null; priceCents: number
    durationMinutes: number; maxParticipants: number; category: string; difficulty: string
    meetingPoint: string | null; meetingLat: number | null; meetingLng: number | null
    includes: string | null; whatToBring: string | null; photos: string[]
}

interface Props {
    mode: "create" | "edit"
    activity?: ActivityData
    onDone?: () => void
}

function Section({ title, subtitle, children, defaultOpen = true }: { title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border border-roca-dark/15 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 bg-niebla/50 hover:bg-niebla transition text-left">
                <div><p className="text-sm font-semibold text-pizarra">{title}</p>{subtitle && <p className="text-xs text-granito mt-0.5">{subtitle}</p>}</div>
                <span className={`text-granito transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
            </button>
            {open && <div className="p-5 space-y-4">{children}</div>}
        </div>
    )
}

function QuickTags({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
    const selected = value.split("\n").map(s => s.trim()).filter(Boolean)
    const toggle = (item: string) => {
        const next = selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item]
        onChange(next.join("\n"))
    }
    return (
        <div className="flex flex-wrap gap-1.5 mb-2">
            {items.map(item => (
                <button key={item} type="button" onClick={() => toggle(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition border ${selected.includes(item) ? "bg-musgo/10 border-musgo/30 text-musgo font-medium" : "bg-white border-roca-dark/20 text-granito hover:border-granito"}`}>
                    {selected.includes(item) ? "✓ " : "+ "}{item}
                </button>
            ))}
        </div>
    )
}

export function ActivityForm({ mode, activity, onDone }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [category, setCategory] = useState(activity?.category || "hiking")
    const [difficulty, setDifficulty] = useState(activity?.difficulty || "MEDIUM")
    const [descLen, setDescLen] = useState(activity?.description?.length || 0)
    const [photos, setPhotos] = useState<string[]>(activity?.photos || [])
    const [meetingLat, setMeetingLat] = useState<number | null>(activity?.meetingLat || null)
    const [meetingLng, setMeetingLng] = useState<number | null>(activity?.meetingLng || null)
    const [meetingAddr, setMeetingAddr] = useState(activity?.meetingPoint || "")
    const [includes, setIncludes] = useState(activity?.includes || "")
    const [whatToBring, setWhatToBring] = useState(activity?.whatToBring || "")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const router = useRouter()
    const isEdit = mode === "edit"

    function validate(fd: FormData): boolean {
        const errs: Record<string, string> = {}
        if (!String(fd.get("title")).trim()) errs.title = "El nombre es obligatorio"
        const price = Number(fd.get("price"))
        if (isNaN(price) || price < 0) errs.price = "Precio no válido"
        const hours = Number(fd.get("hours")), mins = Number(fd.get("mins") || 0)
        if (hours === 0 && mins === 0) errs.duration = "La duración no puede ser 0"
        if (hours > 48) errs.duration = "Máximo 48 horas"
        const max = Number(fd.get("max"))
        if (max < 1 || max > 100) errs.max = "Entre 1 y 100 personas"
        setFieldErrors(errs)
        return Object.keys(errs).length === 0
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(""); setSuccess("")
        const fd = new FormData(e.currentTarget)
        if (!validate(fd)) return

        setLoading(true)
        const payload = {
            title: fd.get("title"), description: fd.get("description"),
            priceCents: Math.round(Number(fd.get("price")) * 100),
            durationMinutes: Number(fd.get("hours")) * 60 + Number(fd.get("mins") || 0),
            maxParticipants: Number(fd.get("max")),
            category, difficulty,
            meetingPoint: fd.get("meetingPoint"), meetingLat, meetingLng,
            includes, whatToBring, photos,
        }

        try {
            const url = isEdit ? `/api/activities/${activity!.id}` : "/api/activities"
            const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            if (!res.ok) { const d = await res.json(); setError(d.error || "Error al guardar"); setLoading(false); return }
            setLoading(false)
            if (isEdit) { setSuccess("✅ Cambios guardados"); setTimeout(() => router.push("/dashboard/activities"), 1000) }
            else { onDone?.(); router.refresh() }
        } catch { setError("Error de conexión. Inténtalo de nuevo."); setLoading(false) }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-roca-dark/20 rounded-2xl p-6 mb-6 space-y-4 animate-slide-up">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                {isEdit ? <EditIcon className="w-5 h-5 text-musgo" /> : <BootIcon className="w-5 h-5 text-musgo" />}
                <h3 className="text-lg font-bold text-pizarra">{isEdit ? "Editar actividad" : "Nueva actividad"}</h3>
            </div>

            {error && <div className="bg-atardecer/10 border border-atardecer/20 text-atardecer px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">⚠️ {error}</div>}
            {success && <div className="bg-musgo/10 border border-musgo/20 text-musgo px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><CheckIcon className="w-4 h-4" /> {success}</div>}

            {/* Section 1: Básico */}
            <Section title="📋 Información básica" subtitle="Nombre, tipo y dificultad">
                <div>
                    <label className="block text-sm font-medium text-pizarra mb-1.5">Tipo de actividad <span className="text-atardecer">*</span></label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(c => (
                            <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                                className={`px-3 py-2 rounded-xl text-sm transition border flex items-center gap-1.5 ${category === c.id ? "bg-musgo/10 border-musgo/30 text-musgo font-medium" : "bg-white border-roca-dark/20 text-granito hover:border-granito"}`}>
                                <CategoryIcon category={c.id} className="w-4 h-4" />
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-pizarra mb-1.5">Nombre de la actividad <span className="text-atardecer">*</span></label>
                    <input name="title" required maxLength={60} defaultValue={activity?.title || ""} placeholder="Ej: Senderismo por la Sierra de Guara"
                        className={`w-full px-4 py-2.5 border rounded-xl text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none ${fieldErrors.title ? "border-atardecer" : "border-roca-dark/30"}`} />
                    {fieldErrors.title && <p className="text-xs text-atardecer mt-1">{fieldErrors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-pizarra mb-1.5">Descripción</label>
                    <textarea name="description" rows={3} maxLength={500} defaultValue={activity?.description || ""} placeholder="Describe la actividad: qué van a hacer, qué van a ver, nivel de esfuerzo..."
                        onChange={(e) => setDescLen(e.target.value.length)}
                        className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-xl text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none resize-none" />
                    <p className={`text-xs mt-1 ${descLen > 450 ? "text-atardecer font-medium" : descLen > 400 ? "text-amber-500" : "text-granito"}`}>{descLen}/500 caracteres</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-pizarra mb-2">Dificultad <span className="text-atardecer">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                        {DIFFICULTIES.map(d => (
                            <button key={d.v} type="button" onClick={() => setDifficulty(d.v)}
                                className={`p-3 rounded-xl text-left transition border ${difficulty === d.v ? `${d.bg} ${d.border} font-medium` : "bg-white border-roca-dark/20 hover:border-granito"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${d.color}`} />
                                    <span className={`text-sm ${difficulty === d.v ? "text-pizarra" : "text-granito"}`}>{d.l}</span>
                                </div>
                                <p className="text-[10px] text-granito leading-snug">{d.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Section 2: Detalles */}
            <Section title="💰 Precio y capacidad" subtitle="Coste, duración y plazas">
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-pizarra mb-1">Precio (€) <span className="text-atardecer">*</span></label>
                        <input name="price" type="number" min="0" step="0.01" required defaultValue={activity ? (activity.priceCents / 100).toFixed(2) : ""} placeholder="25"
                            className={`w-full px-3 py-2.5 border rounded-xl text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none ${fieldErrors.price ? "border-atardecer" : "border-roca-dark/30"}`} />
                        {fieldErrors.price && <p className="text-[10px] text-atardecer mt-0.5">{fieldErrors.price}</p>}
                        <p className="text-[10px] text-granito mt-0.5">0 = Gratis</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-pizarra mb-1">Duración <span className="text-atardecer">*</span></label>
                        <div className="flex gap-1">
                            <input name="hours" type="number" min="0" max="48" required defaultValue={activity ? Math.floor(activity.durationMinutes / 60) : ""} placeholder="2"
                                className={`w-full px-2 py-2.5 border rounded-xl text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none text-center ${fieldErrors.duration ? "border-atardecer" : "border-roca-dark/30"}`} />
                            <span className="self-center text-granito text-xs">h</span>
                            <input name="mins" type="number" min="0" max="59" defaultValue={activity ? activity.durationMinutes % 60 : ""} placeholder="0"
                                className="w-full px-2 py-2.5 border border-roca-dark/30 rounded-xl text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none text-center" />
                            <span className="self-center text-granito text-xs">m</span>
                        </div>
                        {fieldErrors.duration && <p className="text-[10px] text-atardecer mt-0.5">{fieldErrors.duration}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-pizarra mb-1">Máx. personas <span className="text-atardecer">*</span></label>
                        <input name="max" type="number" min="1" max="100" required defaultValue={activity?.maxParticipants || ""} placeholder="10"
                            className={`w-full px-3 py-2.5 border rounded-xl text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none ${fieldErrors.max ? "border-atardecer" : "border-roca-dark/30"}`} />
                        {fieldErrors.max && <p className="text-[10px] text-atardecer mt-0.5">{fieldErrors.max}</p>}
                    </div>
                </div>
            </Section>

            {/* Section 3: Ubicación */}
            <Section title="📍 Punto de encuentro" subtitle="Dónde se encuentran los participantes">
                <div>
                    <input name="meetingPoint" placeholder="Ej: Parking del refugio de La Pedriza" value={meetingAddr} onChange={(e) => setMeetingAddr(e.target.value)}
                        className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-xl text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none mb-3" />
                    <MapPicker lat={meetingLat} lng={meetingLng} address={meetingAddr} onChange={(lat, lng) => { setMeetingLat(lat); setMeetingLng(lng) }} />
                    {meetingLat && meetingLng && <p className="text-xs text-musgo mt-2 flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Punto marcado en el mapa</p>}
                </div>
            </Section>

            {/* Section 4: Incluye / Traer */}
            <Section title="🎒 Qué incluye y qué traer" subtitle="Selecciona o escribe los tuyos" defaultOpen={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-pizarra mb-2">Qué incluye la actividad</label>
                        <QuickTags items={QUICK_INCLUDES} value={includes} onChange={setIncludes} />
                        <textarea name="_includes_display" rows={3} value={includes} onChange={(e) => setIncludes(e.target.value)} placeholder="Añade más (uno por línea)..."
                            className="w-full px-3 py-2 border border-roca-dark/30 rounded-xl text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none resize-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-pizarra mb-2">Qué deben traer los participantes</label>
                        <QuickTags items={QUICK_BRING} value={whatToBring} onChange={setWhatToBring} />
                        <textarea name="_bring_display" rows={3} value={whatToBring} onChange={(e) => setWhatToBring(e.target.value)} placeholder="Añade más (uno por línea)..."
                            className="w-full px-3 py-2 border border-roca-dark/30 rounded-xl text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none resize-none text-sm" />
                    </div>
                </div>
            </Section>

            {/* Section 5: Fotos */}
            <Section title="📸 Fotos" subtitle="Sube fotos de la actividad" defaultOpen={false}>
                <PhotoUploader photos={photos} onChange={setPhotos} />
            </Section>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-roca-dark/10">
                <button type="submit" disabled={loading}
                    className="px-6 py-3 bg-musgo hover:bg-musgo-dark text-white font-medium rounded-xl transition disabled:opacity-50 shadow-lg shadow-musgo/25 flex items-center gap-2">
                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</> : isEdit ? "Guardar cambios" : <><CheckIcon className="w-4 h-4" /> Crear actividad</>}
                </button>
                {isEdit ? (
                    <a href="/dashboard/activities" className="px-6 py-3 bg-white border border-roca-dark/30 text-granito hover:text-pizarra rounded-xl transition inline-flex items-center">Cancelar</a>
                ) : (
                    <button type="button" onClick={onDone} className="px-6 py-3 bg-white border border-roca-dark/30 text-granito hover:text-pizarra rounded-xl transition">Cancelar</button>
                )}
            </div>
        </form>
    )
}
