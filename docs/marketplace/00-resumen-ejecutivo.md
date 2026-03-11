# 🗺️ GuideFlow Marketplace — Resumen Ejecutivo

## Qué es

Un marketplace donde clientes buscan guías de aventura por ubicación, actividad y valoraciones. Evolución natural de GuideFlow (herramienta SaaS para guías) hacia plataforma bilateral (guías + clientes).

## Modelo de negocio: Híbrido (recomendado)

| Concepto | Precio |
|----------|--------|
| Suscripción base (herramienta) | 19€/mes |
| Comisión marketplace | 5% solo de reservas de **nuevos** clientes |

> Justificación: el guía paga por la herramienta (valor seguro) + comisión solo cuando el marketplace le trae negocio nuevo. No penaliza clientes que el guía ya tenía.

## Fases de implementación

| Fase | Qué | Duración | Requisitos previos |
|------|-----|----------|--------------------|
| **0: Preparación** | Ampliar modelo Guide, mejorar perfiles | 1 sprint | Nada |
| **1: MVP Local** | Buscador texto + filtros + página resultados | 2-3 sprints | Zona piloto elegida |
| **2: Geo Search** | PostGIS + búsqueda por radio + mapa | 2 sprints | Fase 1 validada |
| **3: Comunidad** | Reseñas + favoritos + planes pago | 3 sprints | Fase 2 activa |

## Zona piloto sugerida

**Pirineos (Huesca/Lleida)** — alta densidad de guías, turismo activo, mercado bien definido.

## Métricas clave

| KPI | Objetivo |
|-----|----------|
| Búsquedas/día | >50 en zona piloto |
| CTR resultados | >30% |
| Contactos por guía/semana | >5 |
| Guías activos en piloto | >10 |
| Conversión a plan pago | >20% |

## Estrategia contra el huevo-gallina

1. **Guías actuales gratis 6 meses** → oferta inicial
2. **UNA zona** → concentrar demanda
3. **Contenido primero** → "5 mejores rutas en Riglos" → atraer clientes → mostrar guías
4. **Alianzas locales** → federaciones, escuelas, oficinas turismo
