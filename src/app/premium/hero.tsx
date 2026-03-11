export function PremiumHero() {
    return (
        <section className="relative bg-gradient-to-b from-pizarra via-pizarra-dark to-pizarra-light text-white py-24 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative max-w-3xl mx-auto px-4">
                <span className="inline-block px-4 py-1.5 bg-musgo/20 text-musgo-light rounded-full text-sm font-medium mb-6 animate-fade-in">
                    ⛰️ Premium
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
                    Tu compañero de montaña
                </h1>
                <p className="text-lg text-white/70 max-w-xl mx-auto animate-slide-up">
                    Mapas offline, alertas de seguridad y datos en tiempo real. Menos de 1€ al mes.
                </p>
            </div>
        </section>
    )
}
