# 📋 PLAN DE ACCIÓN INTEGRAL: GUIDEFLOW

| Metadata | Valor |
|----------|-------|
| Versión | 1.0 |
| Fecha | 2026-03-08 |
| Estado | Aprobado |
| Documentación base | `docs/feature-premium/` (42 files) + `docs/performance-optimization/` (64 files) |

---

## 🎯 Resumen Ejecutivo

| Fase | Nombre | Duración | Objetivo | Estado |
|------|--------|----------|----------|--------|
| **0** | Fundación Premium | 1 semana | Documentación + UI de precios | ✅ Completada |
| **1** | Optimización Base | 2 semanas | Hacer que todo vuele | ⬜ Pendiente |
| **2** | Premium Explorer | 3 meses | MVP funcionalidades premium | ⬜ Pendiente |
| **3** | Premium Peak | 3 meses | Funcionalidades avanzadas | ⬜ Pendiente |
| **4** | Optimización Continua | Siempre | Monitorizar y ajustar | ⬜ Pendiente |

---

## 📊 Tabla de Prioridades — Todas las Tareas

### 🔴 URGENTE — Semana 1

| # | Tarea | Equipo | Doc relacionada | Tiempo |
|---|-------|--------|-----------------|--------|
| 1 | Migrar `PRO` → `PEAK` en schema | Backend | [05.2-plan-peak.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/05-modelo-suscripcion/05.2-plan-peak.md) | 1 día |
| 2 | Crear env vars Stripe (EXPLORER/PEAK price IDs) | Backend | [05.5-stripe-integracion.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/05-modelo-suscripcion/05.5-stripe-integracion.md) | 0.5 día |
| 3 | Añadir índices faltantes (PostGIS, búsqueda) | DBA | [02.2-indexes-masterclass.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/02-backend/02.2-indexes-masterclass.md) | 1 día |
| 4 | Configurar Core Web Vitals + Speed Insights | Frontend | [01.1-core-web-vitals.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/01-frontend/01.1-core-web-vitals.md) | 1 día |
| 5 | Implementar rate limiting (Upstash) | Backend | [02.6-rate-limiting-avanzado.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/02-backend/02.6-rate-limiting-avanzado.md) | 1 día |

### 🟡 PRIORIDAD ALTA — Semana 2-3

| # | Tarea | Equipo | Doc relacionada | Tiempo |
|---|-------|--------|-----------------|--------|
| 6 | Configurar Redis (Upstash) + cache-aside | Backend | [05.1-redis-estrategia.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/05-caching/05.1-redis-estrategia.md) | 2 días |
| 7 | Image CDN (Cloudflare Images / Cloudinary) | Frontend | [01.3-image-optimization.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/01-frontend/01.3-image-optimization.md) | 2 días |
| 8 | Code splitting (MapView, Stripe, heavy libs) | Frontend | [01.2-code-splitting.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/01-frontend/01.2-code-splitting.md) | 2 días |
| 9 | Optimizar top-10 queries más lentas | Backend | [02.1-query-optimization.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/02-backend/02.1-query-optimization.md) | 3 días |
| 10 | Monitorización (Prometheus + Grafana Cloud) | DevOps | [07.1-metrics-clave.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/07-monitoreo/07.1-metrics-clave.md) | 2 días |
| 11 | Webhook handlers (subscription.deleted, updated) | Backend | [05.5-stripe-integracion.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/05-modelo-suscripcion/05.5-stripe-integracion.md) | 1 día |
| 12 | Docker multi-stage optimizado | DevOps | [04.1-docker-optimization.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/04-infraestructura/04.1-docker-optimization.md) | 1 día |

### 🟢 PRIORIDAD MEDIA — Mes 2-3 (Premium Explorer MVP)

| # | Tarea | Equipo | Doc relacionada | Tiempo |
|---|-------|--------|-----------------|--------|
| 13 | Mapas offline (download + storage) | App/Backend | [01.2-mapas-offline.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/01-navegacion-seguridad/01.2-mapas-offline.md) | 3 sem |
| 14 | Alertas de desvío GPS | App | [01.1-alertas-desvio.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/01-navegacion-seguridad/01.1-alertas-desvio.md) | 3 sem |
| 15 | Live tracking (WebSocket) | Backend/App | [01.3-live-tracking.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/01-navegacion-seguridad/01.3-live-tracking.md) | 2 sem |
| 16 | Export GPX/Garmin | Backend | [03.3-exportar-gps-reloj.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/03-planificacion-rutas/03.3-exportar-gps-reloj.md) | 2 sem |
| 17 | Condiciones del sendero (OpenWeather) | Backend | [02.1-condiciones-sendero.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/02-informacion-inteligente/02.1-condiciones-sendero.md) | 2 sem |
| 18 | Fotos geolocalizadas | App/Backend | [04.1-fotos-geolocalizadas.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/04-comunidad-social/04.1-fotos-geolocalizadas.md) | 2 sem |
| 19 | Waypoints personalizados | App/Backend | [01.5-waypoints-personalizados.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/01-navegacion-seguridad/01.5-waypoints-personalizados.md) | 1 sem |
| 20 | Nuevos modelos Prisma (OfflineMap, UserWaypoint, TrafficData) | Backend | [06.1.1-traffic-data.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/06-arquitectura-tecnica/06.1-modelo-datos-ampliado/06.1.1-traffic-data.md) | 1 sem |

