# PATHY: Mapeo de Paridad Web ↔ App Nativa

## 📊 Inventario real auditado

| Métrica | GuideFlow (web) | PathyApp (nativa) |
|---------|:-:|:-:|
| Páginas | 23 | 4 tabs + 0 stacks |
| API endpoints | 34 | 3 nuevos sync |
| Modelos Prisma | 16 | Comparte backend |

---

## 🔴 PÁGINAS WEB → PANTALLAS APP

### Autenticación (4 páginas web)

| Web page | Ruta web | App screen | Estado |
|----------|----------|-----------|--------|
| Login | `/entrar` | AuthStack → Login | ⬜ PENDIENTE |
| Register (usuario) | `/registrarse` | AuthStack → Register | ⬜ PENDIENTE |
| Register (guía 3 pasos) | `/register` | AuthStack → GuideRegister | ⬜ PENDIENTE |
| Login NextAuth | `/(auth)/login` | — (compartir endpoint) | ⬜ PENDIENTE |

### Explorador (4 páginas web)

| Web page | Ruta web | App screen | Estado |
|----------|----------|-----------|--------|
| Explorador (mapa+lista) | `/explorar` | Tab Explorar (lista) | 🟡 PLACEHOLDER |
| Buscar ruta | `/buscar-ruta` | Tab Explorar → SearchBar | ⬜ PENDIENTE |
| Buscar (marketplace) | `/buscar` | Tab Explorar → filtros | ⬜ PENDIENTE |
| Detalle ruta | `/ruta/[id]` | Stack → RouteDetail | ⬜ PENDIENTE |

### Grabación (3 páginas web)

| Web page | Ruta web | App screen | Estado |
|----------|----------|-----------|--------|
| Grabar ruta | `/grabar` | Tab Grabar (mapa+GPS) | 🟡 PLACEHOLDER |
| Seguir ruta | `/seguir/[id]` | Tab Grabar → follow mode | ⬜ PENDIENTE |
| Mis rutas grabadas | `/mis-rutas` | Stack → RecordedRoutes | ⬜ PENDIENTE |

### Dashboard Guía (5 páginas web)

| Web page | Ruta web | App screen | Estado |
|----------|----------|-----------|--------|
| Dashboard home | `/dashboard` | Stack → GuideDashboard | ⬜ PENDIENTE |
| Perfil guía (editar) | `/dashboard/profile` | Stack → GuideProfile | ⬜ PENDIENTE |
| Actividades | `/dashboard/activities` | Stack → GuideActivities | ⬜ PENDIENTE |
| Detalle actividad | `/dashboard/activities/[id]` | Stack → ActivityDetail | ⬜ PENDIENTE |
| Editar actividad | `/dashboard/activities/[id]/edit` | Stack → ActivityEdit | ⬜ PENDIENTE |
| Reservas | `/dashboard/bookings` | Stack → Bookings | ⬜ PENDIENTE |

### Perfil y usuario (3 páginas web)

| Web page | Ruta web | App screen | Estado |
|----------|----------|-----------|--------|
| Perfil público guía | `/[slug]` | Stack → PublicGuideProfile | ⬜ PENDIENTE |
| Mi cuenta | `/cuenta` | Tab Perfil → Settings | ⬜ PENDIENTE |
| Perfil usuario | `/perfil` | Tab Perfil | 🟡 PLACEHOLDER |

### Premium y otros (3 páginas web)

| Web page | Ruta web | App screen | Estado |
|----------|----------|-----------|--------|
| Premium (planes) | `/premium` | Stack → PremiumPlans | ⬜ PENDIENTE |
| Landing home | `/` | — (no aplica en app) | N/A |
| Admin | `/admin` | — (no en app móvil) | N/A |

---

## 🔌 API ENDPOINTS → App usage

### Ya conectados (3 nuevos sync)

| Endpoint | Método | App usage |
|----------|--------|-----------|
| `/api/tracks/offline-chunk` | POST | ✅ Subir chunks GPS offline |
| `/api/tracks/complete` | POST | ✅ Finalizar track |
| `/api/sync/status` | GET | ✅ Verificar pendientes |

### Por conectar (31 existentes)

| Endpoint | Método | App screen |
|----------|--------|-----------|
| `/api/routes/all` | GET | Explorar → lista |
| `/api/routes/[id]/gpx` | GET | RouteDetail → descargar |
| `/api/routes/suggest` | GET | Explorar → sugerencias |
| `/api/marketplace/search` | GET | Explorar → búsqueda |
| `/api/user-auth/register` | POST | Register screen |
| `/api/user-auth/[...nextauth]` | * | Login/session |
| `/api/user/recorded-routes` | GET/POST | Mis rutas / guardar track |
| `/api/user/saved-routes` | GET/POST | Favoritos |
| `/api/user/subscription` | GET | Premium status |
| `/api/profile` | GET/PUT | Tab Perfil |
| `/api/activities` | GET/POST | GuideActivities |
| `/api/activities/[id]` | GET/PUT/DEL | ActivityDetail/Edit |
| `/api/activities/[id]/slots` | GET/POST | TimeSlots |
| `/api/activities/[id]/clone` | POST | Clone activity |
| `/api/bookings` | GET/POST | Reservas |
| `/api/bookings/[id]` | GET/PUT | Booking detail |
| `/api/bookings/mine` | GET | Mis reservas |
| `/api/credentials` | GET/POST | Credenciales guía |
| `/api/tracks` | POST/DEL | Upload/delete GPX |
| `/api/tracks/[trackId]/stages` | GET/POST | Stages |
| `/api/stages/[stageId]/checkpoints` | GET/POST | Checkpoints |
| `/api/stages/[stageId]/photos` | GET/POST | Stage photos |
| `/api/stripe/connect` | POST | Stripe guía |
| `/api/stripe/payment-intent` | POST | Pago cliente |
| `/api/stripe/webhook` | POST | — (server only) |
| `/api/upload` | POST | Subir fotos |
| `/api/admin/*` | * | — (no en app) |
| `/api/cron/expiry` | GET | — (server only) |

---

## 📊 RESUMEN DE PROGRESO

| Categoría | Total pantallas | Hechas | % |
|-----------|:-:|:-:|:-:|
| Auth | 4 | 0 | 0% |
| Explorador | 4 | 1 placeholder | 10% |
| Grabación | 3 | 1 placeholder | 10% |
| Dashboard guía | 6 | 0 | 0% |
| Perfil/usuario | 3 | 1 placeholder | 10% |
| Premium | 1 | 0 | 0% |
| **TOTAL** | **21** | **3 placeholders** | **~5%** |

> 2 páginas (Landing, Admin) no aplican a la app nativa.

---

## 🎯 PLAN DE 8 SEMANAS (resumen)

| Sem | Foco | Pantallas |
|-----|------|-----------|
| 1-2 | Grabación core | Grabar (GPS real), Seguir, Resumen |
| 3 | Auth | Login, Register, ForgotPassword |
| 4 | Explorador | Lista, Filtros, Vista mapa, Detalle ruta |
| 5 | Perfil | Perfil, MisRutas, Favoritos, Cuenta |
| 6 | Logros | Logros, Ranking, Progreso |
| 7 | Dashboard guía | Dashboard, Actividades, Reservas |
| 8 | Premium + Testing | Planes, Pago, Límites, Beta |
