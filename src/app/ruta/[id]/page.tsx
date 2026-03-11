import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { RouteDetail } from "./route-detail"
import { unstable_cache } from "next/cache"

export const revalidate = 300

const getActivity = unstable_cache(
    async (id: string) => {
        return prisma.activity.findUnique({
            where: { id, active: true },
            include: {
                track: {
                    select: {
                        distance: true, elevationGain: true, elevationLoss: true, durationEst: true,
                        routeType: true, seasonRecommended: true, minElevation: true, maxElevation: true,
                        geojson: true,
                        stages: {
                            include: {
                                photos: { orderBy: { order: "asc" }, take: 3 },
                                checkpoints: { include: { photos: { take: 1 } }, orderBy: { order: "asc" } },
                            },
                            orderBy: { order: "asc" },
                        },
                    },
                },
                guide: {
                    select: { id: true, name: true, slug: true, avatarUrl: true, bio: true, verificationLevel: true, zone: true },
                },
                timeSlots: {
                    where: { date: { gte: new Date() }, status: "AVAILABLE" },
                    take: 5, orderBy: { date: "asc" },
                },
            },
        })
    },
    ["route-detail"],
    { revalidate: 300 }
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const activity = await getActivity(id)
    if (!activity) return { title: "Ruta no encontrada" }
    return { title: `${activity.title} | PATHY`, description: activity.description?.slice(0, 160) }
}

export default async function RutaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const activity = await getActivity(id)
    if (!activity) notFound()
    return <RouteDetail activity={activity} />
}
