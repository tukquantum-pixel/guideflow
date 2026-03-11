"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { MountainIcon, CategoryIcon, CheckIcon } from "@/components/icons"

// — Activity types with their specific fields —
const ACTIVITY_TYPES = [
    { id: "mountain", label: "Montaña y escalada", cat: "montana" },
    { id: "surf", label: "Surf y acuáticos", cat: "agua" },
    { id: "biking", label: "BTT y ciclismo", cat: "bici" },
    { id: "ski", label: "Esquí y nieve", cat: "nieve" },
    { id: "horse", label: "Rutas a caballo", cat: "montana" },
    { id: "photography", label: "Fotografía naturaleza", cat: "montana" },
    { id: "yoga", label: "Yoga y bienestar", cat: "montana" },
    { id: "birding", label: "Observación de aves", cat: "montana" },
    { id: "kayak", label: "Kayak y piragüismo", cat: "agua" },
    { id: "climbing", label: "Alta montaña (UIAGM)", cat: "montana" },
]

// — Dynamic fields per activity type —
const ACTIVITY_FIELDS: Record<string, { certs: string[]; equip: string[]; extra?: { label: string; type: string; placeholder?: string }[] }> = {
    mountain: {
        certs: ["TD Media Montaña", "TD Escalada", "Guía UIAGM/IFMGA", "Rescate en Montaña"],
        equip: ["Cuerdas", "Arnés", "Casco", "Crampones", "Piolet", "Bastones", "Material escalada"],
        extra: [{ label: "Altitud máxima de trabajo (m)", type: "number", placeholder: "3000" }],
    },
    surf: {
        certs: ["Instructor Surf (Federación)", "Socorrismo", "Primeros Auxilios", "Licencia Federativa"],
        equip: ["Tabla", "Neopreno", "Leash", "Escarpines", "Parafina"],
        extra: [
            { label: "Tipo de olas", type: "select", placeholder: "Principiantes (0.5-1m)|Intermedios (1-2m)|Avanzados (2m+)" },
            { label: "Tipo de fondo", type: "select", placeholder: "Arena|Roca|Mixto" },
        ],
    },
    biking: {
        certs: ["TD Ciclismo", "Guía BTT", "Mecánica básica", "Primeros Auxilios"],
        equip: ["Bici de repuesto", "Herramientas", "Bomba", "Cámaras", "Casco extra"],
    },
    ski: {
        certs: ["TD Esquí Alpino", "TD Esquí Fondo", "TD Snowboard", "Rescate en Avalanchas"],
        equip: ["ARVA", "Pala", "Sonda", "Esquís de repuesto"],
        extra: [{ label: "Estaciones donde operas", type: "text", placeholder: "Formigal, Candanchú..." }],
    },
    horse: {
        certs: ["Guía ecuestre", "TD Hípica", "Primeros Auxilios equinos"],
        equip: ["Cascos", "Botas", "Chalecos protectores"],
        extra: [{ label: "Nº de caballos disponibles", type: "number", placeholder: "6" }],
    },
    photography: {
        certs: ["Formación fotografía", "Guía naturaleza", "Permiso fauna protegida"],
        equip: ["Cámara réflex/mirrorless", "Teleobjetivo 300mm+", "Trípode", "Filtros", "Hide/escondite"],
        extra: [{ label: "Especialidad", type: "select", placeholder: "Paisaje|Fauna|Aves|Macro|Nocturna|Astrofoto" }],
    },
    yoga: {
        certs: ["200h RYS", "300h RYS", "500h RYS", "Yoga Alliance"],
        equip: ["Esterillas", "Cojines", "Mantas", "Bloques", "Correas"],
        extra: [{ label: "Estilo principal", type: "select", placeholder: "Hatha|Vinyasa|Ashtanga|Yin|Restaurativo|Meditación" }],
    },
    birding: {
        certs: ["Guía ornitológico", "SEO/BirdLife", "Anillador certificado"],
        equip: ["Prismáticos", "Telescopio terrestre", "Guías de campo", "Grabadora de sonidos"],
        extra: [{ label: "Especies clave de tu zona", type: "text", placeholder: "Quebrantahuesos, Águila real..." }],
    },
    kayak: {
        certs: ["Monitor kayak (Federación)", "Socorrismo", "Rescate acuático", "Primeros Auxilios"],
        equip: ["Kayak", "Chaleco salvavidas", "Remo de repuesto", "Bidón estanco"],
        extra: [{ label: "Tipo de agua", type: "select", placeholder: "Mar|Río|Embalse|Mixto" }],
    },
    climbing: {
        certs: ["Guía UIAGM/IFMGA", "TD Alta Montaña", "Rescate en grietas", "Medicina de montaña"],
        equip: ["Cuerdas dobles", "Reunión completa", "Material glaciar", "Botiquín altitud"],
        extra: [{ label: "Cota máxima alcanzada (m)", type: "number", placeholder: "5000" }],
    },
}

