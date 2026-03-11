import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            )
        }

        const guide = await prisma.guide.findUnique({
            where: { id: session.user.id },
        })

        if (!guide) {
            return NextResponse.json(
                { error: "Guía no encontrado" },
                { status: 404 }
            )
        }

        const account = await stripe.accounts.create({
            type: "express",
            email: guide.email,
            metadata: { guideId: guide.id },
        })

        await prisma.guide.update({
            where: { id: guide.id },
            data: {
                stripeAccountId: account.id,
                stripeStatus: "ONBOARDING",
            },
        })

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXTAUTH_URL}/dashboard?stripe=retry`,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard?stripe=success`,
            type: "account_onboarding",
        })

        return NextResponse.json({ url: accountLink.url })
    } catch (error) {
        console.error("[STRIPE_CONNECT] Error:", error)
        return NextResponse.json(
            { error: "Error al conectar con Stripe" },
            { status: 500 }
        )
    }
}
