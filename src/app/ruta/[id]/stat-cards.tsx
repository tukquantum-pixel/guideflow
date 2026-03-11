import type { Track } from "./types"
import { DistanceIcon, ElevationIcon, DurationIcon, MountainIcon } from "@/components/icons"
import type { IconProps } from "@/components/icons"

interface StatItem { icon: React.FC<IconProps>; value: string; label: string; color: string }

function buildStats(track: Track | null, durationMinutes: number): StatItem[] {
    const stats: StatItem[] = []
    if (track?.distance) stats.push({ icon: DistanceIcon, value: `${(track.distance / 1000).toFixed(1)} km`, label: "Distancia", color: "text-musgo" })
    if (track?.elevationGain) stats.push({ icon: ElevationIcon, value: `${Math.round(track.elevationGain)} m`, label: "Desnivel +", color: "text-lago" })
    stats.push({ icon: DurationIcon, value: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min`, label: "Duración", color: "text-pizarra" })
    if (track?.maxElevation) stats.push({ icon: MountainIcon, value: `${Math.round(track.maxElevation)} m`, label: "Altitud máx", color: "text-atardecer" })
    if (track?.elevationLoss) stats.push({ icon: ElevationIcon, value: `${Math.round(track.elevationLoss)} m`, label: "Desnivel −", color: "text-granito" })
    return stats
}

export function StatCards({ track, durationMinutes }: { track: Track | null; durationMinutes: number }) {
    const stats = buildStats(track, durationMinutes)

    return (
        <div className={`grid gap-3 mt-6 ${stats.length <= 2 ? "grid-cols-2" : stats.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
            {stats.map(s => {
                const Icon = s.icon
                return (
                    <div key={s.label} className="bg-white border border-roca-dark/15 rounded-xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex justify-center mb-2"><Icon className={`w-8 h-8 ${s.color}`} /></div>
                        <p className={`text-xl md:text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-granito mt-1 font-medium uppercase tracking-wide">{s.label}</p>
                    </div>
                )
            })}
        </div>
    )
}
