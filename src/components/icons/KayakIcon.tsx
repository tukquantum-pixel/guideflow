import type { IconProps } from "./types"

export function KayakIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <path d="M3 16C3 16 6 13 12 13C18 13 21 16 21 16" />
            <path d="M2 19C2 19 6 17 12 17C18 17 22 19 22 19" />
            <path d="M8 8L12 7L16 8" />
            <path d="M12 7V13" />
        </svg>
    )
}
