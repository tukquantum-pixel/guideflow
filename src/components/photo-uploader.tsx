"use client"

import { useState, useRef } from "react"
import { PlusIcon, XIcon } from "@/components/icons"

interface Props {
    photos: string[]
    onChange: (photos: string[]) => void
    max?: number
}

export function PhotoUploader({ photos, onChange, max = 5 }: Props) {
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return
        setUploading(true)
        const urls: string[] = []
        for (const file of files.slice(0, max - photos.length)) {
            const fd = new FormData()
            fd.append("file", file)
            try {
                const res = await fetch("/api/upload", { method: "POST", body: fd })
                const data = await res.json()
                if (data.url) urls.push(data.url)
            } catch { /* skip failed */ }
        }
        onChange([...photos, ...urls])
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ""
    }

    function removePhoto(index: number) {
        onChange(photos.filter((_, i) => i !== index))
    }

    return (
        <div>
            <label className="block text-sm font-medium text-pizarra mb-2">Fotos de la actividad</label>
            <div className="flex flex-wrap gap-3">
                {photos.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-roca-dark/20 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-pizarra/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <XIcon className="w-3 h-3 text-white" />
                        </button>
                    </div>
                ))}
                {photos.length < max && (
                    <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-roca-dark/30 flex flex-col items-center justify-center text-granito hover:border-musgo hover:text-musgo transition disabled:opacity-50">
                        <PlusIcon className="w-5 h-5" />
                        <span className="text-xs mt-1">{uploading ? "..." : "Foto"}</span>
                    </button>
                )}
            </div>
            <p className="text-xs text-granito mt-1">{photos.length}/{max} fotos · JPG, PNG o WebP</p>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} className="hidden" />
        </div>
    )
}
