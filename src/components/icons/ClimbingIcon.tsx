import type { IconProps } from "./types"

export function ClimbingIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="4" r="2" />
            <path d="M6 21V15L8 12L10 8L13 6" />
            <path d="M13 6L16 4" />
            <path d="M10 8L14 10L16 8" />
            <path d="M8 12L6 10" />
            <path d="M6 15L10 16L12 21" />
        </svg>
    )
}
