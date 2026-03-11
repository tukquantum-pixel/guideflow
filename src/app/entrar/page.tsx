"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function UserLoginPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true); setError("")
        const fd = new FormData(e.currentTarget)
        const result = await signIn("credentials", {
            email: fd.get("email"), password: fd.get("password"), redirect: false,
        })
        if (result?.error) { setError("Email o contraseña incorrectos"); setLoading(false); return }
        window.location.href = "/explorar"
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-pizarra p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <p className="text-4xl mb-2">🏔️</p>
                    <h1 className="text-3xl font-bold text-white">PATHY</h1>
                    <p className="text-musgo-light mt-2">Accede para explorar rutas</p>
                </div>
                <div className="bg-pizarra-light/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h2>
                    {error && <div className="bg-atardecer/20 border border-atardecer/30 text-atardecer px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-musgo-light mb-1">Email</label>
                            <input name="email" type="email" required placeholder="tu@email.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo" />
                        </div>
                        <div>
                            <label className="block text-sm text-musgo-light mb-1">Contraseña</label>
                            <input name="password" type="password" required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-musgo" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-musgo hover:bg-musgo-light text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg shadow-musgo/25">
                            {loading ? "Entrando..." : "Iniciar sesión"}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-white/40">
                        ¿No tienes cuenta?{" "}
                        <Link href="/registrarse" className="text-musgo-light hover:text-musgo transition">Regístrate gratis</Link>
                    </p>
                    <p className="mt-3 text-center text-sm text-white/30">
                        ¿Eres guía? <Link href="/login" className="text-lago hover:text-lago-dark transition">Accede aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
