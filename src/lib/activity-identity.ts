// Activity Identity System — single source of truth for PATHY
// Each activity gets: color, language, badges, equipment, stats, achievements

export interface ActivityIdentity {
    key: string
    name: string
    icon: string          // component name in icons/
    color: string         // hex primary color
    colorName: string     // human-readable color name
    language: { route: string; plural: string; action: string }
    badges: string[]
    equipment: string[]
    statsKeys: string[]
    achievements: { id: string; name: string; desc: string; threshold: number; unit: string }[]
}

export const ACTIVITY_IDENTITIES: Record<string, ActivityIdentity> = {
    hiking: {
        key: "hiking", name: "Senderismo", icon: "HikingIcon",
        color: "#5B8C5A", colorName: "Verde musgo",
        language: { route: "Ruta", plural: "Rutas", action: "Caminar" },
        badges: ["Familiar", "Perros permitidos", "Fuentes", "Refugios", "Circular"],
        equipment: ["Botas", "Bastones", "Mochila", "Agua", "Mapa"],
        statsKeys: ["distance", "elevation", "duration"],
        achievements: [
            { id: "hike_10", name: "Andarín", desc: "10 km recorridos", threshold: 10, unit: "km" },
            { id: "hike_50", name: "Caminante", desc: "50 km recorridos", threshold: 50, unit: "km" },
            { id: "hike_100", name: "Explorador", desc: "100 km recorridos", threshold: 100, unit: "km" },
            { id: "hike_500", name: "Trotamundos", desc: "500 km recorridos", threshold: 500, unit: "km" },
        ],
    },
    climbing: {
        key: "climbing", name: "Escalada", icon: "ClimbingIcon",
        color: "#B84A3A", colorName: "Rojo terracota",
        language: { route: "Vía", plural: "Vías", action: "Escalar" },
        badges: ["Escuela", "Deportiva", "Clásica", "Multilargo", "Búlder"],
        equipment: ["Cuerda", "Arnés", "Casco", "Pies de gato", "Cintas express", "Friends"],
        statsKeys: ["grade", "pitches", "length"],
        achievements: [
            { id: "climb_v", name: "Grado V", desc: "Primera vía de grado V", threshold: 1, unit: "vías" },
            { id: "climb_6a", name: "Grado 6a", desc: "Primera vía de 6a", threshold: 1, unit: "vías" },
            { id: "climb_7a", name: "Grado 7a", desc: "Primera vía de 7a", threshold: 1, unit: "vías" },
            { id: "climb_multi", name: "Multilargos", desc: "5 vías de varios largos", threshold: 5, unit: "vías" },
        ],
    },
    surf: {
        key: "surf", name: "Surf", icon: "SurfIcon",
        color: "#3B9EBF", colorName: "Azul lago",
        language: { route: "Spot", plural: "Spots", action: "Surfear" },
        badges: ["Principiantes", "Intermedios", "Avanzados", "Bodyboard", "SUP"],
        equipment: ["Tabla", "Neopreno", "Leash", "Parafina", "Quillas"],
        statsKeys: ["waveSize", "waterTemp", "bottomType"],
        achievements: [
            { id: "surf_1", name: "Primera ola", desc: "Primera sesión de surf", threshold: 1, unit: "sesiones" },
            { id: "surf_10", name: "10 olas", desc: "10 sesiones de surf", threshold: 10, unit: "sesiones" },
            { id: "surf_tube", name: "Tubo", desc: "Primera vez dentro del tubo", threshold: 1, unit: "tubos" },
        ],
    },
    biking: {
        key: "biking", name: "BTT / Ciclismo", icon: "BikingIcon",
        color: "#E67E4A", colorName: "Naranja atardecer",
        language: { route: "Ruta", plural: "Rutas", action: "Pedalear" },
        badges: ["XC", "Enduro", "Descenso", "Gravel", "Cicloturismo"],
        equipment: ["Casco", "Guantes", "Protecciones", "Kit reparación", "Culotte"],
        statsKeys: ["distance", "elevation", "terrainType"],
        achievements: [
            { id: "bike_50", name: "50 km", desc: "50 km pedaleados", threshold: 50, unit: "km" },
            { id: "bike_elev", name: "1.000m desnivel", desc: "1.000 m acumulados", threshold: 1000, unit: "m" },
            { id: "bike_puerto", name: "Puerto de montaña", desc: "Primer puerto completado", threshold: 1, unit: "puertos" },
        ],
    },
    ski: {
        key: "ski", name: "Esquí / Nieve", icon: "SkiIcon",
        color: "#87CEEB", colorName: "Azul claro",
        language: { route: "Travesía", plural: "Travesías", action: "Esquiar" },
        badges: ["Travesía", "Raquetas", "Alta montaña", "Fuera pista"],
        equipment: ["Esquís", "Pieles", "Crampones", "Piolet", "ARVA", "Sonda", "Pala"],
        statsKeys: ["elevation", "avalancheRisk", "exposure"],
        achievements: [
            { id: "ski_trav", name: "Travesía invernal", desc: "Primera travesía", threshold: 1, unit: "travesías" },
            { id: "ski_summit", name: "Cumbre esquiada", desc: "Cumbre con descenso esquiando", threshold: 1, unit: "cumbres" },
        ],
    },
    kayak: {
        key: "kayak", name: "Kayak / Piragüismo", icon: "KayakIcon",
        color: "#2E8B57", colorName: "Verde agua",
        language: { route: "Tramo", plural: "Tramos", action: "Remar" },
        badges: ["Aguas bravas", "Mar", "Lago", "Travesía"],
        equipment: ["Kayak", "Pala", "Chaleco", "Faldón", "Casco"],
        statsKeys: ["distance", "riverClass", "flow"],
        achievements: [
            { id: "kayak_ii", name: "Clase II", desc: "Primer rápido clase II", threshold: 1, unit: "rápidos" },
            { id: "kayak_iii", name: "Clase III", desc: "Primer rápido clase III", threshold: 1, unit: "rápidos" },
            { id: "kayak_sea", name: "Travesía marítima", desc: "Primera travesía en mar", threshold: 1, unit: "travesías" },
        ],
    },
    photography: {
        key: "photography", name: "Fotografía de Naturaleza", icon: "PhotoIcon",
        color: "#9B59B6", colorName: "Púrpura",
        language: { route: "Salida", plural: "Salidas", action: "Fotografiar" },
        badges: ["Paisaje", "Fauna", "Aves", "Macro", "Nocturna"],
        equipment: ["Teleobjetivo", "Trípode", "Hide", "Disparador remoto"],
        statsKeys: ["bestHour", "targetSpecies", "approachDist"],
        achievements: [
            { id: "photo_month", name: "Foto del mes", desc: "Foto destacada del mes", threshold: 1, unit: "fotos" },
            { id: "photo_rare", name: "Especie rara", desc: "Fotografía de especie rara", threshold: 1, unit: "especies" },
        ],
    },
    yoga: {
        key: "yoga", name: "Yoga / Bienestar", icon: "YogaIcon",
        color: "#E6B8E6", colorName: "Lavanda",
        language: { route: "Sesión", plural: "Sesiones", action: "Practicar" },
        badges: ["Hatha", "Vinyasa", "Ashtanga", "Yin", "Restaurativo"],
        equipment: ["Esterilla", "Cojín", "Manta", "Bloque", "Correa"],
        statsKeys: ["duration", "level", "benefits"],
        achievements: [
            { id: "yoga_30", name: "30 días seguidos", desc: "Práctica diaria 30 días", threshold: 30, unit: "días" },
            { id: "yoga_100h", name: "100h de práctica", desc: "100 horas acumuladas", threshold: 100, unit: "horas" },
        ],
    },
    birding: {
        key: "birding", name: "Observación de Aves", icon: "BirdIcon",
        color: "#DAA520", colorName: "Mostaza",
        language: { route: "Salida", plural: "Salidas", action: "Observar" },
        badges: ["Principiante", "Experto", "Científico ciudadano"],
        equipment: ["Prismáticos", "Telescopio", "Guía de aves", "Cuaderno de campo"],
        statsKeys: ["speciesSeen", "bestSeason", "habitatType"],
        achievements: [
            { id: "bird_20", name: "20 especies", desc: "20 especies observadas", threshold: 20, unit: "especies" },
            { id: "bird_50", name: "50 especies", desc: "50 especies observadas", threshold: 50, unit: "especies" },
            { id: "bird_rare", name: "Especie rara", desc: "Observación de especie rara", threshold: 1, unit: "especies" },
        ],
    },
    camping: {
        key: "camping", name: "Camping / Acampada", icon: "CampingIcon",
        color: "#8B4513", colorName: "Marrón tierra",
        language: { route: "Zona", plural: "Zonas", action: "Acampar" },
        badges: ["Con electricidad", "Sin electricidad", "Parcela XL", "Refugio", "Vivac"],
        equipment: ["Tienda", "Saco de dormir", "Esterilla", "Hornillo", "Linterna"],
        statsKeys: ["plotSize", "maxPeople", "services"],
        achievements: [
            { id: "camp_10", name: "10 noches", desc: "10 noches de acampada", threshold: 10, unit: "noches" },
            { id: "camp_base", name: "Campamento base", desc: "Acampada por encima de 2.000m", threshold: 1, unit: "campamentos" },
            { id: "camp_stars", name: "Estrellas", desc: "Noche de observación estelar", threshold: 1, unit: "noches" },
        ],
    },
}

// --- Helper functions ---

export function getActivityIdentity(key: string): ActivityIdentity {
    return ACTIVITY_IDENTITIES[key.toLowerCase()] || ACTIVITY_IDENTITIES.hiking
}

export function getActivityColor(key: string): string {
    return getActivityIdentity(key).color
}

export function getActivityName(key: string): string {
    return getActivityIdentity(key).name
}

export function getActivityBadges(key: string): string[] {
    return getActivityIdentity(key).badges
}

export function getActivityEquipment(key: string): string[] {
    return getActivityIdentity(key).equipment
}

export function getAllActivityKeys(): string[] {
    return Object.keys(ACTIVITY_IDENTITIES)
}
