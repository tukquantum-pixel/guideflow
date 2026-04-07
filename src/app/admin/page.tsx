export const dynamic = "force-dynamic"
﻿import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { AdminPanel } from "./admin-panel"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean)

export const metadata = { title: "Panel de Revisión | PATHY Admin" }

export default async function AdminPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const guide = await prisma.guide.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true },
    })
    if (!guide || !ADMIN_EMAILS.includes(guide.email)) redirect("/dashboard")

    const stats = await prisma.credential.groupBy({
        by: ["status"],
        _count: true,
    })

    const statusCounts = Object.fromEntries(stats.map(s => [s.status, s._count]))

    return <AdminPanel adminName={guide.name} statusCounts={statusCounts} />
}
