# Preguntas Socráticas — Marketplace

## Antes de escribir UNA línea de código

### Sobre la demanda real

1. ¿Hemos hablado con **5 personas que busquen guías** para preguntarles CÓMO buscan hoy?
2. ¿Sabemos si Google es suficiente para encontrar guía, o hay un DOLOR real?
3. ¿Los clientes quieren reservar online o prefieren llamar/WhatsApp?

### Sobre la oferta (guías)

4. ¿Hemos preguntado a **5 guías reales** si les interesa aparecer?
2. ¿Los guías YA tienen exceso de demanda? (Si sí, no necesitan marketplace)
3. ¿Qué porcentaje de sus clientes vienen de internet vs boca a boca?
4. ¿Un guía pagaría 29€ en vez de 19€ por tener visibilidad marketplace?

### Sobre la zona piloto

8. ¿Por qué Pirineos y no Costa Brava o Sierra Nevada?
2. ¿Cuántos guías independientes hay en esa zona? ¿10? ¿50? ¿200?
3. ¿Hay competitor local que ya haga esto? (Yumping, GetYourGuide, Civitatis)

### Sobre el modelo económico

11. ¿El 5% de comisión justifica el esfuerzo de desarrollo?
2. Con 10 guías × 5 reservas/mes × 30€ × 5% = **75€/mes**. ¿Merece la pena?
3. ¿A qué escala el marketplace empieza a ser rentable por sí solo?

### Sobre tecnología

14. ¿Necesitamos PostGIS ahora o vale con filtro por texto/región?
2. ¿Leaflet aguanta 200 pines en la misma vista de mapa?
3. ¿El SEO de las páginas de guías ya está optimizado para Google?

### La pregunta MÁS importante
>
> *"Si construimos el marketplace y nadie lo usa en el primer mes, ¿qué habremos aprendido que no podíamos aprender sin construirlo?"*

**Posible respuesta:** Podemos validar la demanda ANTES de construir con:

- Una landing page "Encuentra guías en [zona]" → medir clicks
- Un formulario de interés → medir registros
- Contenido SEO → medir tráfico orgánico

## Decisiones pendientes del equipo

| # | Decisión | Opciones | Elegida |
|---|----------|----------|---------|
| 1 | Zona piloto | Pirineos / Costa Brava / Sierra Nevada | ❓ |
| 2 | Modelo ingresos | 29€/mes / 5% comisión / Híbrido | ❓ |
| 3 | Fase 0 ahora vs validar primero | Construir / Landing test | ❓ |
| 4 | PostGIS vs búsqueda texto | PostGIS (Fase 2) / Solo texto (MVP) | Solo texto |
| 5 | Gratis para guías existentes | Sí 6 meses / Sí sin límite | ❓ |
