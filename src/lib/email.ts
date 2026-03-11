// Email service using Resend
// Fallback: console.log if RESEND_API_KEY not set

interface EmailOptions {
    to: string
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === "re_PLACEHOLDER") {
        console.log(`[EMAIL_MOCK] To: ${to} | Subject: ${subject}`)
        return true
    }

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: "PATHY <notificaciones@PATHY.com>",
                to: [to],
                subject,
                html,
            }),
        })
        if (!res.ok) console.error("[EMAIL] Error:", await res.text())
        return res.ok
    } catch (error) {
        console.error("[EMAIL] Send failed:", error)
        return false
    }
}

export function expiryReminderHtml(name: string, docs: { name: string; type: string; expiryDate: string }[], daysLeft: number) {
    const urgency = daysLeft <= 15 ? "🔴 URGENTE" : daysLeft <= 30 ? "🟡 Importante" : "🔵 Recordatorio"
    const docList = docs.map(d => `<li><strong>${d.name}</strong> (${d.type}) — caduca el ${new Date(d.expiryDate).toLocaleDateString("es-ES")}</li>`).join("")

    return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#2d4a22">🏔️ PATHY</h2>
        <p style="font-size:14px;color:#666">${urgency}</p>
        <h3>Hola ${name},</h3>
        <p>Los siguientes documentos caducan en <strong>${daysLeft} días</strong>:</p>
        <ul>${docList}</ul>
        <p>Para seguir apareciendo en el marketplace y recibir reservas, renueva tus documentos:</p>
        <p><a href="https://app.PATHY.com/dashboard/profile" style="display:inline-block;background:#2d4a22;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">📤 Subir nuevo documento</a></p>
        <p style="font-size:12px;color:#999;margin-top:32px">Si ya renovaste, ignora este mensaje. Se actualizará al aprobar tus nuevos documentos.</p>
        <p style="font-size:12px;color:#999">— Equipo PATHY</p>
    </div>`
}

export function suspensionHtml(name: string, docs: { name: string; type: string }[]) {
    const docList = docs.map(d => `<li><strong>${d.name}</strong> (${d.type})</li>`).join("")
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#2d4a22">🏔️ PATHY</h2>
        <p style="font-size:14px;color:#d32f2f">🔴 Cuenta suspendida del marketplace</p>
        <h3>Hola ${name},</h3>
        <p>Los siguientes documentos han caducado:</p>
        <ul>${docList}</ul>
        <p>Tu perfil ya <strong>no aparece en las búsquedas</strong> del marketplace. Para reactivarlo:</p>
        <ol>
            <li>Renueva los documentos caducados</li>
            <li>Súbelos a tu perfil</li>
            <li>Nuestro equipo los verificará en 48-72h</li>
        </ol>
        <p><a href="https://app.PATHY.com/dashboard/profile" style="display:inline-block;background:#2d4a22;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">📤 Subir documentos renovados</a></p>
        <p style="font-size:12px;color:#999">— Equipo PATHY</p>
    </div>`
}
