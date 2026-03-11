import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from "crypto"

const BUCKET = process.env.S3_BUCKET || "PATHY-uploads"
const REGION = process.env.S3_REGION || "auto"

const client = new S3Client({
    region: REGION,
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: process.env.S3_ACCESS_KEY ? {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    } : undefined,
    forcePathStyle: !!process.env.S3_ENDPOINT,
})

export async function uploadFile(buffer: Buffer, folder: string, mimeType: string, ext: string): Promise<string> {
    const key = `${folder}/${randomUUID()}.${ext}`
    await client.send(new PutObjectCommand({
        Bucket: BUCKET, Key: key, Body: buffer,
        ContentType: mimeType, CacheControl: "public, max-age=31536000",
    }))
    if (process.env.S3_PUBLIC_URL) return `${process.env.S3_PUBLIC_URL}/${key}`
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
}

export async function deleteFile(url: string): Promise<void> {
    const key = url.split("/").slice(3).join("/")
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

export async function getPresignedUploadUrl(folder: string, ext: string): Promise<{ url: string; key: string }> {
    const key = `${folder}/${randomUUID()}.${ext}`
    const url = await getSignedUrl(client, new PutObjectCommand({
        Bucket: BUCKET, Key: key, ContentType: `image/${ext}`,
    }), { expiresIn: 600 })
    return { url, key }
}

export function getPublicUrl(key: string): string {
    if (process.env.S3_PUBLIC_URL) return `${process.env.S3_PUBLIC_URL}/${key}`
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
}
