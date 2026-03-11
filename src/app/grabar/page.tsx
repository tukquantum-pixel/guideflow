import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { GrabarClient } from "./grabar-client"

export const metadata = { title: "Grabar Ruta | PATHY" }

export default async function GrabarPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/grabar")

    const userName = session.user.name || "Explorador"
    return <GrabarClient userName={userName} />
}
