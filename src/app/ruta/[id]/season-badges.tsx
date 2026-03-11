export function SeasonBadges({ seasons }: { seasons: string[] }) {
    if (!seasons.length) return null
    const icons: Record<string, string> = { primavera: "🌸", verano: "☀️", otoño: "🍂", invierno: "❄️" }
    return (
        <div className="flex gap-2 flex-wrap mt-3">
            <span className="text-xs text-granito">Mejor época:</span>
            {seasons.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-musgo/10 text-musgo">{icons[s.toLowerCase()] || "📅"} {s}</span>
            ))}
        </div>
    )
}
