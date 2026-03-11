import type { IconProps } from "./types"

export function BookmarkIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3H19C19.5523 3 20 3.44772 20 4V21L12 17L4 21V4C4 3.44772 4.44772 3 5 3Z" />
        </svg>
    )
}

export function BookmarkFilledIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2">
            <path d="M5 3H19C19.5523 3 20 3.44772 20 4V21L12 17L4 21V4C4 3.44772 4.44772 3 5 3Z" />
        </svg>
    )
}
