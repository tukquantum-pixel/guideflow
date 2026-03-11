import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { ActivityForm } from "@/components/activity-form"
import { GPXSection } from "./gpx-section"

type Params = { params: Promise<{ id: string }> }

export default async function EditActivityPage({ params }: Params) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")
    const { id } = await params
    const activity = await prisma.activity.findUnique({
        where: { id },
        include: { track: { select: { name: true, distance: true, elevationGain: true, elevationLoss: true, durationEst: true } } },
    })
    if (!activity || activity.guideId !== session.user.id) notFound()

    return (
        <div className="min-h-screen bg-niebla">
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
                <a href="/dashboard/activities" className="text-sm text-musgo hover:text-musgo-dark mb-4 inline-block">← Volver a actividades</a>
                <ActivityForm mode="edit" activity={activity} />
                <GPXSection activityId={activity.id} track={activity.track} />
            </div>
        </div>
    )
}
