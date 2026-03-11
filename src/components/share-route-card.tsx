"use client"

import { useState } from "react"
import { CheckIcon, MountainIcon } from "@/components/icons"

interface RouteShareData {
    id: string; title: string; distance: number; elevation: number; duration: string
}

export function ShareRouteCard({ route }: { route: RouteShareData }) {
    const [copied, setCopied] = useState(false)
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/ruta/${route.id}`
    const text = `He completado ${route.title} — ${route.distance}km con ${route.elevation}m de desnivel en ${route.duration}. Descubre rutas con PATHY: ${url}`

    const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
    const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
    const copyLink = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }

    return (
        <div className="bg-gradient-to-br from-musgo/5 to-lago/5 border border-musgo/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
                <MountainIcon className="w-5 h-5 text-musgo" />
                <h3 className="font-bold text-pizarra text-sm">Comparte tu logro</h3>
            </div>
            <p className="text-xs text-granito mb-4">{route.title} · {route.distance}km · +{route.elevation}m</p>
            <div className="grid grid-cols-3 gap-2">
                <ShareBtn onClick={shareWhatsApp} color="bg-[#25D366]" label="WhatsApp">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.644-1.217A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.09 0-4.081-.656-5.751-1.855l-.413-.281-2.756.723.735-2.686-.308-.443A9.72 9.72 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" /></svg>
                </ShareBtn>
                <ShareBtn onClick={shareTwitter} color="bg-pizarra" label="Twitter">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </ShareBtn>
                <ShareBtn onClick={copyLink} color={copied ? "bg-musgo" : "bg-roca"} label={copied ? "Copiado" : "Copiar"}>
                    {copied ? <CheckIcon className="w-4 h-4" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>}
                </ShareBtn>
            </div>
        </div>
    )
}

function ShareBtn({ onClick, color, label, children }: { onClick: () => void; color: string; label: string; children: React.ReactNode }) {
    return (
        <button onClick={onClick} className={`${color} text-white py-2 rounded-lg flex flex-col items-center gap-1 text-xs font-medium hover:opacity-90 transition`}>
            {children}{label}
        </button>
    )
}
