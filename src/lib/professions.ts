export type ProfessionCategory =
    | "montana" | "agua" | "aire" | "nieve"
    | "bici" | "ecuestre" | "subterraneo"
    | "fotografia" | "pesca" | "observacion"
    | "aventura" | "wellness" | "cultural"

export interface ProfessionConfig {
    key: string
    category: ProfessionCategory
    icon: string
    label: string
    difficultyLevels: string[]
    equipment: string[]
    certifications: string[]
}

export const PROFESSIONS: Record<string, ProfessionConfig> = {
    guia_montana: {
        key: "guia_montana", category: "montana", icon: "🏔️", label: "Guía de Montaña",
        difficultyLevels: ["fácil", "media", "difícil", "muy difícil"],
        equipment: ["bastones", "crampones", "piolet", "casco", "arnés"],
        certifications: ["Técnico Deportivo", "Guía UIAGM", "Alta Montaña"],
    },
    instructor_surf: {
        key: "instructor_surf", category: "agua", icon: "🏄", label: "Instructor de Surf",
        difficultyLevels: ["principiante", "intermedio", "avanzado"],
        equipment: ["tabla", "neopreno", "leash", "escarpines"],
        certifications: ["Instructor Surf", "Socorrismo"],
    },
    guia_kayak: {
        key: "guia_kayak", category: "agua", icon: "🛶", label: "Guía de Kayak/Rafting",
        difficultyLevels: ["aguas planas", "aguas bravas I-II", "aguas bravas III+"],
        equipment: ["kayak", "pala", "chaleco", "casco"],
        certifications: ["Técnico Piragüismo", "Rescate Acuático"],
    },
    instructor_buceo: {
        key: "instructor_buceo", category: "agua", icon: "🤿", label: "Instructor de Buceo",
        difficultyLevels: ["bautismo", "open water", "avanzado"],
        equipment: ["equipo completo", "botella", "regulador"],
        certifications: ["PADI", "SSI", "CMAS"],
    },
    guia_btt: {
        key: "guia_btt", category: "bici", icon: "🚵", label: "Guía BTT/Cicloturismo",
        difficultyLevels: ["fácil", "media", "difícil", "enduro"],
        equipment: ["bicicleta", "casco", "guantes", "protecciones"],
        certifications: ["Técnico Ciclismo", "Guía BTT"],
    },
    guia_ecuestre: {
        key: "guia_ecuestre", category: "ecuestre", icon: "🐎", label: "Guía Ecuestre",
        difficultyLevels: ["principiante", "intermedio", "experto"],
        equipment: ["casco", "montura", "botas"],
        certifications: ["Guía Ecuestre", "Técnico Hípica"],
    },
    guia_nieve: {
        key: "guia_nieve", category: "nieve", icon: "⛷️", label: "Instructor Nieve",
        difficultyLevels: ["iniciación", "intermedio", "avanzado", "freeride"],
        equipment: ["esquís", "botas", "casco", "ARVA"],
        certifications: ["Técnico Deportivo Esquí", "Guía Esquí Montaña"],
    },
    piloto_parapente: {
        key: "piloto_parapente", category: "aire", icon: "🪂", label: "Piloto Parapente",
        difficultyLevels: ["biplaza", "iniciación", "piloto"],
        equipment: ["parapente", "arnés", "casco", "radio"],
        certifications: ["Piloto Biplaza", "Licencia Federativa"],
    },
    fotografo_naturaleza: {
        key: "fotografo_naturaleza", category: "fotografia", icon: "📷", label: "Fotógrafo de Naturaleza",
        difficultyLevels: ["principiante", "aficionado", "profesional"],
        equipment: ["hide", "teleobjetivo", "trípode"],
        certifications: ["Guía Fotográfico"],
    },
    guia_ornitologico: {
        key: "guia_ornitologico", category: "observacion", icon: "🔭", label: "Guía Ornitológico",
        difficultyLevels: ["fácil", "media", "técnica"],
        equipment: ["prismáticos", "telescopio", "guía campo"],
        certifications: ["Guía Ornitológico", "SEO/BirdLife"],
    },
    instructor_yoga: {
        key: "instructor_yoga", category: "wellness", icon: "🧘", label: "Instructor Yoga/Wellness",
        difficultyLevels: ["suave", "moderado", "intenso"],
        equipment: ["esterilla", "cojín", "manta"],
        certifications: ["Certificación 200h RYS", "Mindfulness"],
    },
    guia_pesca: {
        key: "guia_pesca", category: "pesca", icon: "🎣", label: "Guía de Pesca",
        difficultyLevels: ["principiante", "intermedio", "experto"],
        equipment: ["caña", "carrete", "señuelos", "vadeador"],
        certifications: ["Licencia Pesca", "Guía de Pesca"],
    },
    guia_cultural: {
        key: "guia_cultural", category: "cultural", icon: "🏛️", label: "Guía Cultural/Histórico",
        difficultyLevels: ["fácil", "media"],
        equipment: [],
        certifications: ["Guía Turístico Oficial"],
    },
}

export const CATEGORIES: { key: ProfessionCategory; icon: string; label: string }[] = [
    { key: "montana", icon: "🏔️", label: "Montaña" },
    { key: "agua", icon: "🌊", label: "Agua" },
    { key: "aire", icon: "🪂", label: "Aire" },
    { key: "nieve", icon: "⛷️", label: "Nieve" },
    { key: "bici", icon: "🚵", label: "Bicicleta" },
    { key: "ecuestre", icon: "🐎", label: "Ecuestre" },
    { key: "fotografia", icon: "📷", label: "Fotografía" },
    { key: "observacion", icon: "🔭", label: "Observación" },
    { key: "wellness", icon: "🧘", label: "Wellness" },
    { key: "pesca", icon: "🎣", label: "Pesca" },
    { key: "cultural", icon: "🏛️", label: "Cultural" },
]

export function getProfessionsByCategory(cat: ProfessionCategory): ProfessionConfig[] {
    return Object.values(PROFESSIONS).filter(p => p.category === cat)
}

export function getProfessionIcon(key: string): string {
    return PROFESSIONS[key]?.icon || "🏔️"
}
