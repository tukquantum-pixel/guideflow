import { ComparisonRow } from "./types"

function Cell({ value }: { value: boolean | string }) {
    if (typeof value === "string") return <span className="text-sm">{value}</span>
    return <span className={value ? "text-musgo font-bold text-lg" : "text-granito-light"}>
        {value ? "✓" : "—"}
    </span>
}

export function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
    return (
        <section className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-center mb-8">Comparativa de planes</h2>
            <div className="overflow-x-auto rounded-2xl border border-roca-dark/20">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-roca text-pizarra">
                            <th className="text-left py-3 px-4 font-semibold">Funcionalidad</th>
                            <th className="text-center py-3 px-4 font-semibold">Gratis</th>
                            <th className="text-center py-3 px-4 font-semibold bg-musgo/10">Explorer</th>
                            <th className="text-center py-3 px-4 font-semibold">Peak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.name} className={i % 2 === 0 ? "bg-white" : "bg-niebla"}>
                                <td className="py-3 px-4 font-medium">{r.name}</td>
                                <td className="text-center py-3 px-4"><Cell value={r.free} /></td>
                                <td className="text-center py-3 px-4 bg-musgo/5"><Cell value={r.explorer} /></td>
                                <td className="text-center py-3 px-4"><Cell value={r.peak} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
