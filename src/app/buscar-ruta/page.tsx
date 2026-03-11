import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExplorarRutasClient } from "./buscar-ruta-client"
import { NavBar } from "@/components/nav-bar"
import { Suspense } from "react"

export const metadata = { title: "Explorador de Rutas GR/PR/SL | PATHY", description: "Explora las rutas oficiales de senderismo de toda España" }

export default async function BuscarRutaPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/entrar?callbackUrl=/buscar-ruta")

    return (
        <>
            <Suspense fallback={<nav className="bg-white py-4 border-b" />}>
                <NavBar variant="light" />
            </Suspense>
            <ExplorarRutasClient />
        </>
    )
}
