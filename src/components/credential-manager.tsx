"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const TYPE_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
    TITULO: { label: "Titulación oficial", icon: "🎓", desc: "Técnico deportivo, guía turismo, etc." },
    SEGURO: { label: "Seguro / Póliza RC", icon: "🛡️", desc: "Responsabilidad civil, accidentes" },
    LICENCIA: { label: "Licencia / Permiso", icon: "📋", desc: "Federativa, municipal, parque natural" },
    EXPERIENCIA: { label: "Experiencia profesional", icon: "📄", desc: "Certificados de empresas, vida laboral" },
    IDENTIDAD: { label: "Documento de identidad", icon: "🪪", desc: "DNI, NIE o pasaporte" },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "⏳ Pendiente", color: "bg-roca text-granito" },
    APPROVED: { label: "✅ Verificado", color: "bg-musgo/10 text-musgo" },
    REJECTED: { label: "❌ Rechazado", color: "bg-atardecer/10 text-atardecer" },
    EXPIRED: { label: "⚠️ Caducado", color: "bg-atardecer/10 text-atardecer" },
}

interface Credential {
    id: string; type: string; name: string; issuingBody: string | null
    documentUrl: string; issueDate: string | null; expiryDate: string | null
    coverageAmount: number | null; status: string; rejectionNote: string | null
    createdAt: string
}

