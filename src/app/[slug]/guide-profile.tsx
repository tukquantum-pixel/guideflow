"use client"

import { useState } from "react"
import { BookingForm } from "./booking-form"
import { MountainIcon, ClockIcon, GroupIcon, PinIcon, PhoneIcon, CheckIcon, CategoryIcon } from "@/components/icons"
import { getRouteImage, classifyRoute, getTerrainLabel } from "@/lib/route-images"
import dynamic from "next/dynamic"

const MapView = dynamic(() => import("@/components/map-view").then(m => m.MapView), {
    ssr: false, loading: () => <div className="w-full h-48 bg-roca rounded-xl animate-pulse" />,
})

interface TimeSlot { id: string; date: Date | string; startTime: string; spotsRemaining: number }
interface Activity {
    id: string; title: string; description: string | null; priceCents: number
    durationMinutes: number; maxParticipants: number; category: string; difficulty: string
    meetingPoint: string | null; meetingLat: number | null; meetingLng: number | null
    includes: string | null; whatToBring: string | null; photos: string[]; timeSlots: TimeSlot[]
    track: { geojson: string | null; distance: number | null; elevationGain: number | null; durationEst: number | null } | null
}
interface Credential { type: string; name: string; issuingBody: string | null; coverageAmount: number | null; expiryDate: Date | null }
interface Guide {
    name: string; slug: string; bio: string | null; avatarUrl: string | null; phone?: string | null; email?: string
    zone: string | null; activities: Activity[]; certifications: string | null; yearsExperience: number | null
    languages: string[]; verificationLevel: string; credentials: Credential[]
    reviews?: { id: string; rating: number; comment: string; clientName: string; date: string; activityTitle?: string }[]
}

function Stars({ rating }: { rating: number }) {
    return <span className="text-amber-400 text-sm">{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}</span>
}

