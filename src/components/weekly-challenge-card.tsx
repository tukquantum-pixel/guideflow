"use client"

import type { WeeklyChallenge } from "@/lib/weekly-challenge"
import { DistanceIcon, ElevationIcon, BookmarkIcon, CheckIcon, StarIcon } from "@/components/icons"
import Link from "next/link"

const CATEGORY_ICONS = { distance: DistanceIcon, elevation: ElevationIcon, routes: BookmarkIcon }
const CATEGORY_COLORS = { distance: "musgo", elevation: "atardecer", routes: "lago" }

interface Props {
    challenge: WeeklyChallenge
    current: number; progress: number; completed: boolean
    isPremium: boolean
}

export function WeeklyChallengeCard({ challenge, current, progress, completed, isPremium }: Props) {
    const Icon = CATEGORY_ICONS[challenge.category] || DistanceIcon
    const color = CATEGORY_COLORS[challenge.category] || "musgo"

    return (
        <div className={`border rounded-xl p-5 ${completed ? `bg-${color}/10 border-${color}/30` : "bg-white border-roca-dark/15"}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${color}/15 flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 text-${color}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-pizarra text-sm">{challenge.title}</h3>
                        <p className="text-xs text-granito">{challenge.description}</p>
                    </div>
                </div>
                {completed && (
                    <span className="flex items-center gap-1 text-xs bg-musgo/15 text-musgo px-2 py-1 rounded-full font-medium">
                        <CheckIcon className="w-3 h-3" /> Completado
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-granito">{current} / {challenge.targetValue} {challenge.unit}</span>
                    <span className="font-medium text-pizarra">{progress}%</span>
                </div>
                <div className="h-2 bg-roca/20 rounded-full overflow-hidden">
                    <div className={`h-full bg-${color} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                </div>
            </div>

            {!isPremium && (
                <div className="mt-3 pt-3 border-t border-roca-dark/10">
                    <Link href="/premium" className="flex items-center gap-1.5 text-xs text-musgo hover:text-musgo-dark font-medium">
                        <StarIcon className="w-3.5 h-3.5" /> Desbloquea retos exclusivos con Premium
                    </Link>
                </div>
            )}
        </div>
    )
}