### 🔵 PRIORIDAD BAJA — Mes 4-6 (Premium Peak)

| # | Tarea | Equipo | Doc relacionada | Tiempo |
|---|-------|--------|-----------------|--------|
| 21 | Identificador de cimas AR | App (React Native) | [02.4-identificador-cimas-ra.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/02-informacion-inteligente/02.4-identificador-cimas-ra.md) | 1 mes |
| 22 | Rutas IA personalizadas | Backend (ML) | [03.1-rutas-ia-personalizadas.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/03-planificacion-rutas/03.1-rutas-ia-personalizadas.md) | 1 mes |
| 23 | Vista previa 3D | Frontend | [01.4-vista-previa-3d.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/01-navegacion-seguridad/01.4-vista-previa-3d.md) | 3 sem |
| 24 | Planificación multi-día | Backend/App | [03.2-planificacion-multidia.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/03-planificacion-rutas/03.2-planificacion-multidia.md) | 3 sem |
| 25 | Identificador de flora | App (ML) | [02.5-identificador-flora.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/02-informacion-inteligente/02.5-identificador-flora.md) | 3 sem |
| 26 | Retos y logros (gamification) | Backend/App | [04.3-retos-logros.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/04-comunidad-social/04.3-retos-logros.md) | 2 sem |
| 27 | Seguir amigos | Backend/App | [04.4-seguir-amigos.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/04-comunidad-social/04.4-seguir-amigos.md) | 2 sem |
| 28 | POIs mejorados | Backend | [03.4-puntos-interes-mejorados.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/feature-premium/03-planificacion-rutas/03.4-puntos-interes-mejorados.md) | 2 sem |

### ⚪ FASE CONTINUA — Monitorización y escalado

