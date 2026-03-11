"use client"

export function QuickActions() {
    const actions = [
        { icon: "➕", label: "Nueva actividad", href: "/dashboard/activities" },
        { icon: "📅", label: "Ver reservas", href: "/dashboard/bookings" },
        { icon: "👤", label: "Mi perfil", href: "/dashboard/profile" },
        { icon: "🗺️", label: "Mis rutas", href: "/mis-rutas" },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map(a => (
                <a key={a.href} href={a.href} className="bg-white border border-roca-dark/20 rounded-xl p-4 text-center hover:shadow-md transition group">
                    <p className="text-2xl mb-1 group-hover:scale-110 transition-transform">{a.icon}</p>
                    <p className="text-sm font-medium text-pizarra">{a.label}</p>
                </a>
            ))}
        </div>
    )
}
