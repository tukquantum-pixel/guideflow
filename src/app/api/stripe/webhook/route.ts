import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")

    if (!sig) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    try {
        const event = stripe.webhooks.constructEvent(
            body, sig, process.env.STRIPE_WEBHOOK_SECRET!
        )

        switch (event.type) {
            case "account.updated": {
                const account = event.data.object as { metadata?: { guideId?: string }; charges_enabled?: boolean }
                const guideId = account.metadata?.guideId
                if (guideId && account.charges_enabled) {
                    await prisma.guide.update({
                        where: { id: guideId },
                        data: { stripeStatus: "ACTIVE" },
                    })
                }
                break
            }

            case "payment_intent.succeeded": {
                const pi = event.data.object as { id: string; metadata?: { bookingId?: string } }
                const bookingId = pi.metadata?.bookingId
                if (bookingId) {
                    await prisma.payment.update({
                        where: { bookingId },
                        data: { status: "SUCCEEDED", stripePaymentId: pi.id },
                    })
                    await prisma.booking.update({
                        where: { id: bookingId },
                        data: { status: "CONFIRMED" },
                    })
                }
                break
            }

            case "payment_intent.payment_failed": {
                const pi = event.data.object as { id: string; metadata?: { bookingId?: string } }
                const bookingId = pi.metadata?.bookingId
                if (bookingId) {
                    await prisma.payment.update({
                        where: { bookingId },
                        data: { status: "FAILED" },
                    })
                    // Release the slot
                    const booking = await prisma.booking.findUnique({
                        where: { id: bookingId },
                        select: { numPeople: true, timeSlotId: true },
                    })
                    if (booking) {
                        await prisma.timeSlot.update({
                            where: { id: booking.timeSlotId },
                            data: {
                                spotsRemaining: { increment: booking.numPeople },
                                status: "AVAILABLE",
                            },
                        })
                        await prisma.booking.update({
                            where: { id: bookingId },
                            data: { status: "CANCELLED" },
                        })
                    }
                }
                break
            }

            case "checkout.session.completed": {
                const cs = event.data.object as { metadata?: { userId?: string; plan?: string }; subscription?: string }
                const userId = cs.metadata?.userId
                const plan = cs.metadata?.plan
                if (userId && plan && (plan === "EXPLORER" || plan === "PEAK")) {
                    await prisma.appUser.update({
                        where: { id: userId },
                        data: { plan, stripeSubId: cs.subscription as string },
                    })
                }
                break
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("[STRIPE_WEBHOOK] Error:", error)
        return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }
}
