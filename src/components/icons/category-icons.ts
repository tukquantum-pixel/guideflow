import { MountainIcon } from "./MountainIcon"
import { HikingIcon } from "./HikingIcon"
import { ClimbingIcon } from "./ClimbingIcon"
import { BikingIcon } from "./BikingIcon"
import { KayakIcon } from "./KayakIcon"
import { SkiIcon } from "./SkiIcon"
import { CampingIcon } from "./CampingIcon"
import { PhotoIcon } from "./PhotoIcon"
import { YogaIcon } from "./YogaIcon"
import { BirdIcon } from "./BirdIcon"
import type { IconProps } from "./types"

type IconComponent = React.FC<IconProps>

const CATEGORY_ICONS: Record<string, IconComponent> = {
    hiking: HikingIcon,
    climbing: ClimbingIcon,
    biking: BikingIcon,
    kayak: KayakIcon,
    ski: SkiIcon,
    camping: CampingIcon,
    photography: PhotoIcon,
    yoga: YogaIcon,
    birdwatching: BirdIcon,
}

export function getCategoryIcon(category: string): IconComponent {
    return CATEGORY_ICONS[category.toLowerCase()] || MountainIcon
}
