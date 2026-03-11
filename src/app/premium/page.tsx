"use client"

import { PremiumHero } from "./hero"
import { PlanCard } from "./plan-card"
import { ComparisonTable } from "./comparison-table"
import { CtaSection } from "./cta-section"
import { plans, comparisonRows } from "./data"
import { Plan } from "./types"

async function handleSelect(plan: Plan) {
    if (!plan.apiPlan) { window.location.href = "/registrarse"; return }
    try {
        const res = await fetch("/api/user/subscription", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: plan.apiPlan }),
        })
        const data = await res.json()
        if (data.url) window.location.href = data.url
        else alert(data.error || "Error al procesar la suscripción")
    } catch { alert("Error de conexión") }
}

export default function PremiumPage() {
    return (
        <main className="min-h-screen bg-niebla">
            <PremiumHero />
            <section id="planes" className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
                {plans.map(p => <PlanCard key={p.id} plan={p} onSelect={handleSelect} />)}
            </section>
            <ComparisonTable rows={comparisonRows} />
            <CtaSection />
        </main>
    )
}
