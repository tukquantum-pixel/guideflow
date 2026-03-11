# Filosofía de Optimización de GuideFlow

| Metadata | Valor |
|----------|-------|
| Versión | 1.0 |
| Última actualización | 2026-03-08 |
| Responsable | Engineering |
| Estado | Borrador |

## 🧠 Nuestros principios

1. **Rápido es mejor que bonito**: Una interfaz simple que carga en 0.5s es mejor que una elaborada que tarda 3s.
2. **Cada milisegundo cuenta**: La diferencia entre 100ms y 300ms impacta en conversión.
3. **Optimizar para el 95% de casos**: No hacemos micro-optimizaciones que complican el código.
4. **Medir antes de optimizar**: Si no se mide, no se mejora.
5. **Coste por petición**: Pensamos en el coste de cada petición, no solo en el rendimiento.

## 📊 Nuestros objetivos

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| Tiempo de carga inicial | < 1.5s | Lighthouse |
| First Contentful Paint | < 1.0s | Web Vitals |
| Time to Interactive | < 2.0s | Web Vitals |
| API response time (p95) | < 200ms | Logs / APM |
| Tamaño bundle inicial | < 150kb | Bundle Analyzer |
| Coste mensual infraestructura | < 50€ hasta 10k usuarios | Cloud billing |

## 💡 La regla de oro

> "Optimiza solo cuando tengas métricas que demuestren que es necesario. Pero cuando optimices, hazlo a conciencia."

## 📐 Prioridad de optimización

1. **Nivel 1 (gratis)**: Code splitting, lazy loading, select fields, índices
2. **Nivel 2 (bajo coste)**: CDN, caché Redis, compresión Brotli
3. **Nivel 3 (inversión)**: Read replicas, auto-scaling, monitoring avanzado

## 🔗 Documentos relacionados

- [01 – Frontend](./01-frontend/)
- [02 – Backend](./02-backend/)
- [03 – Base de Datos](./03-base-datos/)
- [04 – Infraestructura](./04-infraestructura/)
- [05 – Caching](./05-caching/)
- [06 – Redes](./06-redes/)
- [07 – Monitoreo](./07-monitoreo/)
- [08 – Escalabilidad](./08-escalabilidad/)
- [09 – Casos Prácticos](./09-casos-practicos/)
- [10 – Presupuesto](./10-presupuesto-recursos/)
