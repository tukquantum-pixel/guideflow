import type { IconProps } from "./types"
import { MountainIcon } from "./MountainIcon"
import { KayakIcon } from "./KayakIcon"
import { SkiIcon } from "./SkiIcon"
import { BikingIcon } from "./BikingIcon"
import { PhotoIcon } from "./PhotoIcon"
import { BirdIcon } from "./BirdIcon"
import { YogaIcon } from "./YogaIcon"
import { CampingIcon } from "./CampingIcon"
import { HikingIcon } from "./HikingIcon"
import { ClimbingIcon } from "./ClimbingIcon"
import { SurfIcon } from "./SurfIcon"

const ICON_MAP: Record<string, React.FC<IconProps>> = {
    montana: MountainIcon,
    agua: KayakIcon,
    aire: ParachuteIcon,
    nieve: SkiIcon,
    bici: BikingIcon,
    ecuestre: HorseIcon,
    fotografia: PhotoIcon,
    observacion: BirdIcon,
    wellness: YogaIcon,
    pesca: FishingIcon,
    cultural: CulturalIcon,
    hiking: HikingIcon,
    climbing: ClimbingIcon,
    biking: BikingIcon,
    kayak: KayakIcon,
    ski: SkiIcon,
    camping: CampingIcon,
    surf: SurfIcon,
    photography: PhotoIcon,
    yoga: YogaIcon,
    birding: BirdIcon,
}

export function CategoryIcon({ category, className = "w-8 h-8", color = "currentColor" }: { category: string } & IconProps) {
    const Icon = ICON_MAP[category.toLowerCase()] || MountainIcon
    return <Icon className={className} color={color} />
}

// Extra icons not yet created as standalone files
function ParachuteIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" />
            <path d="M4 12L12 20L20 12" />
            <path d="M12 4V20" />
            <path d="M8 8L12 20L16 8" />
        </svg>
    )
}

function HorseIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 3L20 5L18 7" />
            <path d="M14 3L20 5L18 10L14 12L10 11L8 14L6 21" />
            <path d="M14 12L16 21" />
            <path d="M10 11L8 8L6 7" />
            <circle cx="17" cy="6" r="1" fill={color} />
        </svg>
    )
}

function FishingIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2L20 4L18 6" />
            <path d="M20 4L12 12" />
            <path d="M12 12V18C12 19.66 10.66 21 9 21C7.34 21 6 19.66 6 18C6 16.34 7.34 15 9 15H12" />
            <circle cx="9" cy="18" r="1" fill={color} />
        </svg>
    )
}

function CulturalIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21H21" />
            <path d="M5 21V7L12 3L19 7V21" />
            <path d="M9 21V15H15V21" />
            <path d="M9 11H15" />
            <path d="M12 7V11" />
        </svg>
    )
}
