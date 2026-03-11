export interface PlanFeature {
    name: string
    included: boolean
    description?: string
}

export interface Plan {
    id: "free" | "explorer" | "peak"
    name: string
    price: number
    interval: string
    features: PlanFeature[]
    cta: string
    popular?: boolean
    apiPlan?: string
}

export interface ComparisonRow {
    name: string
    free: boolean | string
    explorer: boolean | string
    peak: boolean | string
}
