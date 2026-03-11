/**
 * Route Image Correlation System
 * Maps routes to representative photos by terrain type
 * Uses Unsplash free photos that match the actual terrain
 */

// Curated Unsplash photos by terrain category (landscape-oriented, high quality)
const TERRAIN_PHOTOS: Record<string, string[]> = {
    alpine: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", // mountain peaks
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", // snow mountains
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80", // alpine landscape
    ],
    forest: [
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", // forest trail
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", // sunlit forest
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80", // deep forest
    ],
    coastal: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // coastal cliff
        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80", // sea rocks
        "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&q=80", // coastal path
    ],
    river: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", // river valley
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f6?w=800&q=80", // waterfall
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", // river landscape
    ],
    meadow: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80", // green hills
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // mountain meadow
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80", // sunrise meadow
    ],
    cultural: [
        "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80", // old stone path
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", // historic bridge
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", // heritage trail
    ],
    desert: [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80", // arid landscape
        "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80", // dry mountain
        "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80", // canyon
    ],
}

// Classification keywords (Spanish + common route names)
const CLASSIFICATION_RULES: { category: string; keywords: string[] }[] = [
    { category: "alpine", keywords: ["pirineo", "pirineos", "pico", "alta montaña", "glaciar", "aneto", "monte perdido", "ordesa", "gr 11", "gr-11", "gr11", "3000", "nieve", "cresta", "cumbre", "ibón", "collado", "puerto de", "gredos", "sierra nevada", "picos de europa", "uiagm"] },
    { category: "coastal", keywords: ["costa", "litoral", "playa", "acantilado", "mar", "cala", "cabo", "faro", "camí de ronda", "senda del mar", "gr 92", "gr-92", "marisma"] },
    { category: "river", keywords: ["río", "rio", "ribera", "cascada", "garganta", "hoz", "cañón", "barranco", "congost", "desfiladero", "nacimiento", "embalse"] },
    { category: "forest", keywords: ["bosque", "hayedo", "robledal", "pinar", "selva", "fageda", "encinar", "arboleda", "fraga"] },
    { category: "cultural", keywords: ["camino de santiago", "ruta histórica", "romano", "medieval", "patrimonio", "ermita", "monasterio", "castillo", "vía verde", "calzada"] },
    { category: "desert", keywords: ["desierto", "bardenas", "monegros", "tabernas", "árido", "estepa"] },
    { category: "meadow", keywords: ["pradera", "valle", "prado", "colina", "dehesa", "meseta", "sierra", "serranía"] },
]

// High altitude = alpine, low zone = meadow/forest
function classifyByElevation(elevationGain?: number | null): string | null {
    if (!elevationGain) return null
    if (elevationGain > 1500) return "alpine"
    if (elevationGain > 800) return "meadow"
    return null
}

// GR routes tend to be mountain/alpine, PR bosque/meadow, SL family/meadow
function classifyByRouteCode(title: string): string | null {
    const upper = title.toUpperCase()
    if (upper.match(/\bGR[\s-]?\d/)) return "alpine"
    if (upper.match(/\bPR[\s-]?\d/)) return "forest"
    if (upper.match(/\bSL[\s-]?\d/)) return "meadow"
    return null
}

/**
 * Classify a route into a terrain category
 */
export function classifyRoute(route: { title: string; category?: string; elevationGain?: number | null }): string {
    const titleLower = route.title.toLowerCase()

    // 1. Keyword matching (highest priority)
    for (const rule of CLASSIFICATION_RULES) {
        if (rule.keywords.some(kw => titleLower.includes(kw))) {
            return rule.category
        }
    }

    // 2. Elevation-based
    const byElev = classifyByElevation(route.elevationGain)
    if (byElev) return byElev

    // 3. Route code (GR/PR/SL)
    const byCode = classifyByRouteCode(route.title)
    if (byCode) return byCode

    // 4. Default to meadow (generic mountain)
    return "meadow"
}

/**
 * Get a representative photo for a route
 * Returns consistent photo per route (hash-based, not random)
 */
export function getRouteImage(route: { id?: string; title: string; category?: string; elevationGain?: number | null }): string {
    const category = classifyRoute(route)
    const photos = TERRAIN_PHOTOS[category] || TERRAIN_PHOTOS.meadow
    // Deterministic: same route always gets same photo
    const hash = (route.id || route.title).split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    return photos[hash % photos.length]
}

/**
 * Get the terrain category label in Spanish
 */
export function getTerrainLabel(category: string): string {
    const labels: Record<string, string> = {
        alpine: "Alta montaña",
        forest: "Bosque",
        coastal: "Costa",
        river: "Río y agua",
        meadow: "Monte y pradera",
        cultural: "Patrimonio",
        desert: "Zona árida",
    }
    return labels[category] || "Naturaleza"
}
