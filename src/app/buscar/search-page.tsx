"use client"

import { useState, useEffect, useCallback } from "react"
import { MountainIcon, PinIcon, ClockIcon } from "@/components/icons"

interface Activity {
    id: string; title: string; priceCents: number; durationMinutes: number
    category: string; difficulty: string; photos: string[]
}

interface GuideResult {
    slug: string; name: string; avatarUrl: string | null; zone: string | null
    bio: string | null; certifications: string | null; yearsExperience: number | null
    languages: string[]; activities: Activity[]; avgRating: number | null; reviewCount: number
}

const CAT_OPTIONS = [
    { v: "", l: "Todas" }, { v: "hiking", l: "🥾 Senderismo" }, { v: "climbing", l: "🧗 Escalada" },
    { v: "biking", l: "🚵 Bicicleta" }, { v: "kayak", l: "🏊 Acuáticas" }, { v: "ski", l: "🎿 Esquí" },
    { v: "camping", l: "🏕️ Camping" }, { v: "other", l: "🧭 Otras" },
]

const DIFF_OPTIONS = [
    { v: "", l: "Cualquier nivel" }, { v: "LOW", l: "Fácil" }, { v: "MEDIUM", l: "Media" }, { v: "HIGH", l: "Difícil" },
]

const CAT_ICONS: Record<string, string> = {
    hiking: "🥾", climbing: "🧗", biking: "🚵", kayak: "🏊", ski: "🎿", camping: "🏕️", other: "🧭",
}

function stars(rating: number) {
    return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))
}

export function SearchPage() {
    const [query, setQuery] = useState("")
    const [category, setCategory] = useState("")
    const [difficulty, setDifficulty] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [results, setResults] = useState<GuideResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const search = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (category) params.set("category", category)
        if (difficulty) params.set("difficulty", difficulty)
        if (maxPrice) params.set("maxPrice", maxPrice)
        try {
            const res = await fetch(`/api/marketplace/search?${params}`)
            const data = await res.json()
            if (Array.isArray(data)) setResults(data)
        } catch { /* ignore */ }
        setLoading(false)
        setSearched(true)
    }, [query, category, difficulty, maxPrice])

    // Auto-search on mount to show all guides
    useEffect(() => { search() }, [])

    return (
        <div className="min-h-screen bg-niebla">
            {/* Hero */}
            <div className="bg-pizarra text-white px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">🗺️ Encuentra tu guía de aventura</h1>
                    <p className="text-white/60 mb-8 text-lg">Guías profesionales verificados para tu próxima experiencia</p>

                    {/* Search bar */}
                    <div className="flex gap-2 max-w-xl mx-auto">
                        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && search()}
                            placeholder="Zona, actividad o nombre... (Ej: Pirineos, escalada)"
                            className="flex-1 px-5 py-3 rounded-xl text-pizarra bg-white border-0 focus:ring-2 focus:ring-musgo focus:outline-none text-base placeholder-granito/50" />
                        <button onClick={search} disabled={loading}
                            className="px-6 py-3 bg-musgo hover:bg-musgo-dark text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-musgo/25 whitespace-nowrap">
                            {loading ? "..." : "🔍 Buscar"}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    <span className="text-sm font-medium text-granito">Filtros:</span>
                    <select value={category} onChange={e => { setCategory(e.target.value); setTimeout(search, 50) }}
                        className="px-3 py-1.5 bg-white border border-roca-dark/20 rounded-lg text-sm text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none">
                        {CAT_OPTIONS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
                    </select>
                    <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setTimeout(search, 50) }}
                        className="px-3 py-1.5 bg-white border border-roca-dark/20 rounded-lg text-sm text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none">
                        {DIFF_OPTIONS.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
                    </select>
                    <select value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setTimeout(search, 50) }}
                        className="px-3 py-1.5 bg-white border border-roca-dark/20 rounded-lg text-sm text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none">
                        <option value="">Cualquier precio</option>
                        <option value="25">Hasta 25€</option>
                        <option value="50">Hasta 50€</option>
                        <option value="100">Hasta 100€</option>
                        <option value="200">Hasta 200€</option>
                    </select>
                    {(category || difficulty || maxPrice) && (
                        <button onClick={() => { setCategory(""); setDifficulty(""); setMaxPrice(""); setTimeout(search, 50) }}
                            className="text-xs text-atardecer hover:text-atardecer-dark font-medium">✕ Limpiar filtros</button>
                    )}
                </div>

                {/* Results count */}
                {searched && (
                    <p className="text-sm text-granito mb-4">
                        {results.length} guía{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
                        {query && <span> para &quot;{query}&quot;</span>}
                    </p>
                )}

                {/* Results */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}
                    </div>
                ) : results.length === 0 && searched ? (
                    <div className="bg-white border border-dashed border-roca-dark/30 rounded-2xl p-12 text-center">
                        <MountainIcon className="w-12 h-12 text-musgo/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-pizarra mb-2">Sin resultados</h3>
                        <p className="text-granito">Prueba con otra zona o ajusta los filtros.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {results.map(guide => (
                            <a key={guide.slug} href={`/${guide.slug}`}
                                className="block bg-white border border-roca-dark/20 rounded-2xl overflow-hidden hover:shadow-lg transition group">
                                <div className="p-6">
                                    {/* Guide header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-musgo/10 border border-musgo/20 flex items-center justify-center shrink-0 overflow-hidden">
                                            {guide.avatarUrl ? (
                                                <img src={guide.avatarUrl} alt={guide.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-bold text-musgo">{guide.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2 className="text-lg font-bold text-pizarra group-hover:text-musgo transition">{guide.name}</h2>
                                                {guide.avgRating && (
                                                    <span className="text-sm text-atardecer font-medium">{stars(guide.avgRating)} <span className="text-xs text-granito">({guide.reviewCount})</span></span>
                                                )}
                                            </div>
                                            {guide.zone && (
                                                <p className="text-sm text-granito flex items-center gap-1"><PinIcon className="w-3.5 h-3.5 text-musgo" /> {guide.zone}</p>
                                            )}
                                            {guide.bio && <p className="text-sm text-granito mt-1 line-clamp-2">{guide.bio}</p>}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {guide.yearsExperience && <span className="text-xs bg-musgo/10 text-musgo px-2 py-0.5 rounded-full">📅 {guide.yearsExperience} años</span>}
                                                {guide.languages.length > 0 && <span className="text-xs bg-lago/10 text-lago px-2 py-0.5 rounded-full">🌐 {guide.languages.join(", ")}</span>}
                                                {guide.certifications && <span className="text-xs bg-roca text-granito px-2 py-0.5 rounded-full">🎓 Certificado</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Activities preview */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {guide.activities.map(a => (
                                            <div key={a.id} className="bg-niebla rounded-xl p-3 flex items-center gap-3">
                                                {a.photos.length > 0 ? (
                                                    <img src={a.photos[0]} alt={a.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                                ) : (
                                                    <span className="text-2xl shrink-0">{CAT_ICONS[a.category] || "🧭"}</span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-pizarra truncate">{a.title}</p>
                                                    <div className="flex gap-2 text-xs text-granito">
                                                        <span className="font-semibold text-musgo">{(a.priceCents / 100).toFixed(0)}€</span>
                                                        <span className="flex items-center gap-0.5"><ClockIcon className="w-3 h-3" /> {a.durationMinutes}min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </main>

            <footer className="text-center py-8 text-sm text-granito">
                Powered by <span className="font-semibold text-musgo">PATHY</span>
            </footer>
        </div>
    )
}
