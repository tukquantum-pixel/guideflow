import type { IconProps } from "./types"

export function PhotoIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M8.5 4H15.5L17 6H7L8.5 4Z" />
            <circle cx="12" cy="13" r="3.5" />
            <circle cx="12" cy="13" r="1.5" />
        </svg>
    )
}