const EXPERIENCE_OPTIONS = ["< 2 años", "2-5 años", "5-10 años", "> 10 años"]

type Step = 1 | 2 | 3

export default function RegisterPage() {
    const [step, setStep] = useState<Step>(1)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Step 1 data
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Step 2 data
    const [selectedActivities, setSelectedActivities] = useState<string[]>([])

    // Step 3 data — per-activity JSON
    const [actData, setActData] = useState<Record<string, { certs: string[]; equip: string[]; experience: string; extras: Record<string, string> }>>({})

    function toggleActivity(id: string) {
        setSelectedActivities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
    }

    function updateActField(actId: string, field: "certs" | "equip", value: string) {
        setActData(prev => {
            const cur = prev[actId] || { certs: [], equip: [], experience: "", extras: {} }
            const arr = cur[field]
            const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
            return { ...prev, [actId]: { ...cur, [field]: next } }
        })
    }

    function updateActExp(actId: string, exp: string) {
        setActData(prev => ({ ...prev, [actId]: { ...(prev[actId] || { certs: [], equip: [], experience: "", extras: {} }), experience: exp } }))
    }

    function updateActExtra(actId: string, key: string, value: string) {
        setActData(prev => {
            const cur = prev[actId] || { certs: [], equip: [], experience: "", extras: {} }
            return { ...prev, [actId]: { ...cur, extras: { ...cur.extras, [key]: value } } }
        })
    }

    async function handleSubmit() {
        setLoading(true); setError("")
        try {
            // Create account
            const res = await fetch("/api/auth/register", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email, password,
                    activityTypes: selectedActivities,
                    specializations: selectedActivities.flatMap(a => (actData[a]?.certs || [])),
                    equipment: actData,
                    professionCategory: selectedActivities[0] ? ACTIVITY_TYPES.find(t => t.id === selectedActivities[0])?.cat : null,
                }),
            })
            if (!res.ok) { const d = await res.json(); setError(d.error || "Error"); setLoading(false); return }
            await signIn("credentials", { email, password, callbackUrl: "/dashboard" })
        } catch { setError("Error de conexión"); setLoading(false) }
    }

    const inputCls = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo focus:border-transparent transition"

    return (
        <div className="min-h-screen flex items-center justify-center bg-pizarra p-4">
            <div className="w-full max-w-2xl animate-fade-in">
                {/* Header */}
                <div className="text-center mb-6">
                    <MountainIcon className="w-10 h-10 text-musgo mx-auto mb-2" />
                    <h1 className="text-3xl font-bold text-white">PATHY</h1>
                    <p className="text-granito-light mt-1 text-sm">Registro de guía profesional</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${step >= s ? "bg-musgo text-white" : "bg-white/10 text-white/30"}`}>{s}</div>
                            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-musgo" : "bg-white/10"}`} />}
                        </div>
                    ))}
                    <span className="text-xs text-granito ml-2">{step === 1 ? "Cuenta" : step === 2 ? "Actividades" : "Detalles"}</span>
                </div>

                <div className="bg-pizarra-light/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                    {error && <div className="bg-atardecer/20 border border-atardecer/30 text-atardecer px-4 py-2.5 rounded-lg mb-4 text-sm">⚠️ {error}</div>}

                    {/* STEP 1: Account */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Crear cuenta</h2>
                            <div>
                                <label className="block text-sm text-musgo-light mb-1">Nombre completo</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Paco García" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-sm text-musgo-light mb-1">Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="paco@guia.com" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-sm text-musgo-light mb-1">Contraseña</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" minLength={8} className={inputCls} />
                            </div>
                            <button onClick={() => { if (name && email && password.length >= 8) setStep(2); else setError("Completa todos los campos") }}
                                className="w-full py-3 bg-musgo hover:bg-musgo-light text-white font-medium rounded-lg transition shadow-lg shadow-musgo/25">
                                Siguiente: elegir actividades →
                            </button>
                            <div className="mt-4 flex items-center gap-4"><div className="flex-1 h-px bg-white/10" /><span className="text-white/30 text-sm">o</span><div className="flex-1 h-px bg-white/10" /></div>
                            <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="mt-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Registrarse con Google
                            </button>
                            <p className="mt-4 text-center text-sm text-white/40">¿Ya tienes cuenta? <Link href="/login" className="text-musgo-light hover:text-musgo transition">Inicia sesión</Link></p>
                        </div>
                    )}

                    {/* STEP 2: Select activities */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">¿Qué actividades ofreces?</h2>
                            <p className="text-sm text-granito-light mb-5">Selecciona todas las que apliquen. Podrás cambiarlas después.</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {ACTIVITY_TYPES.map(a => {
                                    const sel = selectedActivities.includes(a.id)
                                    return (
                                        <button key={a.id} type="button" onClick={() => toggleActivity(a.id)}
                                            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-2.5 ${sel ? "bg-musgo/15 border-musgo/40 text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/25"}`}>
                                            <CategoryIcon category={a.id === "climbing" ? "climbing" : a.id === "horse" ? "other" : a.id === "birding" ? "other" : a.id} className="w-6 h-6 shrink-0" />
                                            <span className="text-sm font-medium">{a.label}</span>
                                            {sel && <CheckIcon className="w-4 h-4 text-musgo ml-auto shrink-0" />}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setStep(1)} className="px-5 py-3 bg-white/5 border border-white/10 text-white/60 rounded-lg transition hover:bg-white/10">← Atrás</button>
                                <button onClick={() => { if (selectedActivities.length > 0) setStep(3); else setError("Selecciona al menos una actividad") }}
                                    className="flex-1 py-3 bg-musgo hover:bg-musgo-light text-white font-medium rounded-lg transition shadow-lg shadow-musgo/25 disabled:opacity-50" disabled={selectedActivities.length === 0}>
                                    Siguiente: completar perfil → ({selectedActivities.length} seleccionadas)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Dynamic fields per activity */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-white mb-1">Tu perfil profesional</h2>
                            <p className="text-sm text-granito-light mb-4">Completa los detalles de cada actividad. Esto ayuda a los clientes a elegirte.</p>

                            {selectedActivities.map(actId => {
                                const act = ACTIVITY_TYPES.find(a => a.id === actId)!
                                const fields = ACTIVITY_FIELDS[actId]
                                if (!fields) return null
                                const data = actData[actId] || { certs: [], equip: [], experience: "", extras: {} }

                                return (
                                    <div key={actId} className="bg-white/5 border border-white/10 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CategoryIcon category={actId === "climbing" ? "climbing" : actId === "horse" ? "other" : actId === "birding" ? "other" : actId} className="w-5 h-5 text-musgo" />
                                            <h3 className="font-semibold text-white">{act.label}</h3>
                                        </div>

                                        {/* Certifications */}
                                        <div className="mb-4">
                                            <p className="text-xs text-musgo-light mb-2 font-medium">Titulaciones y certificaciones</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {fields.certs.map(c => (
                                                    <button key={c} type="button" onClick={() => updateActField(actId, "certs", c)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs transition border ${data.certs.includes(c) ? "bg-musgo/20 border-musgo/40 text-musgo-light" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}>
                                                        {data.certs.includes(c) ? "✓ " : ""}{c}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Experience */}
                                        <div className="mb-4">
                                            <p className="text-xs text-musgo-light mb-2 font-medium">Experiencia</p>
                                            <div className="flex gap-2">
                                                {EXPERIENCE_OPTIONS.map(e => (
                                                    <button key={e} type="button" onClick={() => updateActExp(actId, e)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs transition border ${data.experience === e ? "bg-musgo/20 border-musgo/40 text-musgo-light" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}>
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Equipment */}
                                        <div className="mb-4">
                                            <p className="text-xs text-musgo-light mb-2 font-medium">Equipo que proporcionas</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {fields.equip.map(eq => (
                                                    <button key={eq} type="button" onClick={() => updateActField(actId, "equip", eq)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs transition border ${data.equip.includes(eq) ? "bg-lago/20 border-lago/30 text-lago" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}>
                                                        {data.equip.includes(eq) ? "✓ " : ""}{eq}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Extra fields */}
                                        {fields.extra?.map(ex => (
                                            <div key={ex.label} className="mb-3">
                                                <p className="text-xs text-musgo-light mb-1.5 font-medium">{ex.label}</p>
                                                {ex.type === "select" ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {ex.placeholder?.split("|").map(opt => (
                                                            <button key={opt} type="button" onClick={() => updateActExtra(actId, ex.label, opt)}
                                                                className={`px-2.5 py-1.5 rounded-lg text-xs transition border ${data.extras[ex.label] === opt ? "bg-musgo/20 border-musgo/40 text-musgo-light" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}>
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <input type={ex.type} placeholder={ex.placeholder} value={data.extras[ex.label] || ""}
                                                        onChange={e => updateActExtra(actId, ex.label, e.target.value)}
                                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setStep(2)} className="px-5 py-3 bg-white/5 border border-white/10 text-white/60 rounded-lg transition hover:bg-white/10">← Actividades</button>
                                <button onClick={handleSubmit} disabled={loading}
                                    className="flex-1 py-3 bg-musgo hover:bg-musgo-light text-white font-medium rounded-lg transition shadow-lg shadow-musgo/25 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creando perfil...</> : <><CheckIcon className="w-4 h-4" /> Crear mi perfil profesional</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
