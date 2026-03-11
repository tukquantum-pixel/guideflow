"use client"

import { GPXUploader } from "@/components/gpx-uploader"

interface TrackData {
    name: string; distance: number | null; elevationGain: number | null
    elevationLoss: number | null; durationEst: number | null
}

export function GPXSection({ activityId, track }: { activityId: string; track: TrackData | null }) {
    return (
        <div className="bg-white border border-roca-dark/20 rounded-2xl p-6 mt-6">
            <GPXUploader activityId={activityId} track={track} />
        </div>
    )
}
