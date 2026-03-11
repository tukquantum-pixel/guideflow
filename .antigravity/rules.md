# Reglas del Agente — GuideFlow

## Identidad

- **Proyecto:** GuideFlow — Reservas de marca blanca para guías outdoor
- **Dominio:** Fábrica de Software (Dominio 2)

## Stack

- Next.js 15 (App Router)
- PostgreSQL 16 (Docker)
- Prisma ORM
- Auth.js (NextAuth) — JWT + Google OAuth
- Stripe Connect (Express)
- Resend (email transaccional)
- Tailwind CSS
- Docker Compose
- VPS Hetzner

## Reglas de código

- Máximo 20 líneas por archivo
- Una función, un propósito
- Try-catch en toda función async
- Archivos index.ts para re-exports
- Nombres descriptivos

## Documentación

Toda la documentación en `/docs`.
Punto de entrada: `docs/00-project-overview/00.1-what-are-we-building.md`
