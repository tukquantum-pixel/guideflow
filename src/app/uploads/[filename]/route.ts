import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import fs from "fs"

export async function GET(req: NextRequest, props: { params: Promise<{ filename: string }> }) {
    try {
        const params = await props.params;
        const filename = params.filename
        if (!filename || filename.includes("..")) return new NextResponse("Not found", { status: 404 })
        
        const filePath = path.join(process.cwd(), "public", "uploads", filename)
        if (!fs.existsSync(filePath)) return new NextResponse("Not found", { status: 404 })
        
        const buffer = await readFile(filePath)
        const ext = path.extname(filename).toLowerCase()
        const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg"
        
        return new NextResponse(buffer, {
            headers: { 
                "Content-Type": mime, 
                "Cache-Control": "public, max-age=31536000, immutable" 
            }
        })
    } catch (error) {
        console.error("[SERVE_UPLOAD_ERROR]", error)
        return new NextResponse("Error rendering image", { status: 500 })
    }
}
