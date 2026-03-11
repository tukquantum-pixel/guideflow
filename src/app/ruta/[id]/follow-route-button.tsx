"use client"

import Link from "next/link"

interface Props { activityId: string; isPremium: boolean }

export function FollowRouteButton({ activityId, isPremium }: Props) {
    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl p-5">
            <Link href={`/seguir/${activityId}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-musgo to-musgo-dark text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-musgo/25 transition shadow-md">
                <span className="text-2xl">▶️</span>
                SEGUIR ESTA RUTA
            </Link>
            <p className="text-xs text-granito text-center mt-2">Navegación GPS en tu navegador · Funciona en móvil</p>
            {!isPremium && (
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                    {["🗺️ Offline", "⚠️ Alertas desvío", "📡 Live tracking"].map(f => (
                        <span key={f} className="text-xs bg-atardecer/10 text-atardecer px-2 py-0.5 rounded-full">🔒 {f}</span>
                    ))}
                </div>
            )}
        </div>
    )
}
