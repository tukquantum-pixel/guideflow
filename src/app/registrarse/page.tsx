"use client"

import { useState } from "react"
import Link from "next/link"

export default function UserRegisterPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true); setError("")
        const fd = new FormData(e.currentTarget)
        const name = fd.get("name") as string
        const email = fd.get("email") as string
        const password = fd.get("password") as string

        const res = await fetch("/api/user-auth/register", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Error al registrar"); setLoading(false); return }
        window.location.href = "/entrar"
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-pizarra p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <p className="text-4xl mb-2">🏔️</p>
                    <h1 className="text-3xl font-bold text-white">Únete a PATHY</h1>
                    <p className="text-musgo-light mt-2">Descubre rutas de guías profesionales</p>
                </div>
                <div className="bg-pizarra-light/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6">Crear cuenta gratuita</h2>
                    {error && <div className="bg-atardecer/20 border border-atardecer/30 text-atardecer px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-musgo-light mb-1">Nombre</label>
                            <input name="name" required placeholder="Tu nombre"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo" />
                        </div>
                        <div>
                            <label className="block text-sm text-musgo-light mb-1">Email</label>
                            <input name="email" type="email" required placeholder="tu@email.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo" />
                        </div>
                        <div>
                            <label className="block text-sm text-musgo-light mb-1">Contraseña</label>
                            <input name="password" type="password" required minLength={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-musgo hover:bg-musgo-light text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg shadow-musgo/25">
                            {loading ? "Creando..." : "Crear cuenta gratis"}
                        </button>
                    </form>

                    <div className="mt-4 bg-white/5 rounded-lg p-4 text-center">
                        <p className="text-xs text-white/50">Plan gratuito: 3 rutas/mes</p>
                        <p className="text-xs text-musgo-light">Actualiza a Explorer por solo 9,99€/año</p>
                    </div>

                    <p className="mt-4 text-center text-sm text-white/40">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/entrar" className="text-musgo-light hover:text-musgo transition">Inicia sesión</Link>
                    </p>
                    <p className="mt-3 text-center text-sm text-white/30">
                        ¿Eres guía profesional? <Link href="/register" className="text-lago hover:text-lago-dark transition">Regístrate como guía</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
