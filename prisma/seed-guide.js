// Seed realistic data for guide "Soluciones"
const { PrismaClient } = require("@prisma/client")
const p = new PrismaClient()

async function main() {
    // Find existing guide
    const guide = await p.guide.findFirst({ where: { slug: "soluciones" } })
    if (!guide) { console.log("Guide not found"); return }
    console.log("Found guide:", guide.id, guide.name)

    // 1. Update guide profile
    await p.guide.update({
        where: { id: guide.id },
        data: {
            name: "Javier Martínez",
            bio: "Guía de montaña con 8 años de experiencia en el Pirineo aragonés. Especialista en escalada deportiva, barranquismo y senderismo de alta montaña. Apasionado de la fotografía de naturaleza y la enseñanza al aire libre. Mi objetivo es que cada salida sea segura, divertida y memorable.",
            zone: "Sierra de Guara, Huesca",
            phone: "+34600123456",
            languages: ["Español", "Inglés", "Francés"],
            yearsExperience: 8,
            certifications: "TD Media Montaña, Guía de Escalada, Rescate en Montaña, Primeros Auxilios Cruz Roja",
            professionType: "guia_montana",
            professionCategory: "montana",
            specializations: ["Escalada", "Barranquismo", "Senderismo", "Fotografía"],
            verificationLevel: "VERIFIED",
        },
    })
    console.log("✅ Guide profile updated")

    // 2. Delete old activities
    await p.activity.deleteMany({ where: { guideId: guide.id } })
    console.log("🗑️ Old activities deleted")

    // 3. Create 3 realistic activities
    const act1 = await p.activity.create({
        data: {
            guideId: guide.id,
            title: "Escalada en los Mallos de Riglos",
            description: "Jornada completa de escalada en los impresionantes Mallos de Riglos, columnas de conglomerado de hasta 300m. Vías para todos los niveles, desde iniciación (IV) hasta avanzado (6c). Equipo completo incluido.",
            priceCents: 6000,
            durationMinutes: 480,
            maxParticipants: 4,
            category: "climbing",
            difficulty: "MEDIUM",
            meetingPoint: "Parking de Riglos, Huesca",
            meetingLat: 42.3532,
            meetingLng: -0.7281,
            includes: "Equipo de escalada completo\nCasco y arnés\nCuerda y material de seguridad\nFotos de la jornada\nSeguro de accidentes",
            whatToBring: "Calzado de montaña\nRopa cómoda y deportiva\nAgua (mínimo 1.5L)\nProtección solar\nAlmuerzo tipo bocadillo",
            photos: [
                "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80",
                "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
            ],
        },
    })

    const act2 = await p.activity.create({
        data: {
            guideId: guide.id,
            title: "Senderismo Cañón del Río Vero",
            description: "Ruta de senderismo por el espectacular Cañón del Río Vero, Patrimonio de la Humanidad por sus pinturas rupestres. Ideal para familias y grupos. Recorrido por senderos bien señalizados con paradas en miradores y cuevas con arte prehistórico.",
            priceCents: 3500,
            durationMinutes: 240,
            maxParticipants: 10,
            category: "hiking",
            difficulty: "LOW",
            meetingPoint: "Centro de visitantes de Colungo, Huesca",
            meetingLat: 42.2189,
            meetingLng: 0.0661,
            includes: "Guía profesional titulado\nSeguro de responsabilidad civil\nExplicaciones sobre fauna, flora y patrimonio\nMapa de la ruta",
            whatToBring: "Calzado de senderismo\nAgua (1L mínimo)\nProtección solar y gorra\nSnack o almuerzo\nCámara de fotos",
            photos: [
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
            ],
        },
    })

    const act3 = await p.activity.create({
        data: {
            guideId: guide.id,
            title: "Barranquismo en Sierra de Guara",
            description: "Descenso de barrancos en la Sierra de Guara, cuna del barranquismo europeo. Toboganes naturales, saltos al agua y rápeles en un entorno natural impresionante. Nivel medio-alto, se requiere saber nadar. ¡Adrenalina pura en aguas cristalinas!",
            priceCents: 7500,
            durationMinutes: 360,
            maxParticipants: 6,
            category: "kayak",
            difficulty: "HIGH",
            meetingPoint: "Alquézar, Huesca",
            meetingLat: 42.1741,
            meetingLng: 0.0261,
            includes: "Neopreno completo\nCasco y arnés de barrancos\nEquipo de rápel\nFotos y vídeo subacuático\nSeguro de accidentes",
            whatToBring: "Bañador debajo del neopreno\nCalzado que se pueda mojar (no chanclas)\nToalla para después\nCambio de ropa seca\nAlmuerzo y agua",
            photos: [
                "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
                "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
            ],
        },
    })
    console.log("✅ 3 activities created:", act1.id, act2.id, act3.id)

    // 4. Create time slots (next 2 weeks)
    const today = new Date()
    for (const act of [act1, act2, act3]) {
        for (let d = 1; d <= 14; d++) {
            if (d % 2 === 0 || d % 3 === 0) { // Some days available
                const date = new Date(today)
                date.setDate(today.getDate() + d)
                date.setHours(0, 0, 0, 0)
                await p.timeSlot.create({
                    data: {
                        activityId: act.id,
                        date: date,
                        startTime: d % 3 === 0 ? "09:00" : "10:00",
                        spotsRemaining: act.maxParticipants - Math.floor(Math.random() * 3),
                    },
                })
            }
        }
    }
    console.log("✅ Time slots created")

    // 5. Create credentials
    await p.credential.deleteMany({ where: { guideId: guide.id } })
    const creds = [
        { type: "TITULO", name: "Técnico Deportivo en Media Montaña", issuingBody: "Escuela Española de Alta Montaña", documentUrl: "/docs/tdmm.pdf", status: "APPROVED" },
        { type: "TITULO", name: "Guía de Escalada", issuingBody: "Federación Aragonesa de Montañismo", documentUrl: "/docs/escalada.pdf", status: "APPROVED" },
        { type: "TITULO", name: "Rescate en Montaña", issuingBody: "GREIM - Guardia Civil", documentUrl: "/docs/rescate.pdf", status: "APPROVED" },
        { type: "SEGURO", name: "RC Profesional", issuingBody: "Mapfre", documentUrl: "/docs/seguro.pdf", coverageAmount: 600000, status: "APPROVED" },
    ]
    for (const c of creds) {
        await p.credential.create({ data: { guideId: guide.id, ...c } })
    }
    console.log("✅ 4 credentials created")

    // 6. Create reviews
    await p.review.deleteMany({ where: { guideId: guide.id } })
    const reviews = [
        { clientName: "Carlos García", rating: 5, comment: "Una experiencia increíble en Riglos. Javier es muy profesional y cercano. Nos hizo sentir seguros en todo momento. ¡Repetiremos seguro!", verified: true },
        { clientName: "Ana López", rating: 5, comment: "Hicimos la ruta de senderismo con mis hijos de 8 y 10 años. Lo pasaron genial. Las explicaciones sobre las pinturas rupestres fueron fascinantes.", verified: true },
        { clientName: "Miguel Torres", rating: 4, comment: "Muy buena experiencia de barranquismo. Los toboganes naturales son impresionantes. Solo le pongo un 4 porque hacía un poco de frío, pero eso no es culpa de Javier 😄", verified: true },
        { clientName: "Laura Fernández", rating: 5, comment: "El mejor guía que hemos tenido. Conoce cada rincón de la Sierra de Guara. Las fotos que nos hizo durante la escalada son espectaculares.", verified: true },
        { clientName: "David Ruiz", rating: 5, comment: "Fuimos un grupo de 4 amigos a escalar y fue una experiencia inolvidable. Javier adapta el nivel a cada uno. Muy recomendable.", verified: true },
    ]
    for (let i = 0; i < reviews.length; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (i * 15 + 5)) // Spread reviews over past months
        await p.review.create({ data: { guideId: guide.id, ...reviews[i], createdAt: d } })
    }
    console.log("✅ 5 reviews created")

    console.log("\n🎉 DONE! Visit /soluciones to see the full profile")
}

main().catch(console.error).finally(() => p.$disconnect())
