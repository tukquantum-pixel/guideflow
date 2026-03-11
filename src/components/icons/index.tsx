import React from "react"

type P = { className?: string }

export const MountainIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21L1 12l5-7 4 5 4-7 4 5 5-4-1 9z" />
        <path d="M2 21h20" />
    </svg>
)

export const CompassIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.2 7.8 14 14 7.8 16.2 10 10 16.2 7.8" fill="currentColor" opacity="0.2" stroke="currentColor" />
    </svg>
)

export const CalendarIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

export const UserIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    </svg>
)

export const GroupIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <circle cx="17" cy="7" r="3" />
        <path d="M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
)

export const ClipboardIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
)

export const PlusIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

export const EditIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3l4 4L7 21H3v-4L17 3z" />
    </svg>
)

export const TrashIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
)

export const MoneyIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
)

export const ChartIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

export const PinIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-8-4.5-8-11.2A8 8 0 0112 2a8 8 0 018 7.8c0 6.7-8 11.2-8 11.2z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
)

export const CheckIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

export const ClockIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

export const BellIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
)

export const LogoutIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

export const BootIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 21h14l1-5H8l-1 5z" />
        <path d="M8 16V7a2 2 0 012-2h1l1 3h3V5" />
        <path d="M5 21H3l1-5" />
    </svg>
)

export const StarIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

export const SearchIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

export const XIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

export const ChevronRightIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

export const PhoneIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
)

export const CopyIcon = ({ className = "w-6 h-6" }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
)

// ─── New icon re-exports (Phase 1 outdoor + metrics + category mapping) ───

export { CategoryIcon } from "./CategoryIcon"
export { getCategoryIcon } from "./category-icons"
export type { IconProps } from "./types"

// Outdoor activity icons
export { HikingIcon } from "./HikingIcon"
export { ClimbingIcon } from "./ClimbingIcon"
export { BikingIcon } from "./BikingIcon"
export { KayakIcon } from "./KayakIcon"
export { SkiIcon } from "./SkiIcon"
export { CampingIcon } from "./CampingIcon"
export { PhotoIcon } from "./PhotoIcon"
export { YogaIcon } from "./YogaIcon"
export { BirdIcon } from "./BirdIcon"
export { SurfIcon } from "./SurfIcon"

// Metric icons (for stat cards)
export { DistanceIcon, ElevationIcon, DurationIcon, LocationIcon, NavigationIcon } from "./MetricIcons"

// Bookmark icons
export { BookmarkIcon, BookmarkFilledIcon } from "./BookmarkIcon"

// Share/Download (aliased — old ShareIcon stays if it existed)
export { DownloadIcon } from "./ShareIcon"
export { WarningIcon, InfoIcon } from "./StatusIcons"
export { MapIcon } from "./MapIcon"
