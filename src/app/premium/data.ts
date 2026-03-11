import { Plan, ComparisonRow } from "./types"

export const plans: Plan[] = [
    {
        id: "free", name: "Gratuito", price: 0, interval: "siempre",
        cta: "Comenzar gratis",
        features: [
            { name: "Ver rutas oficiales (GR/PR/SL)", included: true },
            { name: "Búsqueda por zona", included: true },
            { name: "Mapa online", included: true },
            { name: "Info básica (km, desnivel)", included: true },
            { name: "Mapas offline", included: false },
            { name: "Alertas de desvío", included: false },
        ],
    },
    {
        id: "explorer", name: "Explorer", price: 9.99, interval: "año",
        cta: "Suscribirse – 9,99€/año", popular: true, apiPlan: "EXPLORER",
        features: [
            { name: "Todo lo del plan Gratuito", included: true },
            { name: "Mapas offline completos", included: true, description: "Descarga zonas para navegar sin conexión" },
            { name: "Alertas de desvío", included: true, description: "Aviso si te sales del sendero" },
            { name: "Live tracking", included: true, description: "Comparte ubicación en tiempo real" },
            { name: "Exportar a GPS/reloj", included: true, description: "Garmin, Apple Watch, Suunto" },
            { name: "Waypoints personalizados", included: true },
        ],
    },
    {
        id: "peak", name: "Peak", price: 19.99, interval: "año",
        cta: "Suscribirse – 19,99€/año", apiPlan: "PEAK",
        features: [
            { name: "Todo lo de Explorer", included: true },
            { name: "Condiciones del sendero", included: true, description: "Meteo en tiempo real por tramo" },
            { name: "Pronóstico de tráfico", included: true, description: "Evita aglomeraciones" },
            { name: "Identificador de cimas (RA)", included: true, description: "Apunta y reconoce picos" },
            { name: "Identificador de flora (IA)", included: true, description: "Fotografía y reconoce plantas" },
            { name: "Rutas con IA", included: true, description: "Genera rutas a medida" },
            { name: "Vista previa 3D", included: true },
        ],
    },
]

export const comparisonRows: ComparisonRow[] = [
    { name: "Ver rutas", free: true, explorer: true, peak: true },
    { name: "Rutas guardadas", free: "5", explorer: "∞", peak: "∞" },
    { name: "Mapa online", free: true, explorer: true, peak: true },
    { name: "Mapas offline", free: false, explorer: true, peak: true },
    { name: "Alertas de desvío", free: false, explorer: true, peak: true },
    { name: "Live tracking", free: false, explorer: true, peak: true },
    { name: "Exportar GPS/reloj", free: false, explorer: true, peak: true },
    { name: "Waypoints propios", free: false, explorer: true, peak: true },
    { name: "Condiciones sendero", free: false, explorer: false, peak: true },
    { name: "Pronóstico tráfico", free: false, explorer: false, peak: true },
    { name: "Identificador cimas", free: false, explorer: false, peak: true },
    { name: "Identificador flora", free: false, explorer: false, peak: true },
    { name: "Rutas con IA", free: false, explorer: false, peak: true },
    { name: "Vista 3D", free: false, explorer: false, peak: true },
]
