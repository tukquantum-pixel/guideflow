"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { ChartIcon, UserIcon, BookmarkIcon, LogoutIcon } from "@/components/icons"
import { MapIcon } from "@/components/icons/MapIcon"

interface Props {
    name: string
    image?: string | null
    role: string
}

export function UserMenu({ name, image, role }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const isGuide = role === "guide"

    useEffect(() => {
        function close(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", close)
        return () => document.removeEventListener("mousedown", close)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="w-8 h-8 rounded-full bg-musgo/20 flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <span className={`text-xs font-bold ${isGuide ? "text-musgo" : "text-lago"}`}>
                            {name?.[0]?.toUpperCase() || "U"}
                        </span>
                    )}
                </div>
                <span className="text-sm font-medium hidden md:block">{name}</span>
                <span className="text-xs opacity-60">▾</span>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-pizarra-light border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-slide-down z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{name}</p>
                        <p className="text-xs text-white/40">{isGuide ? "Profesional verificado" : "Explorador"}</p>
                    </div>
                    <div className="py-1">
                        {isGuide && (
                            <Link href="/dashboard" onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition">
                                <ChartIcon className="w-4 h-4" /> Mi Panel
                            </Link>
                        )}
                        <Link href="/perfil" onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition">
                            <ChartIcon className="w-4 h-4" /> Mi Perfil
                        </Link>
                        {isGuide && (
                            <Link href="/dashboard/profile" onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition">
                                <UserIcon className="w-4 h-4" /> Mi Perfil Público
                            </Link>
                        )}
                        <Link href="/mis-rutas" onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition">
                            <BookmarkIcon className="w-4 h-4" /> Rutas Guardadas
                        </Link>
                        <Link href="/grabar" onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-musgo-light hover:bg-white/5 transition font-medium">
                            <MapIcon className="w-4 h-4" /> Grabar Ruta
                        </Link>
                        <Link href="/buscar-ruta" onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-lago hover:bg-white/5 transition font-medium">
                            <MapIcon className="w-4 h-4" /> Explorar Rutas
                        </Link>
                        <Link href="/cuenta" onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg> Configuración
                        </Link>
                    </div>
                    <div className="border-t border-white/10 py-1">
                        <button onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-atardecer hover:bg-white/5 transition text-left">
                            <LogoutIcon className="w-4 h-4" /> Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
