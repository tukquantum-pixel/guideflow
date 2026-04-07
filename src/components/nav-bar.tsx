import Link from "next/link"
import { auth } from "@/lib/auth"
import { UserMenu } from "./user-menu"
import { MountainIcon, ChartIcon, BookmarkIcon } from "@/components/icons"

export async function NavBar({ variant = "light" }: { variant?: "light" | "dark" | "transparent" }) {
    let session = null
    try { session = await auth() } catch { /* stale cookie — treat as logged out */ }
    const role = (session?.user as any)?.role as string | undefined
    const isGuide = role === "guide"
    const isUser = !!session?.user

    const bg = variant === "transparent" ? "" : variant === "dark" ? "bg-pizarra" : "bg-white border-b border-roca-dark/20"
    const text = variant === "light" ? "text-pizarra" : "text-white"
    const muted = variant === "light" ? "text-granito" : "text-white/70"

    return (
        <nav className={`${bg} py-4 ${variant === "transparent" ? "absolute top-0 left-0 right-0 z-20" : ""}`}>
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                <Link href="/" className={`text-xl font-bold ${text} flex items-center gap-1.5`}><MountainIcon className="w-5 h-5" /> PATHY</Link>
                <div className="flex items-center gap-4">
                    <Link href="/explorar" className={`text-sm ${muted} hover:${text} transition hidden md:block`}>Explorar</Link>
                    {isUser ? (
                        <>
                            <Link href="/buscar-ruta" className="px-4 py-2 bg-lago hover:bg-lago-dark text-white rounded-full text-sm font-medium transition hidden md:flex items-center gap-1.5">
                                🗺️ Explorar Rutas
                            </Link>
                            {isGuide && (
                                <Link href="/dashboard" className={`text-sm text-musgo font-medium hover:text-musgo-dark transition hidden md:flex items-center gap-1`}>
                                    <ChartIcon className="w-4 h-4" /> Mi Panel
                                </Link>
                            )}
                            <Link href="/mis-rutas" className={`text-sm ${muted} hover:${text} transition hidden md:flex items-center gap-1`}><BookmarkIcon className="w-4 h-4" /> Mis rutas</Link>
                            <UserMenu
                                name={session?.user?.name || "Usuario"}
                                image={session?.user?.image}
                                role={role || "user"}
                            />
                        </>
                    ) : (
                        <>
                            <Link href="/entrar" className={`text-sm ${muted} hover:${text} transition`}>Iniciar sesión</Link>
                            <Link href="/registrarse" className="px-4 py-2 bg-musgo hover:bg-musgo-dark text-white rounded-full text-sm font-medium transition">
                                Regístrate gratis
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
