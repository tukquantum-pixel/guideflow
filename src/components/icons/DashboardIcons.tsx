import type { IconProps } from "./types"

export function CalendarIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2V6" />
            <path d="M8 2V6" />
            <path d="M3 10H21" />
        </svg>
    )
}

export function ChartIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20V10" />
            <path d="M9 20V4" />
            <path d="M14 20V14" />
            <path d="M19 20V8" />
        </svg>
    )
}

export function MoneyIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2V22" />
            <path d="M17 5H9.5C8.12 5 7 6.12 7 7.5C7 8.88 8.12 10 9.5 10H14.5C15.88 10 17 11.12 17 12.5C17 13.88 15.88 15 14.5 15H7" />
            <path d="M8 19H16" />
        </svg>
    )
}

export function PhoneIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92V19.92C22 20.48 21.56 20.97 21 21C15.94 20.63 11.16 18.67 7.28 15.62L8.24 14.48C11.56 17.16 15.63 18.91 20 19.22V17.08L16.62 16.02L15.14 17.86C12.42 16.62 10.16 14.36 8.92 11.64L10.76 10.16L9.7 6.78H7.56C7.14 11.42 9.4 16 13 19" />
        </svg>
    )
}

export function ClipboardIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4H18C18.55 4 19 4.45 19 5V21C19 21.55 18.55 22 18 22H6C5.45 22 5 21.55 5 21V5C5 4.45 5.45 4 6 4H8" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M9 12H15" />
            <path d="M9 16H13" />
        </svg>
    )
}

export function BootIcon({ className = "w-6 h-6", color = "currentColor" }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20H20" />
            <path d="M4 20V15L7 12V6L10 4L12 6V12L14 14H18L20 17V20" />
        </svg>
    )
}
