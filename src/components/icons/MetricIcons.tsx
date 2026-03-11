import type { IconProps } from "./types"

export function ElevationIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20L7 12L11 16L15 8L21 20H3Z" />
            <path d="M12 4V2" />
            <path d="M10 5L12 2L14 5" />
        </svg>
    )
}

export function DistanceIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12H21" />
            <path d="M3 8V16" />
            <path d="M21 8V16" />
            <path d="M9 12V10" />
            <path d="M15 12V10" />
        </svg>
    )
}

export function DurationIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="9" />
            <path d="M12 9V13L15 15" />
            <path d="M12 2V4" />
        </svg>
    )
}

export function LocationIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" />
            <circle cx="12" cy="9" r="3" />
        </svg>
    )
}

export function NavigationIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L19 21L12 17L5 21L12 2Z" fill={color} fillOpacity="0.1" />
        </svg>
    )
}
