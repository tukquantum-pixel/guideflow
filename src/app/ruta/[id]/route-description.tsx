import { CheckIcon, EditIcon } from "@/components/icons"

export function RouteDescription({ description, includes, whatToBring }: { description: string | null; includes: string | null; whatToBring: string | null }) {
    if (!description && !includes && !whatToBring) return null

    return (
        <div className="space-y-6">
            {description && (
                <div className="bg-white border border-roca-dark/15 rounded-xl p-6">
                    <h2 className="font-semibold text-pizarra text-lg mb-3 flex items-center gap-2"><EditIcon className="w-5 h-5" /> Descripción</h2>
                    <p className="text-granito leading-relaxed whitespace-pre-line">{description}</p>
                </div>
            )}
            {includes && (
                <div className="bg-musgo/5 border border-musgo/20 rounded-xl p-6">
                    <h2 className="font-semibold text-pizarra text-lg mb-3 flex items-center gap-2"><CheckIcon className="w-5 h-5 text-musgo" /> Incluye</h2>
                    <ul className="space-y-1.5">
                        {includes.split("\n").filter(Boolean).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-granito"><span className="text-musgo mt-0.5">✓</span>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
            {whatToBring && (
                <div className="bg-lago/5 border border-lago/20 rounded-xl p-6">
                    <h2 className="font-semibold text-pizarra text-lg mb-3 flex items-center gap-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v6h.01L10 12l-3.99 4H6v6" /><path d="M18 2v6h-.01L14 12l3.99 4H18v6" /></svg> Qué llevar</h2>
                    <ul className="grid md:grid-cols-2 gap-1.5">
                        {whatToBring.split("\n").filter(Boolean).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-granito"><span className="text-lago mt-0.5">•</span>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
