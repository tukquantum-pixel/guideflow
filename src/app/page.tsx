import Link from "next/link"
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'
import { getRouteImage, classifyRoute, getTerrainLabel } from "@/lib/route-images"
import { unstable_cache } from "next/cache"
import { CATEGORIES } from "@/lib/professions"
import { NavBar } from "@/components/nav-bar"
import { CategoryIcon, DistanceIcon, ElevationIcon, DurationIcon, MountainIcon, CheckIcon, CompassIcon, HikingIcon, SearchIcon, MapIcon } from "@/components/icons"
import { Suspense } from "react"

export const metadata = {
  title: "PATHY — Experiencias Outdoor con Profesionales Verificados",
  description: "La plataforma que conecta guías profesionales de montaña, surf, kayak, yoga y más con amantes de la aventura. Reserva actividades con profesionales verificados.",
}

const getStats = unstable_cache(
  async () => {
    const [routes, guides] = await Promise.all([
      prisma.activity.count({ where: { active: true } }),
      prisma.guide.count(),
    ])
    return { routes, guides }
  },
  ["landing-stats"],
  { revalidate: 3600 }
)

const getFeatured = unstable_cache(
  async () => {
    return prisma.activity.findMany({
      where: { active: true },
      select: {
        id: true, title: true, photos: true, category: true, difficulty: true,
        priceCents: true, durationMinutes: true,
        track: { select: { distance: true, elevationGain: true } },
        guide: { select: { name: true, avatarUrl: true, verificationLevel: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
  },
  ["landing-featured"],
  { revalidate: 300 }
)

export default async function LandingPage() {
  const [stats, featured] = await Promise.all([getStats(), getFeatured()])

  return (
    <div className="min-h-screen bg-pizarra">
      {/* NAV */}
      <Suspense fallback={<nav className="absolute top-0 left-0 right-0 z-20 py-4"><div className="max-w-6xl mx-auto px-4 flex items-center justify-between"><span className="text-xl font-bold text-white flex items-center gap-1.5"><MountainIcon className="w-5 h-5" /> PATHY</span><div className="h-8 w-32 bg-white/10 animate-pulse rounded" /></div></nav>}>
        <NavBar variant="transparent" />
      </Suspense>

      {/* HERO */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <img src="/hero.png" alt="Aventura outdoor" className="absolute inset-0 w-full h-full object-cover hero-image" />
        <div className="absolute inset-0 bg-gradient-to-b from-pizarra/60 via-pizarra/30 to-pizarra" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <p className="text-musgo font-semibold text-sm tracking-widest uppercase mb-4 animate-fade-in">
              La plataforma outdoor #1 de España
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Vive aventuras<br />
              <span className="bg-gradient-to-r from-musgo to-lago bg-clip-text text-transparent">con profesionales</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-xl leading-relaxed">
              Descubre {stats.routes}+ actividades de {stats.guides} guías verificados. Montaña, surf, kayak, fotografía y mucho más.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/explorar"
                className="px-8 py-4 bg-musgo hover:bg-musgo-dark text-white font-semibold rounded-xl transition shadow-2xl shadow-musgo/40 text-lg flex items-center gap-2">
                <SearchIcon className="w-5 h-5" /> Explorar actividades
              </Link>
              <Link href="/register"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition text-lg flex items-center gap-2">
                <CompassIcon className="w-5 h-5" /> Soy profesional
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="flex gap-8 md:gap-16">
              <div>
                <p className="text-3xl font-bold text-white">{stats.routes}+</p>
                <p className="text-sm text-white/50">Actividades</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.guides}</p>
                <p className="text-sm text-white/50">Guías verificados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">11</p>
                <p className="text-sm text-white/50">Disciplinas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-pizarra-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Todo tipo de aventuras</h2>
          <p className="text-granito-light text-center mb-12 max-w-xl mx-auto">
            No solo montaña. PATHY conecta profesionales de 11 disciplinas outdoor diferentes
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CATEGORIES.slice(0, 6).map(c => (
              <Link key={c.key} href={`/explorar?cat=${c.key}`}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col items-center transition group">
                <CategoryIcon category={c.key} className="w-10 h-10 mb-2 text-musgo-light group-hover:text-musgo transition" />
                <span className="text-sm text-white font-medium">{c.label}</span>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
            {CATEGORIES.slice(6).map(c => (
              <Link key={c.key} href={`/explorar?cat=${c.key}`}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col items-center transition group">
                <CategoryIcon category={c.key} className="w-10 h-10 mb-2 text-musgo-light group-hover:text-musgo transition" />
                <span className="text-sm text-white font-medium">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="py-20 bg-pizarra">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white">Actividades destacadas</h2>
                <p className="text-granito-light mt-2">Las últimas experiencias publicadas por nuestros profesionales</p>
              </div>
              <Link href="/explorar" className="text-musgo hover:text-musgo-light font-medium text-sm transition hidden md:block">
                Ver todas →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(a => (
                <Link key={a.id} href={`/ruta/${a.id}`}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition group">
                  <div className="h-48 bg-pizarra-light relative overflow-hidden">
                    <img src={a.photos[0] || getRouteImage(a)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    {!a.photos[0] && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] bg-black/40 text-white/80 backdrop-blur-sm">🏞️ {getTerrainLabel(classifyRoute(a))}</span>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium bg-pizarra/80 text-white backdrop-blur-sm">
                      {a.category}
                    </span>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${a.difficulty === "LOW" ? "bg-musgo/80 text-white" : a.difficulty === "HIGH" ? "bg-atardecer/80 text-white" : "bg-lago/80 text-white"}`}>
                      {a.difficulty === "LOW" ? "Fácil" : a.difficulty === "HIGH" ? "Difícil" : "Moderado"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white group-hover:text-musgo transition">{a.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-granito-light flex-wrap">
                      {a.track?.distance && <span className="flex items-center gap-1"><DistanceIcon className="w-3.5 h-3.5" /> {(a.track.distance / 1000).toFixed(1)} km</span>}
                      {a.track?.elevationGain && <span className="flex items-center gap-1"><ElevationIcon className="w-3.5 h-3.5" /> {Math.round(a.track.elevationGain)} m</span>}
                      <span className="flex items-center gap-1"><DurationIcon className="w-3.5 h-3.5" /> {Math.round(a.durationMinutes / 60)}h</span>
                      <span className="text-musgo font-medium">{(a.priceCents / 100).toFixed(0)}€</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                      <div className="w-6 h-6 rounded-full bg-musgo/20 overflow-hidden">
                        {a.guide.avatarUrl ? <img src={a.guide.avatarUrl} className="w-full h-full object-cover" /> :
                          <span className="flex items-center justify-center h-full text-xs font-bold text-musgo">{a.guide.name[0]}</span>}
                      </div>
                      <span className="text-xs text-granito-light">{a.guide.name}</span>
                      {a.guide.verificationLevel === "VERIFIED" && <CheckIcon className="w-4 h-4" />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href="/explorar" className="text-musgo font-medium text-sm">Ver todas las actividades →</Link>
            </div>
          </div>
        </section>
      )}

      {/* PATHY FEATURES */}
      <section className="py-20 bg-pizarra">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Tu compañero de montaña</h2>
          <p className="text-granito-light text-center mb-12 max-w-xl mx-auto">
            Graba tus rutas con GPS, explora senderos oficiales y navega con mapas topográficos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-musgo/20 to-musgo/5 border border-musgo/20 rounded-2xl p-8 text-center">
              <MapIcon className="w-12 h-12 text-musgo mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Graba tu ruta</h3>
              <p className="text-granito-light text-sm mb-4">GPS en tiempo real con mapa en vivo. Ve tu track dibujarse mientras caminas.</p>
              <Link href="/grabar" className="inline-block px-6 py-2.5 bg-musgo/20 hover:bg-musgo/30 text-musgo-light font-medium rounded-xl transition text-sm">Empezar a grabar →</Link>
            </div>
            <div className="bg-gradient-to-br from-lago/20 to-lago/5 border border-lago/20 rounded-2xl p-8 text-center">
              <CompassIcon className="w-12 h-12 text-lago mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Explorador de rutas</h3>
              <p className="text-granito-light text-sm mb-4">{stats.routes}+ rutas oficiales GR/PR/SL en un mapa interactivo. Filtra por distancia.</p>
              <Link href="/buscar-ruta" className="inline-block px-6 py-2.5 bg-lago/20 hover:bg-lago/30 text-lago font-medium rounded-xl transition text-sm">Explorar rutas →</Link>
            </div>
            <div className="bg-gradient-to-br from-atardecer/20 to-atardecer/5 border border-atardecer/20 rounded-2xl p-8 text-center">
              <MountainIcon className="w-12 h-12 text-atardecer mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Mapas topográficos</h3>
              <p className="text-granito-light text-sm mb-4">Curvas de nivel, satélite y callejero. Cambia de mapa con un toque.</p>
              <span className="inline-block px-6 py-2.5 bg-atardecer/10 text-atardecer/70 font-medium rounded-xl text-sm">⛰️ Incluido gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-pizarra-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Cómo funciona</h2>
          <p className="text-granito-light text-center mb-16 max-w-lg mx-auto">En 3 pasos estás disfrutando de tu próxima aventura</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "search", title: "Explora", desc: "Busca actividades por categoría, zona o dificultad. Filtra entre +11 disciplinas." },
              { step: "02", icon: "calendar", title: "Reserva", desc: "Elige fecha y hora. Pago seguro con Stripe. Confirmación instantánea." },
              { step: "03", icon: "mountain", title: "Vive", desc: "Disfruta de tu aventura con un profesional verificado. Guarda tus rutas favoritas." },
            ].map(s => {
              const StepIcon = s.icon === "search" ? SearchIcon : s.icon === "calendar" ? CompassIcon : MountainIcon
              return (
                <div key={s.step} className="relative bg-white/5 border border-white/10 rounded-2xl p-8">
                  <span className="text-6xl font-black text-white/5 absolute top-4 right-6">{s.step}</span>
                  <StepIcon className="w-10 h-10 text-musgo-light mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-granito-light text-sm leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA — FOR PROFESSIONALS */}
      <section className="py-20 bg-gradient-to-br from-musgo/20 to-lago/10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <CompassIcon className="w-12 h-12 text-musgo-light mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">¿Eres profesional outdoor?</h2>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            Da el salto digital. Gestiona reservas, cobra con Stripe, muestra tus titulaciones verificadas y llega a miles de aventureros.
          </p>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-white/50 mb-10">
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4" /> Sin comisión fija</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4" /> Cobra al instante</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4" /> Verificación profesional</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4" /> Dashboard completo</span>
          </div>
          <Link href="/register"
            className="inline-block px-10 py-4 bg-musgo hover:bg-musgo-dark text-white font-semibold rounded-xl transition shadow-2xl shadow-musgo/30 text-lg">
            Crear cuenta de profesional →
          </Link>
        </div>
      </section>

      {/* CTA — FOR USERS */}
      <section className="py-16 bg-pizarra">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="text-granito-light text-lg mb-8">
            Graba tus rutas, explora senderos y descubre experiencias con profesionales verificados
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/grabar"
              className="px-8 py-4 bg-musgo hover:bg-musgo-dark text-white font-semibold rounded-xl transition shadow-lg shadow-musgo/30 text-lg flex items-center gap-2">
              <MapIcon className="w-5 h-5" /> Grabar mi ruta
            </Link>
            <Link href="/buscar-ruta"
              className="px-8 py-4 bg-lago hover:bg-lago-dark text-white font-semibold rounded-xl transition shadow-lg text-lg flex items-center gap-2">
              <CompassIcon className="w-5 h-5" /> Explorar rutas
            </Link>
            <Link href="/registrarse"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition text-lg flex items-center gap-2">
              <HikingIcon className="w-5 h-5" /> Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-pizarra-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white/40 text-sm">© 2026 PATHY. Todos los derechos reservados.</span>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/explorar" className="hover:text-white/70 transition">Explorar</Link>
            <Link href="/entrar" className="hover:text-white/70 transition">Entrar</Link>
            <Link href="/register" className="hover:text-white/70 transition">Para profesionales</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