function DiffBadge({ d }: { d: string }) {
    const cls = d === "LOW" ? "bg-green-50 text-green-700 border-green-200" : d === "HIGH" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cls}`}>{d === "LOW" ? "Fácil" : d === "HIGH" ? "Difícil" : "Moderado"}</span>
}

function mapsUrl(lat: number, lng: number) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

function fmtDuration(mins: number) {
    const h = Math.floor(mins / 60), m = mins % 60
    return h > 0 ? (m > 0 ? `${h}h ${m}min` : `${h}h`) : `${m}min`
}

export function GuideProfile({ guide }: { guide: Guide }) {
    const [selectedSlot, setSelectedSlot] = useState<{ slot: TimeSlot; activity: Activity } | null>(null)
    const [showAllReviews, setShowAllReviews] = useState(false)
    const coverPhoto = guide.activities.find(a => a.photos[0])?.photos[0] || getRouteImage({ title: guide.zone || guide.name })
    const allCerts = guide.credentials.filter(c => c.type === "TITULO")
    const allInsurance = guide.credentials.filter(c => c.type === "SEGURO")
    const legacyCerts = (!guide.credentials.length && guide.certifications) ? guide.certifications.split(/[,\n]/).filter(Boolean).map(s => s.trim()) : []
    const reviews = guide.reviews || []
    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

    return (
        <div className="min-h-screen bg-niebla">
            {/* Hero with cover photo */}
            <div className="relative h-56 md:h-72 bg-pizarra overflow-hidden">
                <img src={coverPhoto} alt="" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-pizarra via-pizarra/50 to-transparent" />
                <a href="/" className="absolute top-4 left-4 text-white/60 hover:text-white text-sm transition flex items-center gap-1">
                    <MountainIcon className="w-4 h-4" /> PATHY
                </a>
            </div>

            {/* Profile card overlapping hero */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-24 relative z-10">
                <div className="bg-white border border-roca-dark/15 rounded-2xl p-6 shadow-lg mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-musgo/10 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl overflow-hidden shrink-0 -mt-16 md:-mt-16">
                            {guide.avatarUrl ? <img src={guide.avatarUrl} alt={guide.name} className="w-full h-full object-cover" /> : <MountainIcon className="w-10 h-10 text-musgo" />}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-pizarra">{guide.name}</h1>
                                {guide.verificationLevel === "VERIFIED" && <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold rounded-full flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Verificado</span>}
                                {guide.verificationLevel === "PENDING" && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded-full">⏳ En verificación</span>}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-granito flex-wrap">
                                {guide.zone && <span className="flex items-center gap-1"><PinIcon className="w-3.5 h-3.5 text-musgo" /> {guide.zone}</span>}
                                {guide.yearsExperience && <span>📅 {guide.yearsExperience} años exp.</span>}
                                {guide.languages.length > 0 && <span>🌐 {guide.languages.join(", ")}</span>}
                            </div>
                            {reviews.length > 0 && (
                                <div className="flex items-center justify-center md:justify-start gap-1.5 mt-1.5">
                                    <Stars rating={avgRating} />
                                    <span className="text-sm font-medium text-pizarra">{avgRating.toFixed(1)}</span>
                                    <span className="text-xs text-granito">({reviews.length} reseñas)</span>
                                </div>
                            )}
                            {guide.bio && <p className="text-sm text-granito mt-3 max-w-xl">{guide.bio}</p>}
                        </div>
                        {/* Contact buttons */}
                        <div className="flex flex-col gap-2 shrink-0">
                            {guide.phone && (
                                <>
                                    <a href={`https://wa.me/${guide.phone.replace(/\s+/g, "")}?text=${encodeURIComponent(`Hola ${guide.name}! Estoy interesado en tus actividades.`)}`} target="_blank" rel="noopener noreferrer"
                                        className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium rounded-xl transition flex items-center gap-2 shadow-sm">
                                        <PhoneIcon className="w-4 h-4" /> WhatsApp
                                    </a>
                                    <a href={`tel:${guide.phone.replace(/\s+/g, "")}`}
                                        className="px-4 py-2.5 bg-lago/10 hover:bg-lago/20 text-lago text-sm font-medium rounded-xl transition flex items-center gap-2 border border-lago/20">
                                        <PhoneIcon className="w-4 h-4" /> Llamar
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Certifications */}
                {(allCerts.length > 0 || legacyCerts.length > 0 || allInsurance.length > 0) && (
                    <div className="bg-white border border-roca-dark/15 rounded-2xl p-5 mb-6 shadow-sm">
                        <h3 className="text-sm font-bold text-pizarra mb-3 flex items-center gap-1.5">🎓 Certificaciones y titulaciones</h3>
                        <div className="flex flex-wrap gap-2">
                            {allCerts.map((c, i) => (
                                <span key={i} className="px-3 py-1.5 bg-musgo/10 text-musgo text-xs rounded-lg border border-musgo/15 flex items-center gap-1.5">
                                    <CheckIcon className="w-3 h-3" /> {c.name}{c.issuingBody ? ` (${c.issuingBody})` : ""}
                                </span>
                            ))}
                            {legacyCerts.map((c, i) => (
                                <span key={`l-${i}`} className="px-3 py-1.5 bg-musgo/10 text-musgo text-xs rounded-lg border border-musgo/15 flex items-center gap-1.5">
                                    <CheckIcon className="w-3 h-3" /> {c}
                                </span>
                            ))}
                            {allInsurance.map((c, i) => (
                                <span key={`s-${i}`} className="px-3 py-1.5 bg-lago/10 text-lago text-xs rounded-lg border border-lago/15 flex items-center gap-1.5">
                                    🛡️ RC{c.coverageAmount ? ` ${c.coverageAmount.toLocaleString()}€` : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Activities */}
                <h3 className="text-lg font-bold text-pizarra mb-4 flex items-center gap-2">🧗 Actividades ({guide.activities.length})</h3>

                {guide.activities.length === 0 ? (
                    <div className="bg-white border border-dashed border-roca-dark/30 rounded-2xl p-10 text-center shadow-sm">
                        <MountainIcon className="w-10 h-10 text-musgo/20 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-pizarra mb-1">Próximamente</h2>
                        <p className="text-sm text-granito">{guide.name} está preparando experiencias increíbles.</p>
                    </div>
                ) : (
                    <div className="space-y-4 mb-8">
                        {guide.activities.map(activity => {
                            const photo = activity.photos[0] || getRouteImage(activity)
                            return (
                                <div key={activity.id} className="bg-white rounded-2xl shadow-sm border border-roca-dark/15 overflow-hidden hover:shadow-md transition">
                                    {/* Photo + overlay info */}
                                    <div className="relative h-44 overflow-hidden">
                                        <img src={photo} alt={activity.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CategoryIcon category={activity.category} className="w-5 h-5 text-white" />
                                                    <h2 className="text-lg font-bold text-white">{activity.title}</h2>
                                                </div>
                                                <div className="flex items-center gap-2"><DiffBadge d={activity.difficulty} /></div>
                                            </div>
                                            <span className="text-2xl font-bold text-white">{(activity.priceCents / 100).toFixed(0)}€</span>
                                        </div>
                                        {!activity.photos[0] && <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] bg-black/40 text-white/70 backdrop-blur-sm">🏞️ {getTerrainLabel(classifyRoute(activity))}</span>}
                                    </div>

                                    <div className="p-5">
                                        {activity.description && <p className="text-sm text-granito mb-3">{activity.description}</p>}

                                        <div className="flex gap-4 text-sm text-granito mb-3 flex-wrap">
                                            <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4 text-musgo" /> {fmtDuration(activity.durationMinutes)}</span>
                                            <span className="flex items-center gap-1"><GroupIcon className="w-4 h-4 text-musgo" /> Máx {activity.maxParticipants}</span>
                                            {activity.meetingPoint && <span className="flex items-center gap-1"><PinIcon className="w-3.5 h-3.5 text-musgo" /> {activity.meetingPoint}</span>}
                                        </div>

                                        {/* Includes & What to bring */}
                                        {(activity.includes || activity.whatToBring) && (
                                            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                                                {activity.includes && (
                                                    <div className="bg-niebla rounded-xl p-3">
                                                        <p className="font-medium text-pizarra mb-1">✅ Incluye</p>
                                                        <ul className="text-granito space-y-0.5">{activity.includes.split("\n").filter(Boolean).map((l, i) => <li key={i}>· {l}</li>)}</ul>
                                                    </div>
                                                )}
                                                {activity.whatToBring && (
                                                    <div className="bg-niebla rounded-xl p-3">
                                                        <p className="font-medium text-pizarra mb-1">🎒 Qué traer</p>
                                                        <ul className="text-granito space-y-0.5">{activity.whatToBring.split("\n").filter(Boolean).map((l, i) => <li key={i}>· {l}</li>)}</ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Track stats */}
                                        {activity.track && (
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {activity.track.distance != null && <div className="bg-niebla rounded-lg p-2 text-center"><p className="text-[10px] text-granito">📏 Distancia</p><p className="text-sm font-bold text-pizarra">{(activity.track.distance / 1000).toFixed(1)} km</p></div>}
                                                {activity.track.elevationGain != null && <div className="bg-niebla rounded-lg p-2 text-center"><p className="text-[10px] text-granito">⛰️ Desnivel</p><p className="text-sm font-bold text-musgo">+{activity.track.elevationGain} m</p></div>}
                                                {activity.track.durationEst != null && <div className="bg-niebla rounded-lg p-2 text-center"><p className="text-[10px] text-granito">⏱️ Duración</p><p className="text-sm font-bold text-pizarra">{Math.floor(activity.track.durationEst / 3600)}h {Math.round((activity.track.durationEst % 3600) / 60)}min</p></div>}
                                            </div>
                                        )}

                                        {/* Map */}
                                        {activity.meetingLat && activity.meetingLng && (
                                            <div className="mb-3">
                                                <MapView lat={activity.meetingLat} lng={activity.meetingLng} address={activity.meetingPoint || undefined} trackGeoJSON={activity.track?.geojson || undefined} className="w-full h-40 rounded-xl" />
                                                <a href={mapsUrl(activity.meetingLat, activity.meetingLng)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1.5 text-xs text-musgo hover:underline">🧭 Cómo llegar</a>
                                            </div>
                                        )}

                                        {/* Time slots */}
                                        {activity.timeSlots.length === 0 ? (
                                            <p className="text-xs text-granito/50 italic">Sin horarios disponibles próximamente</p>
                                        ) : (
                                            <div>
                                                <p className="text-xs font-medium text-pizarra mb-2">📅 Próximas fechas:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {activity.timeSlots.slice(0, 6).map(slot => (
                                                        <button key={slot.id} onClick={() => setSelectedSlot({ slot, activity })}
                                                            className="px-3.5 py-2 bg-musgo hover:bg-musgo-dark text-white text-sm rounded-xl transition font-medium shadow-sm shadow-musgo/20 flex items-center gap-1.5">
                                                            {new Date(slot.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {slot.startTime}h
                                                            <span className="text-[10px] text-white/60">({slot.spotsRemaining} plazas)</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Reviews */}
                {reviews.length > 0 && (
                    <div className="bg-white border border-roca-dark/15 rounded-2xl p-5 mb-6 shadow-sm">
                        <h3 className="text-sm font-bold text-pizarra mb-3 flex items-center gap-2">⭐ Reseñas de clientes ({reviews.length})</h3>
                        <div className="space-y-3">
                            {(showAllReviews ? reviews : reviews.slice(0, 3)).map(r => (
                                <div key={r.id} className="bg-niebla rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-1"><Stars rating={r.rating} /><span className="text-xs text-granito">{r.clientName} · {new Date(r.date).toLocaleDateString("es-ES")}</span></div>
                                    <p className="text-sm text-pizarra">{r.comment}</p>
                                    {r.activityTitle && <p className="text-[10px] text-granito mt-1">Sobre: {r.activityTitle}</p>}
                                </div>
                            ))}
                        </div>
                        {reviews.length > 3 && !showAllReviews && (
                            <button onClick={() => setShowAllReviews(true)} className="mt-3 text-sm text-musgo hover:underline">Ver todas las reseñas ({reviews.length})</button>
                        )}
                    </div>
                )}
            </div>

            {selectedSlot && <BookingForm slot={selectedSlot.slot} activity={selectedSlot.activity} guideName={guide.name} onClose={() => setSelectedSlot(null)} />}

            <footer className="text-center py-6 text-xs text-granito">Powered by <span className="font-semibold text-musgo">PATHY</span></footer>
        </div>
    )
}
