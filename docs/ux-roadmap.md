# GuideFlow UX Roadmap — Estrategia de Crecimiento

> **Fecha:** 8 marzo 2026  
> **Objetivo:** Convertir GuideFlow en la app de referencia para outdoor, no solo para profesionales.

---

## Fase Actual (Implementado)

### Límites por plan

| Plan | Rutas guardadas | Precio |
|------|----------------|--------|
| **Gratis** | 5 | 0€ |
| **Explorer** | ∞ | 9,99€/año |
| **Peak** | ∞ | 19,99€/año |

### Diferenciación Explorer vs Peak

| Feature | Explorer | Peak |
|---------|----------|------|
| Mapas offline | ✅ | ✅ |
| Alertas desvío | ✅ | ✅ |
| Live tracking | ✅ | ✅ |
| Exportar GPS | ✅ | ✅ |
| Waypoints | ✅ | ✅ |
| Condiciones sendero | ❌ | ✅ |
| Pronóstico tráfico | ❌ | ✅ |
| Identificador cimas (RA) | ❌ | ✅ |
| Identificador flora (IA) | ❌ | ✅ |
| Rutas con IA | ❌ | ✅ |
| Vista 3D | ❌ | ✅ |

---

## Sprint 1-2: Fundación UX

### Grabación de rutas con GPS

- [ ] Modelo `RecordedRoute` en Prisma
- [ ] API `/api/user/recorded-routes` (CRUD)
- [ ] Límites: FREE=3/mes, Explorer=10/mes, Peak=∞
- [ ] Componente `RouteRecorder` (start/pause/stop)
- [ ] Geolocation API para tracking GPS

### Perfil de usuario con estadísticas

- [ ] Modelo `UserStats` (campos agregados)
- [ ] Página `/perfil` con km totales, desnivel, tiempo, rutas
- [ ] Gráfico de progreso mensual (barras)
- [ ] Mejores marcas personales

### Historial de rutas

- [ ] Página `/historial` con rutas grabadas
- [ ] Filtros: fecha, distancia, desnivel

---

## Sprint 3-4: Gamificación

### Logros y badges

- [ ] Modelo `Achievement` + `UserAchievement` en Prisma
- [ ] Trigger automático (primera ruta, 10km, 50km, 500km, etc.)
- [ ] UI de logros en perfil (desbloqueados vs bloqueados)
- [ ] Animación de "logro conseguido" al completar ruta

### Retos (futuro)

- [ ] Modelo `Challenge` + `ChallengeProgress`
- [ ] Reto semanal automático (km, desnivel, frecuencia)
- [ ] UI de progreso del reto

---

## Sprint 5-6: Social y Viral

### Compartir en redes

- [ ] Componente `ShareAfterRoute` (Instagram, WhatsApp)
- [ ] API de generación de imagen (mapa + stats + logro)
- [ ] Deep links para compartir rutas

### Sistema social

- [ ] Modelo `Follow` (user_id, followed_id)
- [ ] Feed de actividad de amigos
- [ ] "Me gusta" en rutas completadas

---

## Sprint 7-8: Comunidad

### Rankings

- [ ] Leaderboard semanal/mensual
- [ ] Ranking por amigos
- [ ] Ranking por zona geográfica

### Notificaciones

- [ ] Push notifications (app nativa)
- [ ] Email digest semanal con progreso

---

## Principios de diseño

1. **Zero learning curve** — primera ruta en < 30 segundos
2. **Gamificación sutil** — ver progreso, no "jugar"
3. **Social por defecto** — compartir en 1 clic
4. **Valor inmediato** — primera ruta = experiencia "wow"

## Métricas objetivo

| Métrica | Target |
|---------|--------|
| Retención D7 | >40% |
| Rutas/usuario/mes | >2 |
| Conversión free→premium | >5% |
| Sharing rate | >30% |
