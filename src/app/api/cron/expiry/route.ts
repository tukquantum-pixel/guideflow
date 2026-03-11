import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendEmail, expiryReminderHtml, suspensionHtml } from "@/lib/email"

// Cron endpoint: check expired credentials, send reminders, auto-suspend
// Call daily at 02:00 via Vercel Cron or external scheduler
// Auth via CRON_SECRET header
export async function GET(req: Request) {
    try {
        const secret = req.headers.get("authorization")
        if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const now = new Date()
        let suspended = 0
        let emailsSent = 0

        // 1. EXPIRED: Mark APPROVED credentials that have expired
        const expired = await prisma.credential.findMany({
            where: { expiryDate: { lt: now }, status: "APPROVED" },
            include: { guide: { select: { id: true, name: true, email: true } } },
        })

        // Group expired by guide for single email
        const expiredByGuide = new Map<string, { guide: { id: string; name: string; email: string }; docs: { name: string; type: string }[] }>()

        for (const cred of expired) {
            await prisma.credential.update({ where: { id: cred.id }, data: { status: "EXPIRED" } })

            if (cred.type === "SEGURO" || cred.type === "TITULO") {
                await prisma.guide.update({
                    where: { id: cred.guideId },
                    data: { marketplaceEnabled: false, verificationLevel: "PENDING" },
                })
                suspended++
            }

            if (!expiredByGuide.has(cred.guideId)) {
                expiredByGuide.set(cred.guideId, { guide: cred.guide, docs: [] })
            }
            expiredByGuide.get(cred.guideId)!.docs.push({ name: cred.name, type: cred.type })
        }

        // Send suspension emails (1 per guide, grouped)
        for (const [, { guide, docs }] of expiredByGuide) {
            await sendEmail({
                to: guide.email,
                subject: "🔴 PATHY: Documentos caducados — Cuenta suspendida del marketplace",
                html: suspensionHtml(guide.name, docs),
            })
            emailsSent++
        }

        // 2. REMINDERS: 60, 30, 15 days before expiry
        for (const daysLeft of [60, 30, 15]) {
            const targetDate = new Date(now)
            targetDate.setDate(targetDate.getDate() + daysLeft)
            const nextDay = new Date(targetDate)
            nextDay.setDate(nextDay.getDate() + 1)

            const expiring = await prisma.credential.findMany({
                where: {
                    expiryDate: { gte: targetDate, lt: nextDay },
                    status: "APPROVED",
                },
                include: { guide: { select: { id: true, name: true, email: true } } },
            })

            // Group by guide
            const byGuide = new Map<string, { guide: { name: string; email: string }; docs: { name: string; type: string; expiryDate: string }[] }>()
            for (const cred of expiring) {
                if (!byGuide.has(cred.guideId)) {
                    byGuide.set(cred.guideId, { guide: cred.guide, docs: [] })
                }
                byGuide.get(cred.guideId)!.docs.push({
                    name: cred.name, type: cred.type,
                    expiryDate: cred.expiryDate!.toISOString(),
                })
            }

            for (const [, { guide, docs }] of byGuide) {
                await sendEmail({
                    to: guide.email,
                    subject: `🔔 PATHY: Tus documentos caducan en ${daysLeft} días`,
                    html: expiryReminderHtml(guide.name, docs, daysLeft),
                })
                emailsSent++
            }
        }

        const summary = {
            timestamp: now.toISOString(),
            expiredProcessed: expired.length,
            guidesSuspended: suspended,
            emailsSent,
        }

        console.log("[CRON_EXPIRY]", JSON.stringify(summary))
        return NextResponse.json(summary)
    } catch (error) {
        console.error("[CRON_EXPIRY] Error:", error)
        return NextResponse.json({ error: "Error en cron" }, { status: 500 })
    }
}
