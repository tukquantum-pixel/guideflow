import Link from "next/link"
import type { Guide } from "./types"
import { CheckIcon, PinIcon } from "@/components/icons"

export function GuideCard({ guide }: { guide: Guide }) {
    return (
        <div className="bg-gradient-to-br from-white to-musgo/5 border border-roca-dark/15 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full bg-musgo/10 overflow-hidden ring-2 ring-musgo/20">
                    {guide.avatarUrl ? <img src={guide.avatarUrl} className="w-full h-full object-cover" alt={guide.name} /> :
                        <span className="flex items-center justify-center h-full text-xl font-bold text-musgo">{guide.name[0]}</span>}
                </div>
                <div>
                    <p className="font-semibold text-pizarra text-lg">{guide.name} {guide.verificationLevel === "VERIFIED" && <CheckIcon className="w-4 h-4 inline text-musgo" />}</p>
                    {guide.zone && <p className="text-xs text-granito flex items-center gap-1"><PinIcon className="w-3 h-3" /> {guide.zone}</p>}
                </div>
            </div>
            {guide.bio && <p className="text-sm text-granito line-clamp-3 leading-relaxed">{guide.bio}</p>}
            <Link href={`/${guide.slug}`} className="block mt-3 text-sm text-lago hover:text-lago-dark font-medium transition">
                Ver perfil completo →
            </Link>
        </div>
    )
}
