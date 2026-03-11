import type { IconProps } from "./types"

export function CampingIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3L3 20H21L12 3Z" />
            <path d="M10 20V15L12 13L14 15V20" />
            <path d="M19 6L20 4L21 6" />
            <circle cx="20" cy="3" r="0.5" fill={color} />
        </svg>
    )
}
