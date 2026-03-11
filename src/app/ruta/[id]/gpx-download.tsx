"use client"

import { DownloadIcon } from "@/components/icons"

export function GpxDownload({ activityId }: { activityId: string }) {
    return (
        <div className="bg-gradient-to-br from-lago/5 to-lago/10 border border-lago/20 rounded-xl p-5 text-center">
            <DownloadIcon className="w-8 h-8 text-lago mx-auto mb-2" />
            <p className="text-sm font-medium text-pizarra mb-1">Track GPX disponible</p>
            <p className="text-xs text-granito mb-3">Descárgalo para tu GPS, Garmin, Apple Watch...</p>
            <a href={`/api/routes/${activityId}/gpx`} download
                className="block py-2.5 bg-lago hover:bg-lago-dark text-white rounded-lg text-sm font-semibold transition">
                <span className="flex items-center justify-center gap-1.5"><DownloadIcon className="w-4 h-4" /> Descargar GPX</span>
            </a>
        </div>
    )
}
