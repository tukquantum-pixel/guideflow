import type { IconProps } from "./types"

export function SurfIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12c-2 0-3.5-1.5-5.5-1.5S12 12 10 12s-3.5-1.5-5.5-1.5S2 12 2 12" />
            <path d="M21 16c-2 0-3.5-1.5-5.5-1.5S12 16 10 16s-3.5-1.5-5.5-1.5S2 16 2 16" />
            <path d="M14 3L10 21" />
        </svg>
    )
}
