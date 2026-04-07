import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

// POST /api/stripe/checkout — Create Stripe Checkout Session for user subscription
export async function POST(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { plan, successUrl, cancelUrl } = await req.json()

        if (!plan || !["EXPLORER", "PEAK"].includes(plan)) {
            return NextResponse.json({ error: "Plan no válido (EXPLORER o PEAK)" }, { status: 400 })
        }

        const user = await prisma.appUser.findUnique({ where: { id: authed.id } })
        if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

        if (user.plan === plan) {
            return NextResponse.json({ error: `Ya tienes el plan ${plan}` }, { status: 400 })
        }

        // Price IDs from Stripe Dashboard (set via env vars)
        const priceId = plan === "EXPLORER"
            ? process.env.STRIPE_PRICE_EXPLORER
            : process.env.STRIPE_PRICE_PEAK

        if (!priceId) {
            return NextResponse.json({ error: "Precio no configurado" }, { status: 500 })
        }

        // Create or get Stripe customer
        let customerId = user.stripeCustomerId
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id },
            })
            customerId = customer.id
            await prisma.appUser.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: successUrl || `${process.env.NEXTAUTH_URL}/account?plan=success`,
            cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/account?plan=cancelled`,
            metadata: { userId: user.id, plan },
        })

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        })
    } catch (error) {
        console.error("[STRIPE_CHECKOUT] Error:", error)
        return NextResponse.json({ error: "Error creando sesión de pago" }, { status: 500 })
    }
}
