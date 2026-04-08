"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CompassIcon, MapIcon, BookmarkIcon, UserIcon } from "@/components/icons"

const TABS = [
    { key: "explorar", label: "Explorar", href: "/explorar", icon: CompassIcon },
    { key: "grabar", label: "Grabar", href: "/grabar", icon: MapIcon },
    { key: "mis-rutas", label: "Mis Rutas", href: "/mis-rutas", icon: BookmarkIcon },
    { key: "perfil", label: "Perfil", href: "/perfil", icon: UserIcon },
]

export function MobileTabBar({ active }: { active?: string }) {
    const pathname = usePathname()
    const current = active || TABS.find(t => pathname?.startsWith(t.href))?.key || ""

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-roca-dark/15 px-2 z-50 safe-area-bottom">
            <div className="flex justify-around items-center h-14">
                {TABS.map(tab => {
                    const isActive = current === tab.key
                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                                isActive
                                    ? "text-musgo scale-105"
                                    : "text-granito/60 active:scale-95"
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 mb-0.5 transition-all ${isActive ? "text-musgo" : ""}`} />
                            <span className={`text-[10px] font-medium leading-tight ${isActive ? "text-musgo" : ""}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-1 w-5 h-0.5 bg-musgo rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
