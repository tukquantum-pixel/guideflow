import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

// Create PaymentIntent for a booking
export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json()
        if (!bookingId) return NextResponse.json({ error: "bookingId requerido" }, { status: 400 })

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                timeSlot: { include: { activity: { include: { guide: true } } } },
                payment: true,
            },
        })

        if (!booking) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
        if (booking.payment?.status === "SUCCEEDED") {
            return NextResponse.json({ error: "Ya pagada" }, { status: 400 })
        }

        const guide = booking.timeSlot.activity.guide
        if (!guide.stripeAccountId || guide.stripeStatus !== "ACTIVE") {
            return NextResponse.json({ error: "Guía sin Stripe conectado" }, { status: 400 })
        }

        const amountCents = booking.timeSlot.activity.priceCents * booking.numPeople
        const platformFeeCents = Math.round(amountCents * 0.05) // 5% platform fee

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountCents,
            currency: "eur",
            application_fee_amount: platformFeeCents,
            transfer_data: { destination: guide.stripeAccountId },
            metadata: { bookingId: booking.id, guideId: guide.id },
        })

        // Create or update payment record
        await prisma.payment.upsert({
            where: { bookingId: booking.id },
            create: {
                bookingId: booking.id,
                stripePaymentId: paymentIntent.id,
                amountCents,
                platformFeeCents,
                status: "PENDING",
            },
            update: {
                stripePaymentId: paymentIntent.id,
                amountCents,
                platformFeeCents,
            },
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret, amount: amountCents })
    } catch (error) {
        console.error("[PAYMENT_INTENT]", error)
        return NextResponse.json({ error: "Error creando pago" }, { status: 500 })
    }
}
