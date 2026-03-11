import type { IconProps } from "./types"

export function BikingIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1.5" />
            <path d="M12 17.5L8.5 8L15 8L18.5 17.5" />
            <path d="M5.5 17.5L8.5 8" />
        </svg>
    )
}
