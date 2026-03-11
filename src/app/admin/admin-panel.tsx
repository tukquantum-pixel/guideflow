"use client"

import { useState, useEffect } from "react"

interface Guide { id: string; name: string; email: string; avatarUrl: string | null; createdAt: string; verificationLevel: string }
interface Credential {
    id: string; type: string; name: string; issuingBody: string | null; documentUrl: string
    issueDate: string | null; expiryDate: string | null; coverageAmount: number | null
    status: string; rejectionNote: string | null; createdAt: string; guide: Guide
}

const TYPE_LABELS: Record<string, string> = {
    TITULO: "🎓 Titulación", SEGURO: "🛡️ Seguro", LICENCIA: "📋 Licencia",
    EXPERIENCIA: "📄 Experiencia", IDENTIDAD: "🪪 Identidad",
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-roca text-granito", APPROVED: "bg-musgo/10 text-musgo",
    REJECTED: "bg-atardecer/10 text-atardecer", EXPIRED: "bg-atardecer/10 text-atardecer",
}

export function AdminPanel({ adminName, statusCounts }: { adminName: string; statusCounts: Record<string, number> }) {
    const [credentials, setCredentials] = useState<Credential[]>([])
    const [filter, setFilter] = useState("PENDING")
    const [typeFilter, setTypeFilter] = useState("")
    const [loading, setLoading] = useState(false)
    const [actionId, setActionId] = useState<string | null>(null)
    const [rejectNote, setRejectNote] = useState("")
    const [rejectingId, setRejectingId] = useState<string | null>(null)

    async function load() {
        setLoading(true)
        const params = new URLSearchParams({ status: filter })
        if (typeFilter) params.set("type", typeFilter)
        try {
            const res = await fetch(`/api/admin/credentials?${params}`)
            const data = await res.json()
            if (Array.isArray(data)) setCredentials(data)
        } catch { /* ignore */ }
        setLoading(false)
    }

    useEffect(() => { load() }, [filter, typeFilter])

    async function handleAction(id: string, action: "APPROVED" | "REJECTED", note?: string) {
        setActionId(id)
        try {
            await fetch("/api/admin/credentials", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credentialId: id, action, rejectionNote: note }),
            })
            setCredentials(prev => prev.filter(c => c.id !== id))
            setRejectingId(null)
            setRejectNote("")
        } catch { /* ignore */ }
        setActionId(null)
    }

    const tabs = [
        { key: "PENDING", label: "⏳ Pendientes", count: statusCounts.PENDING || 0 },
        { key: "APPROVED", label: "✅ Aprobados", count: statusCounts.APPROVED || 0 },
        { key: "REJECTED", label: "❌ Rechazados", count: statusCounts.REJECTED || 0 },
        { key: "EXPIRED", label: "⚠️ Caducados", count: statusCounts.EXPIRED || 0 },
    ]

    return (
        <div className="min-h-screen bg-niebla">
            <nav className="border-b border-roca-dark/30 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">🔒</span>
                        <h1 className="text-lg font-bold text-pizarra">Panel de Revisión</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-granito">{adminName}</span>
                        <a href="/dashboard" className="text-xs text-lago hover:text-lago-dark">← Dashboard</a>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
                {/* Status tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setFilter(t.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === t.key ? "bg-pizarra text-white" : "bg-white border border-roca-dark/20 text-granito hover:border-musgo/30"}`}>
                            {t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span>
                        </button>
                    ))}
                </div>

                {/* Type filter */}
                <div className="flex gap-2 mb-6 items-center">
                    <span className="text-sm text-granito">Tipo:</span>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-roca-dark/20 rounded-lg text-sm text-pizarra">
                        <option value="">Todos</option>
                        <option value="TITULO">🎓 Titulaciones</option>
                        <option value="SEGURO">🛡️ Seguros</option>
                        <option value="LICENCIA">📋 Licencias</option>
                        <option value="IDENTIDAD">🪪 Identidad</option>
                        <option value="EXPERIENCIA">📄 Experiencia</option>
                    </select>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl h-32 animate-pulse" />)}</div>
                ) : credentials.length === 0 ? (
                    <div className="bg-white border border-dashed border-roca-dark/30 rounded-xl p-12 text-center">
                        <p className="text-granito">No hay documentos con estado &quot;{filter}&quot;</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {credentials.map(cred => {
                            const daysWaiting = Math.floor((Date.now() - new Date(cred.createdAt).getTime()) / 86400000)
                            return (
                                <div key={cred.id} className="bg-white border border-roca-dark/20 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-musgo/10 flex items-center justify-center shrink-0 overflow-hidden">
                                                {cred.guide.avatarUrl ? <img src={cred.guide.avatarUrl} className="w-full h-full object-cover" /> :
                                                    <span className="text-sm font-bold text-musgo">{cred.guide.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-pizarra">{cred.guide.name}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[cred.guide.verificationLevel] || STATUS_COLORS.PENDING}`}>
                                                        {cred.guide.verificationLevel}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-granito">{cred.guide.email} · Guía desde {new Date(cred.guide.createdAt).getFullYear()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[cred.status]}`}>{cred.status}</span>
                                    </div>

                                    <div className="mt-3 bg-niebla rounded-lg p-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div>
                                                <p className="font-medium text-pizarra text-sm">{TYPE_LABELS[cred.type] || cred.type} · {cred.name}</p>
                                                <div className="flex gap-3 text-xs text-granito mt-1 flex-wrap">
                                                    {cred.issuingBody && <span>📌 {cred.issuingBody}</span>}
                                                    {cred.expiryDate && <span>📅 Caduca: {new Date(cred.expiryDate).toLocaleDateString("es-ES")}</span>}
                                                    {cred.coverageAmount && <span>💰 Cobertura: {cred.coverageAmount.toLocaleString()}€</span>}
                                                    <span>🕐 Subido hace {daysWaiting} día{daysWaiting !== 1 ? "s" : ""}</span>
                                                </div>
                                            </div>
                                            <a href={cred.documentUrl} target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-white border border-roca-dark/30 rounded-lg text-sm text-pizarra hover:bg-niebla transition whitespace-nowrap">
                                                📎 Ver documento
                                            </a>
                                        </div>
                                    </div>

                                    {cred.rejectionNote && (
                                        <p className="mt-2 text-xs text-atardecer bg-atardecer/10 px-3 py-1.5 rounded-lg">💬 {cred.rejectionNote}</p>
                                    )}

                                    {/* Actions for PENDING */}
                                    {filter === "PENDING" && (
                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                            <button onClick={() => handleAction(cred.id, "APPROVED")}
                                                disabled={actionId === cred.id}
                                                className="px-4 py-2 bg-musgo hover:bg-musgo-dark text-white text-sm font-medium rounded-lg transition disabled:opacity-50 shadow-lg shadow-musgo/25">
                                                {actionId === cred.id ? "..." : "✅ Aprobar"}
                                            </button>
                                            {rejectingId === cred.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                                                        placeholder="Motivo del rechazo..."
                                                        className="px-3 py-2 border border-roca-dark/30 rounded-lg text-sm text-pizarra w-60" />
                                                    <button onClick={() => handleAction(cred.id, "REJECTED", rejectNote)}
                                                        disabled={actionId === cred.id}
                                                        className="px-3 py-2 bg-atardecer hover:bg-atardecer-dark text-white text-sm rounded-lg transition disabled:opacity-50">
                                                        Confirmar
                                                    </button>
                                                    <button onClick={() => { setRejectingId(null); setRejectNote("") }}
                                                        className="text-xs text-granito">Cancelar</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setRejectingId(cred.id)}
                                                    className="px-4 py-2 bg-white border border-atardecer/30 text-atardecer text-sm font-medium rounded-lg hover:bg-atardecer/10 transition">
                                                    ❌ Rechazar
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
