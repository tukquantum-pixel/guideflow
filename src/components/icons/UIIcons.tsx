import type { IconProps } from "./types"

export function PinIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" />
            <circle cx="12" cy="9" r="3" />
        </svg>
    )
}

export function ClockIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6V12L16 14" />
        </svg>
    )
}

export function GroupIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="7" r="3" />
            <path d="M3 21V18C3 16.34 4.34 15 6 15H12C13.66 15 15 16.34 15 18V21" />
            <path d="M17 15H18C19.66 15 21 16.34 21 18V21" />
        </svg>
    )
}

export function UserIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21V18C4 16.34 5.79 15 8 15H16C18.21 15 20 16.34 20 18V21" />
        </svg>
    )
}

export function PlusIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <path d="M12 5V19" />
            <path d="M5 12H19" />
        </svg>
    )
}

export function XIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <path d="M6 6L18 18" />
            <path d="M18 6L6 18" />
        </svg>
    )
}

export function EditIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4V20H20V13" />
            <path d="M16.5 3.5L20.5 7.5L12 16H8V12L16.5 3.5Z" />
        </svg>
    )
}

export function TrashIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6H21" />
            <path d="M8 6V4C8 3.44 8.44 3 9 3H15C15.56 3 16 3.44 16 4V6" />
            <path d="M5 6V20C5 20.56 5.44 21 6 21H18C18.56 21 19 20.56 19 20V6" />
            <path d="M10 10V17" />
            <path d="M14 10V17" />
        </svg>
    )
}

export function CopyIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="1" />
            <path d="M5 15H4C3.44 15 3 14.56 3 14V4C3 3.44 3.44 3 4 3H14C14.56 3 15 3.44 15 4V5" />
        </svg>
    )
}

export function LogoutIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5C4.44 21 4 20.56 4 20V4C4 3.44 4.44 3 5 3H9" />
            <path d="M16 17L21 12L16 7" />
            <path d="M21 12H9" />
        </svg>
    )
}
