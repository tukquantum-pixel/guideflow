import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { FollowClient } from "./follow-client"

export const metadata = { title: "Seguir ruta | PATHY" }

export default async function FollowPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) redirect(`/login?callbackUrl=/seguir/${id}`)

    const activity = await prisma.activity.findUnique({
        where: { id },
        select: {
            id: true, title: true, category: true, difficulty: true,
            track: { select: { geojson: true, distance: true, elevationGain: true } },
        },
    })
    if (!activity?.track?.geojson) redirect(`/ruta/${id}`)

    const data = { ...activity, track: { ...activity.track!, geojson: activity.track!.geojson! } }

    return <FollowClient activity={data} />
}
