import { prisma } from "./db"

export async function generateUniqueSlug(
    name: string
): Promise<string> {
    const base = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    let slug = base
    let counter = 1

    while (await prisma.guide.findUnique({ where: { slug } })) {
        slug = `${base}-${counter}`
        counter++
    }

    return slug
}
