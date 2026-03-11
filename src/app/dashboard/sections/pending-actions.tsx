"use client"

import { useState } from "react"

interface PendingAction {
    id: string; severity: "high" | "medium" | "low"
    title: string; description: string; buttonText: string
    onClick?: () => void; href?: string
}

function buildActions(stripeStatus: string, activityCount: number, hasAvatar: boolean): PendingAction[] {
    const actions: PendingAction[] = []
    if (stripeStatus === "NOT_CONNECTED")
        actions.push({ id: "stripe", severity: "high", title: "⚡ Conecta Stripe para cobrar", description: "Tus clientes NO pueden pagarte hasta que conectes tu cuenta", buttonText: "Conectar ahora" })
    if (activityCount === 0)
        actions.push({ id: "activity", severity: "medium", title: "🧗 Crea tu primera actividad", description: "Los guías con actividades reciben 3x más reservas", buttonText: "Crear actividad", href: "/dashboard/activities" })
    if (!hasAvatar)
        actions.push({ id: "avatar", severity: "low", title: "📸 Añade una foto de perfil", description: "Los perfiles con foto generan un 40% más de confianza", buttonText: "Subir foto", href: "/dashboard/profile" })
    return actions
}

const SEV_COLORS = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-lago" }

export function PendingActions({ stripeStatus, activityCount, hasAvatar, onConnectStripe }: {
    stripeStatus: string; activityCount: number; hasAvatar: boolean; onConnectStripe: () => void
}) {
    const actions = buildActions(stripeStatus, activityCount, hasAvatar)
    if (actions.length === 0) return null

    return (
        <div className="bg-white border border-atardecer/20 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-pizarra uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-atardecer rounded-full animate-pulse" /> Acciones pendientes ({actions.length})
            </h3>
            <div className="space-y-3">
                {actions.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-niebla rounded-xl">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${SEV_COLORS[a.severity]}`} />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-pizarra">{a.title}</p>
                                <p className="text-xs text-granito truncate">{a.description}</p>
                            </div>
                        </div>
                        {a.id === "stripe" ? (
                            <button onClick={onConnectStripe} className="text-xs bg-atardecer hover:bg-atardecer-dark text-white px-4 py-2 rounded-lg font-medium transition whitespace-nowrap shadow-sm">{a.buttonText}</button>
                        ) : (
                            <a href={a.href} className="text-xs bg-musgo/10 text-musgo hover:bg-musgo/20 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap">{a.buttonText}</a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
