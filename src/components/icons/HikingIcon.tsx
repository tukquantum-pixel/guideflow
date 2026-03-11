import type { IconProps } from "./types"

export function HikingIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M7 21L10 14L12 16L14 14L17 21" />
            <path d="M10 14L9 8L12 6L15 8L14 14" />
            <path d="M5 14L9 12" />
            <path d="M19 14L15 12" />
        </svg>
    )
}