| # | Tarea | Equipo | Doc relacionada | Cuándo |
|---|-------|--------|-----------------|--------|
| 29 | Read replicas PostgreSQL | DBA | [08.3-read-replicas.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/08-escalabilidad/08.3-read-replicas.md) | +10k users |
| 30 | Horizontal scaling (multi-instance) | DevOps | [08.1-horizontal-scaling.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/08-escalabilidad/08.1-horizontal-scaling.md) | +5k users |
| 31 | Partitioning de TrafficData | DBA | [03.3-partitioning-estrategia.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/03-base-datos/03.3-partitioning-estrategia.md) | +10M rows |
| 32 | Load balancer | DevOps | [04.4-load-balancing.md](file:///C:/Projects/DOS%20ANTIGRAVITY/guideflow/docs/performance-optimization/04-infraestructura/04.4-load-balancing.md) | +5k users |

---

## 📅 Planificación Semanal Detallada

### Semana 1 — Fundación Técnica

| Día | Backend | Frontend | DevOps |
|-----|---------|----------|--------|
| **L** | PRO → PEAK migración schema | - | - |
| **M** | Env vars Stripe + webhook handlers | Lighthouse audit baseline | - |
| **X** | Índices PostGIS + búsqueda | `web-vitals` + `@vercel/speed-insights` | - |
| **J** | Rate limiting (Upstash) | Image optimization audit | - |
| **V** | ✅ Verificación + tests | ✅ Lighthouse re-check | Monitorización setup |

### Semana 2 — Optimización Core

| Día | Backend | Frontend | DevOps |
|-----|---------|----------|--------|
| **L** | Redis setup (Upstash) | Code splitting (MapView, Stripe) | Docker multi-stage |
| **M** | Cache-aside: rutas populares | Lazy loading componentes pesados | Nginx tuning |
| **X** | Optimizar top-10 queries | Bundle analysis | Alertas (Uptime Robot) |
| **J** | Cache invalidation patterns | ISR para páginas SEO | Backups automáticos |
| **V** | 🎯 Demo interna | 🎯 Lighthouse report final | 🎯 Dashboard listo |

### Semana 3 — Pulido + Inicio Fase 2

| Día | Backend | Frontend | DevOps |
|-----|---------|----------|--------|
| **L-X** | APIs preparatorias premium | Cache warmer script | CDN refinamiento |
| **J-V** | Inicio modelos Prisma premium | React Native evaluación | Cost monitoring |

---

## 💰 Proyección de Costes vs Revenue

| Escala | Usuarios | Coste infra | Revenue (5% premium) | Margen |
|--------|----------|-------------|----------------------|--------|
| MVP | 0-100 | **0€/mes** | 0€ | - |
| Crecimiento | 100-1k | **6€/mes** | 42€/mes | 85% |
| Tracción | 1k-10k | **85€/mes** | 625€/mes | 86% |
| Escala | 10k-100k | **300€/mes** | 7.500€/mes | 96% |

---

## ✅ Checklist Global — "Listo para Producción"

### Fase 0 (✅ Completada)

- [x] Documentación `feature-premium/` — 42 archivos
- [x] Documentación `performance-optimization/` — 64 archivos
- [x] Página `/premium` — UI funcional con 3 planes

### Fase 1 (⬜ Semana 1-2)

- [ ] `UserPlan.PRO` → `UserPlan.PEAK` migrado
- [ ] `STRIPE_EXPLORER_PRICE_ID` y `STRIPE_PEAK_PRICE_ID` en env
- [ ] Índices PostGIS + full-text creados
- [ ] Rate limiting en endpoints sensibles
- [ ] Redis configurado (Upstash)
- [ ] `unstable_cache` en queries calientes
- [ ] `next/image` en todas las imágenes
- [ ] Code splitting (MapView, Stripe lazy)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1
- [ ] Monitorización activa (Grafana/Uptime Robot)
- [ ] Docker optimizado (multi-stage, healthcheck)
- [ ] Backups automáticos
- [ ] Lighthouse score > 90

### Fase 2 (⬜ Mes 2-3)

- [ ] Modelos Prisma premium creados
- [ ] Mapas offline MVP
- [ ] Alertas de desvío MVP
- [ ] Live tracking funcional
- [ ] Exportar GPX
- [ ] Condiciones meteorológicas integradas
- [ ] Fotos geolocalizadas
- [ ] Waypoints personalizados

### Fase 3 (⬜ Mes 4-6)

- [ ] Identificador de cimas AR
- [ ] Rutas IA personalizadas
- [ ] Vista previa 3D
- [ ] Planificación multi-día
- [ ] Identificador de flora
- [ ] Gamification (retos/logros)
- [ ] Social (seguir amigos)

---

## 📚 Índice de Documentación Creada

### `docs/feature-premium/` — 42 archivos

| Sección | Archivos | Contenido |
|---------|----------|-----------|
| 00 | 1 | Resumen ejecutivo |
| 01 Navegación y Seguridad | 5 | Alertas, mapas offline, live tracking, 3D, waypoints |
| 02 Información Inteligente | 5 | Sendero, tráfico, terreno, cimas AR, flora |
| 03 Planificación de Rutas | 4 | IA, multi-día, GPS export, POIs |
| 04 Comunidad Social | 4 | Fotos, condiciones, retos, amigos |
| 05 Modelo Suscripción | 5 | Explorer, Peak, matriz, precios, Stripe |
| 06 Arquitectura Técnica | 17 | Modelos, APIs, app móvil, procesamiento |
| 07 Métricas/KPIs | 5 | Conversión, uso, churn, LTV, NPS |
| 08 Estrategia Lanzamiento | 5 | Fases, marketing, onboarding |
| 09 Legal/Cumplimiento | 4 | GPS privacy, T&C, liability, consent |
| 10 | 1 | Preguntas socráticas |

### `docs/performance-optimization/` — 64 archivos

| Sección | Archivos | Contenido |
|---------|----------|-----------|
| 00 | 1 | Filosofía de optimización |
| 01 Frontend | 8 | Web Vitals, splitting, images, fonts, bundles, caching, SSG/SSR, metrics |
| 02 Backend | 8 | Queries, indexes, pooling, caching, API, rate limit, compression, partitioning |
| 03 Base de Datos | 7 | PG tuning, VACUUM, partitioning, connections, analyzer, SSL, backups |
| 04 Infraestructura | 8 | Docker, Nginx, CDN, LB, auto-scaling, cost, monitoring, DR |
| 05 Caching | 5 | Redis, invalidation, multi-level, warmer, metrics |
| 06 Redes | 5 | CDN, DNS, HTTP/2+3, Brotli, image CDN |
| 07 Monitoreo | 6 | Metrics, logging, traces, alerts, Grafana, cost |
| 08 Escalabilidad | 5 | Horizontal, vertical, replicas, sharding, mono vs micro |
| 09 Casos Prácticos | 5 | Rutas, geo-search, fotos, Stripe, WebSockets |
| 10 Presupuesto | 5 | Actual, 1k, 10k, 100k, reducción costes |
| 11 | 1 | Preguntas socráticas |

---

## 🧠 Decisiones Clave Pendientes

1. **¿Vercel Pro o self-hosted (Hetzner)?** → Evaluar al llegar a 2k usuarios
2. **¿React Native o PWA para la app móvil?** → Decidir antes de Fase 2
3. **¿Cuándo activar Stripe live mode?** → Cuando Fase 1 complete
4. **¿Leaflet o MapLibre GL?** → MapLibre para premium (3D, offline tiles)
5. **¿Upstash Redis o self-hosted Redis?** → Upstash hasta 10k users

---

## 📝 Próxima Acción Inmediata

> **Fase 1, Tarea 1**: Migrar `UserPlan.PRO` → `UserPlan.PEAK` en `prisma/schema.prisma`, actualizar webhooks, crear migración, y tests.
