export function CtaSection() {
    return (
        <section className="bg-gradient-to-r from-musgo to-musgo-dark text-white py-16 text-center">
            <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-3">
                    ¿Listo para tu próxima aventura?
                </h2>
                <p className="text-white/80 mb-8">
                    Por menos de 1€ al mes, ten seguridad total y mapas offline en cada ruta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/registrarse" className="px-8 py-3 bg-white text-musgo-dark font-semibold rounded-xl hover:bg-roca transition">
                        Empezar gratis
                    </a>
                    <a href="#planes" className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition">
                        Ver planes
                    </a>
                </div>
            </div>
        </section>
    )
}
