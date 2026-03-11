"use client"

import { useState, useRef } from "react"

interface Props {
    currentUrl: string | null
    onUploaded: (url: string) => void
}

export function AvatarUploader({ currentUrl, onUploaded }: Props) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(currentUrl)
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        setPreview(URL.createObjectURL(file))
        const fd = new FormData()
        fd.append("file", file)
        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd })
            const data = await res.json()
            if (data.url) onUploaded(data.url)
        } catch { /* fallback */ }
        setUploading(false)
    }

    return (
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-roca border-2 border-roca-dark/30 overflow-hidden flex items-center justify-center">
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl text-granito/40">👤</span>
                )}
            </div>
            <div>
                <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
                    className="px-4 py-2 bg-musgo/10 hover:bg-musgo/20 text-musgo text-sm font-medium rounded-lg transition disabled:opacity-50">
                    {uploading ? "Subiendo..." : "Cambiar foto"}
                </button>
                <p className="text-xs text-granito mt-1">JPG, PNG o WebP. Máx 5MB.</p>
            </div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
        </div>
    )
}
