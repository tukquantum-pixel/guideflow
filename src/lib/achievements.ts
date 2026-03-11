export interface Achievement {
    id: string
    name: string
    description: string
    category: "distance" | "elevation" | "frequency" | "starter"
    threshold: number
    unit: string
    icon: string // icon key for the component
}

export const ACHIEVEMENTS: Achievement[] = [
    // Starter
    { id: "first_route", name: "Primera ruta", description: "Guarda tu primera ruta", category: "starter", threshold: 1, unit: "rutas", icon: "flag" },

    // Distance
    { id: "walker_10", name: "Andarín", description: "10 km recorridos", category: "distance", threshold: 10, unit: "km", icon: "distance" },
    { id: "explorer_50", name: "Explorador", description: "50 km recorridos", category: "distance", threshold: 50, unit: "km", icon: "distance" },
    { id: "trekker_100", name: "Trekker", description: "100 km recorridos", category: "distance", threshold: 100, unit: "km", icon: "distance" },
    { id: "legend_500", name: "Leyenda", description: "500 km recorridos", category: "distance", threshold: 500, unit: "km", icon: "distance" },

    // Elevation
    { id: "hill_500", name: "Colina", description: "500 m de desnivel acumulado", category: "elevation", threshold: 500, unit: "m", icon: "elevation" },
    { id: "mountain_5k", name: "Montaña", description: "5.000 m de desnivel", category: "elevation", threshold: 5000, unit: "m", icon: "elevation" },
    { id: "alpinist_50k", name: "Alpinista", description: "50.000 m de desnivel", category: "elevation", threshold: 50000, unit: "m", icon: "elevation" },

    // Frequency
    { id: "regular_5", name: "Habitual", description: "5 rutas guardadas", category: "frequency", threshold: 5, unit: "rutas", icon: "frequency" },
    { id: "addict_10", name: "Adicto", description: "10 rutas guardadas", category: "frequency", threshold: 10, unit: "rutas", icon: "frequency" },
    { id: "veteran_25", name: "Veterano", description: "25 rutas guardadas", category: "frequency", threshold: 25, unit: "rutas", icon: "frequency" },
]

export interface UserAchievement {
    achievement: Achievement
    unlocked: boolean
    progress: number // 0-100
    currentValue: number
}

export function computeAchievements(stats: { totalKm: number; totalElevation: number; totalRoutes: number }): UserAchievement[] {
    return ACHIEVEMENTS.map(a => {
        let currentValue = 0
        if (a.category === "distance") currentValue = stats.totalKm
        else if (a.category === "elevation") currentValue = stats.totalElevation
        else currentValue = stats.totalRoutes // starter + frequency

        const progress = Math.min(Math.round((currentValue / a.threshold) * 100), 100)
        return { achievement: a, unlocked: currentValue >= a.threshold, progress, currentValue }
    })
}
