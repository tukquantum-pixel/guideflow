"use client"

import { useState } from "react"

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    )
}

export function SaveRouteButton({ activityId, initialSaved = false }: { activityId: string; initialSaved?: boolean }) {
    const [saved, setSaved] = useState(initialSaved)
    const [loading, setLoading] = useState(false)

    async function toggle() {
        setLoading(true)
        try {
            const res = await fetch("/api/user/saved-routes", {
                method: saved ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activityId }),
            })
            if (res.ok) setSaved(!saved)
        } catch { /* silent */ }
        setLoading(false)
    }

    return (
        <button onClick={toggle} disabled={loading} title={saved ? "Eliminar de guardadas" : "Guardar ruta"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${saved
                ? "bg-atardecer/10 text-atardecer border border-atardecer/30 hover:bg-atardecer/20"
                : "bg-white text-granito border border-roca-dark/20 hover:bg-musgo/5 hover:text-musgo"}`}>
            <HeartIcon filled={saved} className="w-4 h-4" />
            {saved ? "Guardada" : "Guardar"}
        </button>
    )
}

