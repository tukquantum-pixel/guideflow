export interface StagePhoto { id: string; url: string; caption: string | null }
export interface CheckpointPhoto { id: string; url: string }
export interface Checkpoint {
    id: string; name: string; type: string; lat: number; lng: number
    elevation: number | null; description: string | null; order: number
    timeFromStart: number | null; photos: CheckpointPhoto[]
}
export interface Stage {
    id: string; name: string; description: string | null; order: number
    distance: number | null; duration: number | null
    elevationGain: number | null; elevationLoss: number | null
    difficulty: string | null; terrain: string | null
    photos: StagePhoto[]; checkpoints: Checkpoint[]
}
export interface Track {
    distance: number | null; elevationGain: number | null
    elevationLoss: number | null; durationEst: number | null
    routeType: string | null; seasonRecommended: string[]
    minElevation: number | null; maxElevation: number | null
    geojson: string | null
    stages: Stage[]
}
export interface Guide {
    id: string; name: string; slug: string; avatarUrl: string | null
    bio: string | null; verificationLevel: string; zone: string | null
}
export interface TimeSlot { id: string; date: Date; startTime: string; spotsRemaining: number }
export interface Activity {
    id: string; title: string; description: string | null; priceCents: number
    durationMinutes: number; maxParticipants: number; category: string; difficulty: string
    meetingPoint: string | null; meetingLat: number | null; meetingLng: number | null
    includes: string | null; whatToBring: string | null; photos: string[]
    track: Track | null; guide: Guide; timeSlots: TimeSlot[]
}
