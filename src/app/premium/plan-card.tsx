"use client"

import { Plan } from "./types"

function Cell({ included }: { included: boolean }) {
    return <span className={included ? "text-musgo font-bold" : "text-granito-light"}>
        {included ? "✓" : "—"}
    </span>
}

export function PlanCard({ plan, onSelect }: { plan: Plan; onSelect: (plan: Plan) => void }) {
    const ring = plan.popular ? "ring-2 ring-musgo shadow-lg scale-[1.02]" : "border border-roca-dark/30"
    const bg = plan.id === "free" ? "bg-white" : plan.popular ? "bg-white" : "bg-gradient-to-br from-pizarra to-pizarra-light text-white"
    const faded = plan.id === "peak" ? "text-white/60" : "text-granito"

    return (
        <div className={`${bg} ${ring} rounded-2xl p-6 flex flex-col relative transition-all hover:shadow-xl`}>
            {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-musgo text-white text-xs font-bold px-3 py-1 rounded-full">
                    MÁS POPULAR
                </span>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price === 0 ? "Gratis" : `${plan.price}€`}</span>
                {plan.price > 0 && <span className={`text-sm ml-1 ${faded}`}>/{plan.interval}</span>}
            </div>
            <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map(f => (
                    <li key={f.name} className="flex items-start gap-2 text-sm">
                        <Cell included={f.included} />
                        <div>
                            <span>{f.name}</span>
                            {f.description && <p className={`text-xs ${faded} mt-0.5`}>{f.description}</p>}
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={() => onSelect(plan)} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "bg-musgo hover:bg-musgo-dark text-white" : plan.id === "peak" ? "bg-white text-pizarra hover:bg-roca" : "bg-pizarra hover:bg-pizarra-light text-white"}`}>
                {plan.cta}
            </button>
        </div>
    )
}
