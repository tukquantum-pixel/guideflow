import type { IconProps } from "./types"

export function ShareIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51L15.42 17.49" />
            <path d="M15.41 6.51L8.59 10.49" />
        </svg>
    )
}

export function DownloadIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3V15" />
            <path d="M8 11L12 15L16 11" />
            <path d="M4 19H20" />
        </svg>
    )
}
