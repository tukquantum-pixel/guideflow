"use client"

import Link from "next/link"
import { useState } from "react"
import { StarIcon, CheckIcon } from "@/components/icons"

const PLANS = [
    { key: "FREE", name: "Gratuito", price: "0€", features: ["Guardar hasta 5 rutas", "Ver rutas oficiales", "Mapa online", "Búsqueda básica"], current: false },
    { key: "EXPLORER", name: "Explorer", price: "9,99€/año", features: ["Rutas guardadas ilimitadas", "Mapas offline", "Alertas de desvío", "Exportar GPX", "Waypoints personalizados"], current: false },
    { key: "PEAK", name: "Peak", price: "19,99€/año", features: ["Todo de Explorer", "Live tracking", "Estadísticas avanzadas", "Condiciones del sendero", "Rutas con IA", "Vista 3D"], current: false },
]

export default function CuentaPage() {
    const [loading, setLoading] = useState("")

    async function handleUpgrade(plan: string) {
        setLoading(plan)
        const res = await fetch("/api/user/subscription", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan }),
        })
        const data = await res.json()
        if (data.url) window.location.href = data.url
        else { alert(data.error || "Error"); setLoading("") }
    }

    return (
        <div className="min-h-screen bg-niebla">
            <nav className="bg-pizarra text-white py-3">
                <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
                    <Link href="/explorar" className="text-musgo-light hover:text-white transition">← Explorar</Link>
                    <Link href="/mis-rutas" className="text-sm text-white/70 hover:text-white transition">Mis rutas</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-pizarra text-center mb-2">Elige tu plan</h1>
                <p className="text-center text-granito mb-10">Descubre rutas de guías profesionales verificados</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map(p => (
                        <div key={p.key} className={`bg-white rounded-xl p-6 border-2 transition ${p.key === "EXPLORER" ? "border-musgo shadow-lg scale-105" : "border-roca-dark/20"}`}>
                            {p.key === "EXPLORER" && <span className="flex items-center justify-center gap-1 text-xs text-musgo font-semibold text-center mb-2"><StarIcon className="w-3.5 h-3.5" /> RECOMENDADO</span>}
                            <h3 className="text-xl font-bold text-pizarra text-center">{p.name}</h3>
                            <p className="text-3xl font-bold text-center text-pizarra mt-2">{p.price}</p>
                            <ul className="mt-6 space-y-2">
                                {p.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-granito">
                                        <span className="text-musgo"><CheckIcon className="w-3.5 h-3.5" /></span> {f}
                                    </li>
                                ))}
                            </ul>
                            {p.key !== "FREE" && (
                                <button onClick={() => handleUpgrade(p.key)} disabled={loading === p.key}
                                    className={`w-full mt-6 py-3 rounded-lg font-medium transition ${p.key === "EXPLORER" ? "bg-musgo hover:bg-musgo-dark text-white shadow-lg shadow-musgo/25" : "bg-pizarra hover:bg-pizarra-light text-white"} disabled:opacity-50`}>
                                    {loading === p.key ? "Redirigiendo..." : `Suscribirse a ${p.name}`}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
