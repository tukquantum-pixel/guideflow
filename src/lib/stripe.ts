import Stripe from "stripe"

let _stripe: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
    get(_target, prop) {
        if (!_stripe) {
            _stripe = new Stripe(
                process.env.STRIPE_SECRET_KEY || "sk_placeholder",
                { apiVersion: "2026-02-25.clover" as any }
            )
        }
        return (_stripe as any)[prop]
    }
})
