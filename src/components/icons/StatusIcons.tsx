import type { IconProps } from "./types"

export function CheckIcon({ className = "w-6 h-6", color = "#5B8C5A" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M8 12L11 15L16 9" />
        </svg>
    )
}

export function WarningIcon({ className = "w-6 h-6", color = "#E67E4A" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 22H22L12 2Z" />
            <path d="M12 9V14" />
            <circle cx="12" cy="17.5" r="0.5" fill={color} />
        </svg>
    )
}

export function InfoIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 11V16" />
            <circle cx="12" cy="8" r="0.5" fill={color} />
        </svg>
    )
}
