# Fase 0: Preparación para Marketplace

## Objetivo

Preparar la base de datos y perfiles para el marketplace **sin romper nada** de lo que ya funciona.

## Sprint actual: cambios incrementales

### 1. Ampliar modelo Guide

```diff
model Guide {
  // existente...
+ serviceRadius      Float?
+ marketplaceEnabled Boolean   @default(false)
+ certifications     String?   @db.Text
+ yearsExperience    Int?
}
```

### 2. Crear modelo Location

Separar ubicación del guía (distinta al meetingPoint de actividades).

```prisma
model Location {
  id       String @id @default(uuid())
  guideId  String @unique
  address  String
  lat      Float
  lng      Float
  city     String?
  region   String?
  country  String @default("España")
  guide    Guide  @relation(...)
}
```

### 3. Mejorar perfil del guía

- Añadir campos: certificaciones, años experiencia, radio servicio
- Actualizar formulario de perfil con nuevos campos
- Actualizar página pública para mostrar certificaciones

### 4. Crear modelo Review (estructura preparada)

No se usa todavía, pero el modelo queda listo.

## Checklist

- [ ] Ampliar schema.prisma con nuevos campos Guide
- [ ] Crear modelo Location
- [ ] Crear modelo Review
- [ ] Migrar base de datos
- [ ] Actualizar formulario de perfil
- [ ] Actualizar página pública con nuevos campos
- [ ] Verificar build

## Lo que NO hacemos en Fase 0

- No creamos página de búsqueda
- No instalamos PostGIS
- No implementamos planes de pago marketplace
- No cambiamos el modelo de negocio actual
