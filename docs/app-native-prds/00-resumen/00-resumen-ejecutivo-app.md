# Resumen Ejecutivo: App Nativa PATHY

| Metadata | Valor |
|----------|-------|
| **Versión** | 1.0 |
| **Fecha** | 2026-03-10 |
| **Estado** | Borrador |

---

## Visión General

App móvil nativa para iOS y Android desarrollada con **React Native** que permita a los usuarios grabar rutas de montaña con GPS en background, mapas offline y todas las funcionalidades premium de PATHY.

## Por qué App Nativa (no solo PWA)

| Capacidad | PWA actual | App Nativa |
|-----------|:---:|:---:|
| GPS en background | ❌ | ✅ |
| Mapas offline | ❌ | ✅ |
| Notificaciones push | Parcial | ✅ |
| App Store/Play Store | ❌ | ✅ |
| Rendimiento mapa | Medio | Alto |
| Batería optimizada | ❌ | ✅ |

## MVP Scope (v1.0)

- ✅ Autenticación (login, registro, sesión persistente)
- ✅ Explorador de rutas (lista + mapa + filtros)
- ✅ Grabación GPS con track en vivo (offline)
- ✅ Perfil básico con rutas grabadas
- ❌ Mapas offline (v1.1)
- ❌ Alertas de desvío (v1.2 — Premium)
- ❌ Logros/ranking (v1.1)

## Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| Framework | React Native 0.74+ |
| Lenguaje | TypeScript |
| Navegación | React Navigation 6.x |
| Mapas | react-native-maps (MapLibre) |
| GPS background | react-native-background-geolocation |
| Storage local | MMKV (react-native-mmkv) |
| HTTP | Axios + react-query |
| Estado | Zustand |
| Pagos | Stripe React Native SDK |

## Cronograma Estimado

| Mes | Fase | Entregable |
|-----|------|-----------|
| 1 | Setup + Auth + Explorador | App con login y listado de rutas |
| 2 | Grabación GPS + Offline | Grabar rutas sin conexión |
| 3 | Perfil + Stats + Testing | Beta cerrada |
| 4 | Publicación | App Store + Google Play |

## APIs existentes reutilizables

| Endpoint | Uso en app |
|----------|-----------|
| `GET /api/routes/all` | Explorador de rutas |
| `POST /api/tracks` | Subir tracks grabados |
| `POST /api/auth/register` | Registro |
| `GET /api/user/recorded-routes` | Mis rutas |
| `GET /api/user/saved-routes` | Rutas guardadas |
| `POST /api/stripe/payment-intent` | Pagos Premium |

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Consumo batería GPS | Algoritmo adaptativo de frecuencia |
| Tamaño mapas offline | Descarga selectiva por zona |
| Review App Store | Preparar screenshots + descripción SEO |
| Compatibilidad dispositivos | Testing en 5+ dispositivos reales |
