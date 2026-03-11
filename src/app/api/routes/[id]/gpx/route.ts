import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const track = await prisma.track.findFirst({
            where: { activity: { id, active: true } },
            select: { gpxData: true, name: true },
        })
        if (!track?.gpxData) return NextResponse.json({ error: "GPX no disponible" }, { status: 404 })

        return new NextResponse(track.gpxData, {
            headers: {
                "Content-Type": "application/gpx+xml",
                "Content-Disposition": `attachment; filename="${encodeURIComponent(track.name || "ruta")}.gpx"`,
            },
        })
    } catch (error) {
        console.error("[GPX_DOWNLOAD] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
