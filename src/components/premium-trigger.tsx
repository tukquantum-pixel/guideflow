"use client"

import Link from "next/link"
import { StarIcon, MountainIcon, CheckIcon, DistanceIcon } from "@/components/icons"

type TriggerType = "limit_warning" | "save_limit" | "offline_upsell" | "stats_teaser"

interface Props {
    type: TriggerType
    currentCount?: number
    maxCount?: number
}

const TRIGGERS: Record<TriggerType, { title: string; description: string; cta: string }> = {
    limit_warning: { title: "Te quedan pocas rutas", description: "Actualiza a Explorer para guardar sin límites", cta: "Ver planes" },
    save_limit: { title: "Has alcanzado el límite", description: "Con Premium puedes guardar todas las rutas que quieras", cta: "Actualizar ahora" },
    offline_upsell: { title: "Mapas offline disponibles", description: "Descarga esta ruta para navegarla sin conexión con Explorer", cta: "Activar offline" },
    stats_teaser: { title: "Has mejorado este mes", description: "Desbloquea estadísticas avanzadas y sigue tu progreso", cta: "Ver mis stats" },
}

export function PremiumTrigger({ type, currentCount, maxCount }: Props) {
    const t = TRIGGERS[type]
    const isLimitType = type === "limit_warning" || type === "save_limit"

    return (
        <div className="bg-gradient-to-r from-musgo/5 via-lago/5 to-atardecer/5 border border-musgo/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-musgo/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {isLimitType ? <MountainIcon className="w-4 h-4 text-musgo" /> : <DistanceIcon className="w-4 h-4 text-musgo" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-pizarra text-sm">{t.title}</p>
                    {currentCount !== undefined && maxCount !== undefined && (
                        <div className="flex items-center gap-2 my-1.5">
                            <div className="flex-1 h-1.5 bg-roca/20 rounded-full overflow-hidden">
                                <div className="h-full bg-atardecer rounded-full" style={{ width: `${Math.min((currentCount / maxCount) * 100, 100)}%` }} />
                            </div>
                            <span className="text-[10px] text-granito font-medium">{currentCount}/{maxCount}</span>
                        </div>
                    )}
                    <p className="text-xs text-granito">{t.description}</p>
                    <Link href="/premium" className="inline-flex items-center gap-1.5 mt-2 text-xs bg-musgo text-white px-3 py-1.5 rounded-lg hover:bg-musgo-dark transition font-medium shadow-sm">
                        <StarIcon className="w-3 h-3" /> {t.cta}
                    </Link>
                </div>
            </div>
        </div>
    )
}
