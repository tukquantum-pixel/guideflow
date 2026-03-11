import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const guide = await prisma.guide.findUnique({
        where: { id: session.user.id },
        select: { name: true, slug: true, bio: true, zone: true, phone: true, languages: true, avatarUrl: true, certifications: true, yearsExperience: true, serviceRadius: true, marketplaceEnabled: true },
    })

    if (!guide) redirect("/login")

    return <ProfileForm guide={guide} />
}
