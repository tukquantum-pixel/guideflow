# Arquitectura Técnica del Marketplace

## Modelo de datos ampliado

### Cambios en Guide

```prisma
model Guide {
  // ... campos existentes
  serviceRadius      Float?    // Radio en km donde opera
  marketplaceEnabled Boolean   @default(false)
  marketplacePlan    String?   // "free_trial", "basic", "premium"
  certifications     String?   @db.Text  // Titulaciones (texto libre)
  yearsExperience    Int?
  location           Location?
  reviews            Review[]
}
```

### Nuevos modelos

```prisma
model Location {
  id        String   @id @default(uuid())
  guideId   String   @unique
  address   String
  lat       Float
  lng       Float
  city      String?
  region    String?
  country   String   @default("España")
  guide     Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  @@index([lat, lng])
}

model Review {
  id         String   @id @default(uuid())
  guideId    String
  clientName String
  clientEmail String?
  rating     Int      // 1-5
  comment    String?  @db.Text
  verified   Boolean  @default(false)
  createdAt  DateTime @default(now())
  guide      Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  @@index([guideId, rating])
}
```

## Búsqueda geográfica

### Fase 1: Sin PostGIS (MVP)

Búsqueda por texto (ciudad/región) con `WHERE region ILIKE '%pirineos%'`.
Simple, funciona para zona piloto.

### Fase 2: Con PostGIS

```sql
-- Buscar guías en radio de 20km desde coordenadas
SELECT g.*, 
       ST_Distance(
         ST_MakePoint(l.lng, l.lat)::geography,
         ST_MakePoint(:lng, :lat)::geography
       ) as distance_m
FROM "Guide" g
JOIN "Location" l ON l."guideId" = g.id
WHERE g."marketplaceEnabled" = true
  AND ST_DWithin(
      ST_MakePoint(l.lng, l.lat)::geography, 
      ST_MakePoint(:lng, :lat)::geography, 
      :radius_meters
  )
ORDER BY distance_m;
```

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/marketplace/search` | Buscar guías (texto/filtros) |
| GET | `/api/marketplace/search?lat=X&lng=Y&r=20` | Búsqueda geográfica |
| GET | `/api/marketplace/guide/[slug]` | Perfil público ampliado |
| POST | `/api/reviews` | Crear reseña |
| GET | `/api/reviews/[guideId]` | Listar reseñas de un guía |

## Páginas frontend

| Ruta | Descripción |
|------|-------------|
| `/buscar` | Página de búsqueda (lista + filtros) |
| `/buscar?map=true` | Vista mapa con pines |
| `/[slug]` | Perfil público mejorado (ya existe) |
