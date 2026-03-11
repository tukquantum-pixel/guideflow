export interface WeeklyChallenge {
    id: string
    title: string
    description: string
    targetValue: number
    unit: string
    category: "distance" | "elevation" | "routes"
}

// Rotating challenges by week number
const CHALLENGES: WeeklyChallenge[] = [
    { id: "walk_15", title: "Reto de distancia", description: "Camina 15 km esta semana", targetValue: 15, unit: "km", category: "distance" },
    { id: "climb_500", title: "Conquista la altura", description: "Acumula 500 m de desnivel", targetValue: 500, unit: "m", category: "elevation" },
    { id: "routes_3", title: "Explorador semanal", description: "Guarda 3 rutas esta semana", targetValue: 3, unit: "rutas", category: "routes" },
    { id: "walk_25", title: "Maratón verde", description: "Camina 25 km esta semana", targetValue: 25, unit: "km", category: "distance" },
    { id: "climb_1000", title: "Cumbres", description: "Acumula 1.000 m de desnivel", targetValue: 1000, unit: "m", category: "elevation" },
    { id: "routes_5", title: "Coleccionista", description: "Guarda 5 rutas esta semana", targetValue: 5, unit: "rutas", category: "routes" },
]

export function getCurrentChallenge(): WeeklyChallenge {
    const now = new Date()
    const weekNumber = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    return CHALLENGES[weekNumber % CHALLENGES.length]
}

export function computeChallengeProgress(
    challenge: WeeklyChallenge,
    weeklyStats: { km: number; elevation: number; routes: number }
): { current: number; progress: number; completed: boolean } {
    let current = 0
    if (challenge.category === "distance") current = weeklyStats.km
    else if (challenge.category === "elevation") current = weeklyStats.elevation
    else current = weeklyStats.routes

    const progress = Math.min(Math.round((current / challenge.targetValue) * 100), 100)
    return { current: Math.round(current * 10) / 10, progress, completed: current >= challenge.targetValue }
}
