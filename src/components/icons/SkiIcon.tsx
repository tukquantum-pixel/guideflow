import type { IconProps } from "./types"

export function SkiIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M9 21L11 12L12 8" />
            <path d="M15 21L13 12L12 8" />
            <path d="M7 11L12 8L17 11" />
            <path d="M4 20L20 20" />
        </svg>
    )
}