export function CredentialManager() {
    const [credentials, setCredentials] = useState<Credential[]>([])
    const [adding, setAdding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [type, setType] = useState("TITULO")
    const [name, setName] = useState("")
    const [issuingBody, setIssuingBody] = useState("")
    const [issueDate, setIssueDate] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [coverageAmount, setCoverageAmount] = useState("")
    const [docUrl, setDocUrl] = useState("")
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetch("/api/credentials").then(r => r.json()).then(d => { if (Array.isArray(d)) setCredentials(d) })
    }, [])

    async function uploadDoc(file: File) {
        setUploading(true)
        const fd = new FormData()
        fd.append("file", file)
        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd })
            const data = await res.json()
            if (data.url) setDocUrl(data.url)
        } catch { /* ignore */ }
        setUploading(false)
    }

    async function handleSubmit() {
        if (!name || !docUrl) return
        setSaving(true)
        try {
            const res = await fetch("/api/credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, name, issuingBody, documentUrl: docUrl, issueDate, expiryDate, coverageAmount }),
            })
            if (res.ok) {
                const cred = await res.json()
                setCredentials(prev => [cred, ...prev])
                resetForm()
                router.refresh()
            }
        } catch { /* ignore */ }
        setSaving(false)
    }

    async function deleteCred(id: string) {
        if (!confirm("¿Eliminar este documento?")) return
        await fetch(`/api/credentials?id=${id}`, { method: "DELETE" })
        setCredentials(prev => prev.filter(c => c.id !== id))
        router.refresh()
    }

    function resetForm() {
        setAdding(false); setName(""); setIssuingBody(""); setIssueDate(""); setExpiryDate(""); setCoverageAmount(""); setDocUrl("")
    }

    const approvedCount = credentials.filter(c => c.status === "APPROVED").length
    const pendingCount = credentials.filter(c => c.status === "PENDING").length

    return (
        <div className="space-y-4">
            {/* Status banner */}
            <div className={`rounded-xl p-4 ${approvedCount > 0 ? "bg-musgo/10 border border-musgo/20" : pendingCount > 0 ? "bg-roca border border-roca-dark/20" : "bg-niebla border border-roca-dark/20"}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-pizarra">
                            {approvedCount > 0 ? "✅ Guía verificado" : pendingCount > 0 ? "⏳ Verificación en proceso" : "📋 Sin documentos"}
                        </p>
                        <p className="text-sm text-granito mt-0.5">
                            {approvedCount} verificado{approvedCount !== 1 ? "s" : ""} · {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <button onClick={() => setAdding(!adding)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition ${adding ? "bg-white border border-roca-dark/30 text-granito" : "bg-musgo hover:bg-musgo-dark text-white shadow-lg shadow-musgo/25"}`}>
                        {adding ? "Cancelar" : "➕ Añadir documento"}
                    </button>
                </div>
            </div>

            {/* Add form */}
            {adding && (
                <div className="bg-white border border-roca-dark/20 rounded-xl p-5 space-y-4 animate-fade-in">
                    <h4 className="font-semibold text-pizarra">Nuevo documento</h4>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-1">Tipo de documento</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(TYPE_LABELS).map(([k, v]) => (
                                <button key={k} type="button" onClick={() => setType(k)}
                                    className={`p-3 rounded-lg text-left text-sm transition border ${type === k ? "border-musgo bg-musgo/10" : "border-roca-dark/20 hover:border-musgo/30"}`}>
                                    <span className="text-lg">{v.icon}</span>
                                    <p className="font-medium text-pizarra mt-1">{v.label}</p>
                                    <p className="text-xs text-granito">{v.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Nombre del documento *</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Técnico Deportivo Media Montaña"
                                className="w-full px-3 py-2 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Organismo emisor</label>
                            <input value={issuingBody} onChange={e => setIssuingBody(e.target.value)} placeholder="Ej: AEGM, Federación Aragonesa"
                                className="w-full px-3 py-2 border border-roca-dark/30 rounded-lg text-pizarra placeholder-granito/50 focus:ring-2 focus:ring-musgo focus:outline-none text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Fecha emisión</label>
                            <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)}
                                className="w-full px-3 py-2 border border-roca-dark/30 rounded-lg text-pizarra text-sm focus:ring-2 focus:ring-musgo focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-pizarra mb-1">Fecha caducidad</label>
                            <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                                className="w-full px-3 py-2 border border-roca-dark/30 rounded-lg text-pizarra text-sm focus:ring-2 focus:ring-musgo focus:outline-none" />
                            <p className="text-xs text-granito mt-0.5">Dejar vacío si no caduca</p>
                        </div>
                        {type === "SEGURO" && (
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">Cobertura (€)</label>
                                <input type="number" value={coverageAmount} onChange={e => setCoverageAmount(e.target.value)} placeholder="150000"
                                    className="w-full px-3 py-2 border border-roca-dark/30 rounded-lg text-pizarra text-sm focus:ring-2 focus:ring-musgo focus:outline-none" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-1">Documento (PDF o imagen) *</label>
                        {docUrl ? (
                            <div className="flex items-center gap-2 p-2 bg-musgo/10 rounded-lg">
                                <span className="text-sm text-musgo font-medium">✅ Documento subido</span>
                                <button onClick={() => setDocUrl("")} className="text-xs text-atardecer">Cambiar</button>
                            </div>
                        ) : (
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { if (e.target.files?.[0]) uploadDoc(e.target.files[0]) }}
                                disabled={uploading}
                                className="w-full text-sm text-granito file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-musgo/10 file:text-musgo hover:file:bg-musgo/20" />
                        )}
                        {uploading && <p className="text-xs text-granito mt-1 animate-pulse">Subiendo documento...</p>}
                    </div>
                    <div className="bg-niebla rounded-lg p-3 text-xs text-granito">
                        <p className="font-medium text-pizarra mb-1">📝 Declaración responsable</p>
                        <p>Al subir este documento, declaro bajo mi responsabilidad que es auténtico y vigente. PATHY verificará la documentación y podrá contactar con los organismos emisores.</p>
                    </div>
                    <button onClick={handleSubmit} disabled={saving || !name || !docUrl}
                        className="px-5 py-2.5 bg-musgo hover:bg-musgo-dark text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg shadow-musgo/25">
                        {saving ? "Guardando..." : "📤 Enviar a verificación"}
                    </button>
                </div>
            )}

            {/* Credential list */}
            {credentials.length > 0 && (
                <div className="space-y-3">
                    {credentials.map(cred => {
                        const tl = TYPE_LABELS[cred.type] || { label: cred.type, icon: "📄" }
                        const sl = STATUS_LABELS[cred.status] || STATUS_LABELS.PENDING
                        return (
                            <div key={cred.id} className="bg-white border border-roca-dark/20 rounded-xl p-4 flex items-start justify-between group">
                                <div className="flex items-start gap-3 min-w-0">
                                    <span className="text-xl mt-0.5">{tl.icon}</span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-pizarra">{cred.name}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sl.color}`}>{sl.label}</span>
                                        </div>
                                        <div className="flex gap-3 text-xs text-granito mt-1 flex-wrap">
                                            <span>{tl.label}</span>
                                            {cred.issuingBody && <span>· {cred.issuingBody}</span>}
                                            {cred.expiryDate && <span>· Caduca: {new Date(cred.expiryDate).toLocaleDateString("es-ES")}</span>}
                                            {cred.coverageAmount && <span>· Cobertura: {cred.coverageAmount.toLocaleString()}€</span>}
                                        </div>
                                        {cred.rejectionNote && <p className="text-xs text-atardecer mt-1">💬 {cred.rejectionNote}</p>}
                                    </div>
                                </div>
                                <button onClick={() => deleteCred(cred.id)}
                                    className="text-xs text-atardecer opacity-0 group-hover:opacity-100 transition shrink-0">🗑️</button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
