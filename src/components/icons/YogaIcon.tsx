import type { IconProps } from "./types"

export function YogaIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6V12" />
            <path d="M12 12L8 16" />
            <path d="M12 12L16 16" />
            <path d="M4 10L12 8L20 10" />
            <path d="M8 21H16" />
            <path d="M10 16V21" />
            <path d="M14 16V21" />
        </svg>
    )
}
