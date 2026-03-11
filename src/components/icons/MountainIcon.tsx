import type { IconProps } from "./types"

export function MountainIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21L1 21L7.5 7L11.5 14" />
            <path d="M14.5 10L23 21H8L14.5 10Z" />
            <path d="M12.5 16L14.5 13.5L16.5 16" />
        </svg>
    )
}
