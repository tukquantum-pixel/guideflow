import type { IconProps } from "./types"

export function BirdIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="17" cy="7" r="2" />
            <path d="M2 12C2 12 6 8 12 8C15 8 17 9 17 9" />
            <path d="M2 12L6 18H14L17 9" />
            <path d="M14 18L18 14" />
            <path d="M19 7L22 6" />
        </svg>
    )
}
