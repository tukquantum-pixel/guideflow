"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AvatarUploader } from "@/components/avatar-uploader"
import { CredentialManager } from "@/components/credential-manager"

interface Guide {
    name: string; slug: string; bio: string | null; zone: string | null
    phone: string | null; languages: string[]; avatarUrl: string | null
    certifications: string | null; yearsExperience: number | null
    serviceRadius: number | null; marketplaceEnabled: boolean
}

export function ProfileForm({ guide }: { guide: Guide }) {
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [bio, setBio] = useState(guide.bio || "")
    const [certs, setCerts] = useState(guide.certifications || "")
    const [langs, setLangs] = useState(guide.languages.join(", "))
    const [avatarUrl, setAvatarUrl] = useState(guide.avatarUrl)
    const [mpEnabled, setMpEnabled] = useState(guide.marketplaceEnabled)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSaving(true); setSaved(false)
        const fd = new FormData(e.currentTarget)
        await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: fd.get("name"), bio: fd.get("bio"), zone: fd.get("zone"), phone: fd.get("phone"),
                languages: langs.split(",").map((l) => l.trim()).filter(Boolean),
                avatarUrl,
                certifications: certs || null,
                yearsExperience: fd.get("yearsExperience") || null,
                serviceRadius: fd.get("serviceRadius") || null,
                marketplaceEnabled: mpEnabled,
            }),
        })
        setSaving(false); setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="min-h-screen bg-niebla">
            <nav className="border-b border-roca-dark/30 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
                    <a href="/dashboard" className="text-lg font-bold text-pizarra">PATHY</a>
                    <span className="text-granito/30">›</span>
                    <span className="text-musgo font-medium">Mi Perfil</span>
                </div>
            </nav>
            <main className="max-w-2xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-pizarra mb-2">Mi Perfil</h2>
                <p className="text-granito mb-6">
                    Tu página pública:{" "}
                    <a href={`/${guide.slug}`} target="_blank" className="text-lago hover:text-lago-dark font-medium transition">
                        PATHY.com/{guide.slug} →
                    </a>
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Datos básicos */}
                    <div className="bg-white border border-roca-dark/20 rounded-xl p-6 space-y-5">
                        <AvatarUploader currentUrl={avatarUrl} onUploaded={setAvatarUrl} />
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Nombre completo</label>
                            <input name="name" defaultValue={guide.name} required className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra focus:ring-2 focus:ring-musgo focus:outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Zona / Ubicación</label>
                            <input name="zone" defaultValue={guide.zone || ""} placeholder="Ej: Sierra de Guara, Huesca" className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Teléfono de contacto</label>
                            <input name="phone" type="tel" defaultValue={guide.phone || ""} placeholder="+34 600 000 000" className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Idiomas</label>
                            <input value={langs} onChange={(e) => setLangs(e.target.value)} placeholder="Español, Inglés, Francés" className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none transition" />
                            <p className="text-xs text-granito mt-1">Separados por comas</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Biografía</label>
                            <textarea name="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value.slice(0, 500))} placeholder="Cuéntales a tus clientes quién eres..."
                                className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none resize-none transition" />
                            <p className={`text-xs mt-1 ${bio.length > 450 ? "text-atardecer" : "text-granito"}`}>{bio.length}/500 caracteres</p>
                        </div>
                    </div>

                    {/* Credenciales profesionales */}
                    <div className="bg-white border border-roca-dark/20 rounded-xl p-6 space-y-5">
                        <h3 className="text-lg font-bold text-pizarra flex items-center gap-2">🎓 Credenciales profesionales</h3>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Titulaciones / Certificaciones</label>
                            <textarea rows={3} value={certs} onChange={(e) => setCerts(e.target.value.slice(0, 500))} placeholder="Ej: Técnico Deportivo en Montaña, Guía de barrancos AEGM, Primeros auxilios..."
                                className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none resize-none transition" />
                            <p className="text-xs text-granito mt-1">Una por línea o separadas por comas</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">Años de experiencia</label>
                                <input name="yearsExperience" type="number" min="0" max="50" defaultValue={guide.yearsExperience ?? ""} placeholder="Ej: 8"
                                    className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">Radio de servicio (km)</label>
                                <input name="serviceRadius" type="number" min="1" max="500" defaultValue={guide.serviceRadius ?? ""} placeholder="Ej: 50"
                                    className="w-full px-4 py-2.5 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none transition" />
                            </div>
                        </div>
                    </div>

                    {/* Marketplace */}
                    <div className="bg-white border border-roca-dark/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-pizarra flex items-center gap-2">🗺️ Marketplace</h3>
                                <p className="text-sm text-granito mt-1">Aparece en búsquedas públicas para que nuevos clientes te encuentren.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={mpEnabled} onChange={(e) => setMpEnabled(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-roca-dark/30 peer-focus:ring-2 peer-focus:ring-musgo rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-musgo"></div>
                            </label>
                        </div>
                        {mpEnabled && (
                            <p className="text-xs text-musgo mt-3 bg-musgo/10 rounded-lg px-3 py-2">✅ Tu perfil aparecerá en las búsquedas del marketplace cuando esté activo.</p>
                        )}
                    </div>

                    {/* Documentos y verificación */}
                    <div className="bg-white border border-roca-dark/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-pizarra mb-4 flex items-center gap-2">🔒 Documentos y verificación</h3>
                        <CredentialManager />
                    </div>

                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-musgo hover:bg-musgo-dark text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg shadow-musgo/25">
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                        {saved && <span className="text-musgo text-sm font-medium">✅ Guardado</span>}
                    </div>
                </form>
            </main>
        </div>
    )
}
