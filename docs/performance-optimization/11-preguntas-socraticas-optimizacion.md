# 11 – Preguntas Socráticas de Optimización

| Metadata | Valor |
|----------|-------|
| Versión | 1.0 |
| Última actualización | 2026-03-08 |
| Responsable | Todo el equipo |
| Estado | Borrador |

## 🧠 Decisiones clave

### Frontend

1. **¿Vercel o self-hosted?**
   - Vercel: zero-config, ISR nativo, edge functions → pero vendor lock-in
   - Self-hosted (Docker + Nginx): control total, más barato a escala → pero más mantenimiento

2. **¿Leaflet o MapLibre GL JS?**
   - Leaflet: más ligero, ya integrado, comunidad grande
   - MapLibre: 3D, vector tiles, offline → más pesado pero más potente para premium

### Backend

1. **¿Prisma Accelerate o PgBouncer self-hosted?**
   - Accelerate: managed, zero-config → pero coste adicional
   - PgBouncer: gratis, más control → pero otro servicio que mantener

2. **¿unstable_cache es suficiente o necesitamos Redis desde día 1?**
   - `unstable_cache`: incluido, sin infra extra → pero se pierde en deploy
   - Redis: persistente, compartido entre instancias → pero coste y complejidad

### Infraestructura

1. **¿Hetzner, DigitalOcean o AWS?**
   - Hetzner: 70% más barato, UE, excelente relación calidad/precio
   - DO: buenas APIs, marketplace de apps
   - AWS: ecosistema completo, pero caro y complejo

2. **¿CDN Cloudflare es suficiente o necesitamos algo más?**
   - Cloudflare gratis: CDN + DDoS + SSL → suficiente para >90% de casos
   - Cloudflare Pro (20€): WAF + Image optimization → cuando haya pagos/datos sensibles

### Datos

1. **¿PostGIS o cálculos en aplicación (Turf.js)?**
   - PostGIS: órdenes de magnitud más rápido para queries geoespaciales
   - Turf.js: no requiere extensión BD → pero escala mal con >1k registros

### Monitorización

1. **¿Cuándo vale la pena pagar por monitoring?**
   - Gratis (Grafana Cloud + Uptime Robot): suficiente hasta 10k usuarios
   - Pago (Datadog/New Relic): cuando el coste de downtime > coste del servicio

### Escalabilidad

1. **¿Cuándo pasar de monolito a microservicios?**
   - Respuesta: probablemente nunca (para el tamaño esperado de GuideFlow)
   - Solo si un módulo específico necesita tech stack diferente (ej: ML en Python)

2. **¿Optimizar para coste mínimo o para máxima velocidad?**
    - Coste mínimo: tiers gratis, caching agresivo, un solo VPS
    - Máx velocidad: CDN edge, Redis hot data, read replicas
    - **Respuesta: coste mínimo primero, velocidad cuando el negocio lo justifique**

## 💡 La pregunta definitiva

> *"¿Cada euro que gastamos en infraestructura genera más de 1€ en valor para el usuario?"*
> Si sí → invertir. Si no → optimizar primero.
