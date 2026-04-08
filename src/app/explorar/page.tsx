export const dynamic = "force-dynamic"
﻿import { prisma } from "@/lib/db"
import { getRouteImage, classifyRoute, getTerrainLabel } from "@/lib/route-images"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import { CATEGORIES } from "@/lib/professions"
import { NavBar } from "@/components/nav-bar"
import { CategoryIcon, MountainIcon, DistanceIcon, ElevationIcon, DurationIcon, CheckIcon, CompassIcon } from "@/components/icons"
import { MobileTabBar } from "@/components/mobile-tab-bar"
import { Suspense } from "react"

export const metadata = { title: "Explorar Rutas | PATHY", description: "Descubre rutas de guías profesionales verificados" }
export const revalidate = 60

const getActivities = unstable_cache(
    async (q?: string, cat?: string, dif?: string) => {
        return prisma.activity.findMany({
            where: {
                active: true,
                ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
                ...(cat ? { category: cat } : {}),
                ...(dif ? { difficulty: dif as "LOW" | "MEDIUM" | "HIGH" } : {}),
            },
            select: {
                id: true, title: true, category: true, difficulty: true,
                priceCents: true, durationMinutes: true, photos: true,
                meetingLat: true, meetingLng: true,
                track: { select: { distance: true, elevationGain: true } },
                guide: { select: { name: true, slug: true, avatarUrl: true, verificationLevel: true, professionCategory: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 24,
        })
    },
    ["explore-activities"],
    { revalidate: 60 }
)

export default async function ExplorarPage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string; dif?: string }> }) {
    const params = await searchParams
    const activities = await getActivities(params.q, params.cat, params.dif)

    return (
        <div className="min-h-screen bg-niebla pb-20 md:pb-0">
            <Suspense fallback={<nav className="bg-pizarra py-4"><div className="max-w-6xl mx-auto px-4 flex items-center justify-between"><span className="text-xl font-bold text-white">⛰️ PATHY</span><div className="h-8 w-32 bg-white/10 animate-pulse rounded" /></div></nav>}>
                <NavBar variant="dark" />
            </Suspense>

            <header className="bg-pizarra text-white pb-12 pt-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-3">Descubre experiencias outdoor</h1>
                    <p className="text-musgo-light text-lg mb-6">Actividades con profesionales verificados</p>
                    <form className="flex gap-2 max-w-xl mx-auto">
                        <input name="q" defaultValue={params.q || ""} placeholder="Buscar actividad, zona, profesional..."
                            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musgo" />
                        <button className="px-6 py-3 bg-musgo hover:bg-musgo-dark rounded-lg font-medium transition">Buscar</button>
                    </form>
                    {/* Route suggester CTA */}
                    <Link href="/buscar-ruta" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-lago/20 hover:bg-lago/30 border border-lago/30 text-white rounded-full text-sm font-medium transition">
                        🗺️ Explora las 60+ rutas GR/PR/SL de España en el <span className="underline">Mapa Interactivo</span> →
                    </Link>
                    <div className="flex gap-2 justify-center mt-4 flex-wrap">
                        <Link href="/explorar"
                            className={`px-3 py-1.5 rounded-full text-sm transition ${!params.cat ? "bg-musgo text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
                            🌍 Todas
                        </Link>
                        {CATEGORIES.map(c => (
                            <Link key={c.key} href={`/explorar?cat=${c.key}`}
                                className={`px-3 py-1.5 rounded-full text-sm transition ${params.cat === c.key ? "bg-musgo text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
                                <span className="flex items-center gap-1.5"><CategoryIcon category={c.key} className="w-4 h-4" /> {c.label}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="flex gap-2 justify-center mt-3 flex-wrap">
                        {[{ key: "", label: "Todas dificultades" }, { key: "LOW", label: "🟢 Fácil" }, { key: "MEDIUM", label: "🟡 Moderado" }, { key: "HIGH", label: "🔴 Difícil" }].map(d => (
                            <Link key={d.key} href={`/explorar?${new URLSearchParams({ ...(params.cat ? { cat: params.cat } : {}), ...(params.q ? { q: params.q } : {}), ...(d.key ? { dif: d.key } : {}) }).toString()}`}
                                className={`px-3 py-1.5 rounded-full text-sm transition ${params.dif === d.key || (!params.dif && !d.key) ? "bg-lago text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
                                {d.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {activities.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="flex justify-center mb-4"><MountainIcon className="w-12 h-12 text-granito" /></div>
                        <p className="text-granito text-lg">No se encontraron rutas</p>
                        <p className="text-granito text-sm mt-2">Prueba con otra búsqueda o categoría</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map(a => (
                            <Link key={a.id} href={`/ruta/${a.id}`}
                                className="bg-white border border-roca-dark/20 rounded-xl overflow-hidden hover:shadow-lg transition group">
                                <div className="h-48 bg-roca relative overflow-hidden">
                                    <img src={a.photos[0] || getRouteImage(a)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    {!a.photos[0] && (
                                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] bg-black/40 text-white/80 backdrop-blur-sm">🏞️ {getTerrainLabel(classifyRoute(a))}</span>
                                    )}
                                    <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-pizarra/80 text-white backdrop-blur-sm">
                                        {a.category}
                                    </span>
                                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm ${a.difficulty === "LOW" ? "bg-musgo/80 text-white" : a.difficulty === "HIGH" ? "bg-atardecer/80 text-white" : "bg-lago/80 text-white"}`}>
                                        {a.difficulty === "LOW" ? "Fácil" : a.difficulty === "HIGH" ? "Difícil" : "Moderado"}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-pizarra group-hover:text-musgo transition">{a.title}</h3>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-granito flex-wrap">
                                        {a.track?.distance && <span className="flex items-center gap-1"><DistanceIcon className="w-3.5 h-3.5" /> {(a.track.distance / 1000).toFixed(1)} km</span>}
                                        {a.track?.elevationGain && <span className="flex items-center gap-1"><ElevationIcon className="w-3.5 h-3.5" /> {Math.round(a.track.elevationGain)} m</span>}
                                        <span className="flex items-center gap-1"><DurationIcon className="w-3.5 h-3.5" /> {Math.round(a.durationMinutes / 60)}h</span>
                                        <span>{(a.priceCents / 100).toFixed(0)}€</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-roca-dark/10">
                                        <div className="w-6 h-6 rounded-full bg-musgo/10 overflow-hidden">
                                            {a.guide.avatarUrl ? <img src={a.guide.avatarUrl} className="w-full h-full object-cover" /> :
                                                <span className="flex items-center justify-center h-full text-xs font-bold text-musgo">{a.guide.name[0]}</span>}
                                        </div>
                                        <span className="text-xs text-granito">{a.guide.name}</span>
                                        {a.guide.verificationLevel === "VERIFIED" && <CheckIcon className="w-4 h-4" />}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <MobileTabBar active="explorar" />
        </div>
    )
}
