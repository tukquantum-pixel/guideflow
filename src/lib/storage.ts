import { writeFile, unlink, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export async function uploadFile(buffer: Buffer, folder: string, _mimeType: string, ext: string): Promise<string> {
    const dir = path.join(UPLOAD_DIR, folder)
    await mkdir(dir, { recursive: true })
    const filename = `${randomUUID()}.${ext}`
    await writeFile(path.join(dir, filename), buffer)
    return `${BASE_URL}/uploads/${folder}/${filename}`
}

export async function deleteFile(url: string): Promise<void> {
    const relative = url.replace(BASE_URL, "").replace(/^\/uploads\//, "")
    const filePath = path.join(UPLOAD_DIR, relative)
    try { await unlink(filePath) } catch { /* file may not exist */ }
}

export function getPublicUrl(key: string): string {
    return `${BASE_URL}/uploads/${key}`
}
