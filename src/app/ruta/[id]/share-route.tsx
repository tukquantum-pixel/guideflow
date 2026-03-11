"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "@/components/icons"

export function ShareRoute({ title, activityId }: { title: string; activityId: string }) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== "undefined" ? window.location.href : `/ruta/${activityId}`

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { /* fallback */ }
    }

    const waText = encodeURIComponent(`Mira esta ruta: ${title} ${url}`)
    const twText = encodeURIComponent(`${title}`)

    return (
        <div className="bg-white border border-roca-dark/15 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-pizarra mb-3 flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg> Compartir esta ruta</h3>
            <div className="flex gap-2 flex-wrap">
                <button onClick={copyLink}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${copied ? "bg-musgo text-white" : "bg-niebla text-pizarra hover:bg-roca"}`}>
                    {copied ? <span className="flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" /> Copiado</span> : <span className="flex items-center gap-1"><CopyIcon className="w-3.5 h-3.5" /> Copiar enlace</span>}
                </button>
                <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition">
                    WhatsApp
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${twText}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-lago/10 text-lago hover:bg-lago/20 transition">
                    Twitter
                </a>
            </div>
        </div>
    )
}
