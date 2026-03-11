"use client"

import type { UserAchievement } from "@/lib/achievements"
import { DistanceIcon, ElevationIcon, MountainIcon, StarIcon, BookmarkIcon, type IconProps } from "@/components/icons"

const CATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
    distance: DistanceIcon,
    elevation: ElevationIcon,
    starter: StarIcon,
    frequency: BookmarkIcon,
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
    distance: { bg: "bg-musgo/10", text: "text-musgo", bar: "bg-musgo" },
    elevation: { bg: "bg-atardecer/10", text: "text-atardecer", bar: "bg-atardecer" },
    starter: { bg: "bg-lago/10", text: "text-lago", bar: "bg-lago" },
    frequency: { bg: "bg-pizarra/10", text: "text-pizarra", bar: "bg-pizarra" },
}

export function AchievementsSection({ achievements }: { achievements: UserAchievement[] }) {
    const unlocked = achievements.filter(a => a.unlocked)
    const inProgress = achievements.filter(a => !a.unlocked && a.progress > 0)
    const locked = achievements.filter(a => !a.unlocked && a.progress === 0)

    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-pizarra flex items-center gap-2">
                    <MountainIcon className="w-5 h-5" /> Logros
                </h2>
                <span className="text-xs text-granito">{unlocked.length}/{achievements.length} desbloqueados</span>
            </div>

            <div className="space-y-2.5">
                {/* Unlocked */}
                {unlocked.map(a => <AchievementRow key={a.achievement.id} item={a} />)}

                {/* In progress */}
                {inProgress.map(a => <AchievementRow key={a.achievement.id} item={a} />)}

                {/* Locked (show first 3 only) */}
                {locked.slice(0, 3).map(a => <AchievementRow key={a.achievement.id} item={a} />)}

                {locked.length > 3 && (
                    <p className="text-xs text-granito text-center pt-1">+{locked.length - 3} logros más por desbloquear</p>
                )}
            </div>
        </div>
    )
}

function AchievementRow({ item }: { item: UserAchievement }) {
    const { achievement: a, unlocked, progress, currentValue } = item
    const colors = CATEGORY_COLORS[a.category] || CATEGORY_COLORS.starter
    const Icon = CATEGORY_ICONS[a.category] || StarIcon

    return (
        <div className={`flex items-center gap-3 p-2.5 rounded-lg ${unlocked ? colors.bg : "bg-niebla"} ${!unlocked && progress === 0 ? "opacity-40" : ""}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${unlocked ? `${colors.bg} ring-2 ring-current ${colors.text}` : "bg-roca/30 text-granito"}`}>
                <Icon className={`w-4 h-4 ${unlocked ? colors.text : "text-granito"}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${unlocked ? "text-pizarra" : "text-granito"}`}>{a.name}</span>
                    {unlocked && <span className="text-[10px] bg-musgo/20 text-musgo px-1.5 py-0.5 rounded-full font-medium">Logrado</span>}
                </div>
                <p className="text-xs text-granito">{a.description}</p>
                {!unlocked && progress > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-roca/20 rounded-full overflow-hidden">
                            <div className={`h-full ${colors.bar} rounded-full transition-all`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] text-granito whitespace-nowrap">{progress}%</span>
                    </div>
                )}
            </div>
        </div>
    )
}
