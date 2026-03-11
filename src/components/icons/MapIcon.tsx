import type { IconProps } from "./types"

export function MapIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z" />
            <path d="M9 3V18" />
            <path d="M15 6V21" />
        </svg>
    )
}

export function CompassIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8L14 14L8 16L10 10L16 8Z" fill={color} fillOpacity="0.15" />
        </svg>
    )
}
