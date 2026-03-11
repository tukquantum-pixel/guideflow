import { NextRequest, NextResponse } from "next/server"
import { userAuth } from "@/lib/user-auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

const PRICES = {
    EXPLORER: { amount: 999, name: "PATHY Explorer", interval: "year" as const },
    PEAK: { amount: 1999, name: "PATHY Peak", interval: "year" as const },
}

export async function POST(req: NextRequest) {
    try {
        const session = await userAuth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { plan } = await req.json()
        if (!plan || !PRICES[plan as keyof typeof PRICES]) {
            return NextResponse.json({ error: "Plan inválido" }, { status: 400 })
        }

        const user = await prisma.appUser.findUnique({ where: { id: session.user.id } })
        if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
        if (user.plan === plan) return NextResponse.json({ error: "Ya tienes este plan" }, { status: 400 })

        // Create or reuse Stripe customer
        let customerId = user.stripeCustomerId
        if (!customerId) {
            const customer = await stripe.customers.create({ email: user.email, name: user.name, metadata: { userId: user.id } })
            customerId = customer.id
            await prisma.appUser.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
        }

        const priceInfo = PRICES[plan as keyof typeof PRICES]
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            line_items: [{ price_data: { currency: "eur", unit_amount: priceInfo.amount, recurring: { interval: priceInfo.interval }, product_data: { name: priceInfo.name } }, quantity: 1 }],
            success_url: `${process.env.NEXTAUTH_URL}/cuenta?upgraded=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cuenta`,
            metadata: { userId: user.id, plan },
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
        console.error("[SUBSCRIPTION]", error)
        return NextResponse.json({ error: "Error al crear suscripción" }, { status: 500 })
    }
}
