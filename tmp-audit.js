const fs = require("fs")
const path = require("path")
const base = "C:\\Projects\\DOS ANTIGRAVITY\\guideflow\\docs\\app-native-prds"

const prds = [
    // 01 - remaining
    ["01-setup-infraestructura/01.5-gestion-de-dependencias-y-plugins.md", "Gestión de Dependencias y Plugins", "Establecer el proceso de gestión de dependencias nativas (CocoaPods, Gradle) y plugins necesarios para mapas, GPS, pagos, etc."],
    // 02 - remaining
    ["02-autenticacion-y-usuarios/02.2-pantalla-de-registro.md", "Pantalla de Registro", "Registro de usuario con email, nombre y contraseña. Validación de campos. Endpoint POST /api/user-auth/register."],
    ["02-autenticacion-y-usuarios/02.3-recuperacion-de-contrasena.md", "Recuperación de Contraseña", "Flujo 'Olvidé mi contraseña' con envío de email de reset y pantalla de nueva contraseña."],
    ["02-autenticacion-y-usuarios/02.4-sesion-persistente-y-token-management.md", "Sesión Persistente y Token Management", "Gestión de JWT tokens con Keychain/EncryptedPrefs, auto-refresh, y logout."],
    ["02-autenticacion-y-usuarios/02.5-perfil-de-usuario-basico.md", "Perfil de Usuario Básico", "Pantalla de perfil con foto, nombre, stats totales (km, rutas, desnivel). Edición de datos."],
    // 03
    ["03-explorador-de-rutas/03.1-pantalla-principal-con-lista.md", "Pantalla Principal con Lista de Rutas", "Lista vertical scrollable de rutas con FlatList, pull-to-refresh, infinite scroll. Endpoint GET /api/routes/all con paginación."],
    ["03-explorador-de-rutas/03.2-tarjetas-de-ruta.md", "Tarjetas de Ruta", "Componente RouteCard con foto correlacionada por terreno (activity-identity.ts), icono de dificultad, distancia, desnivel, duración, badges."],
    ["03-explorador-de-rutas/03.3-filtros-y-busqueda.md", "Filtros y Búsqueda", "Barra de búsqueda + filtros por actividad (CategoryIcon), dificultad, distancia, zona. Filtros como bottom sheet."],
    ["03-explorador-de-rutas/03.4-vista-mapa-con-marcadores.md", "Vista Mapa con Marcadores", "Toggle lista/mapa. Mapa react-native-maps con marcadores de ruta, clusters por zoom, popup al tocar con minicard."],
    ["03-explorador-de-rutas/03.5-detalle-de-ruta.md", "Detalle de Ruta", "Pantalla con mapa del track, perfil de elevación, stats, fotos, checkpoints, botón 'Comenzar ruta' que abre grabación."],
    // 04 - remaining
    ["04-grabacion-de-rutas/04.3-controles-start-pause-stop.md", "Controles Start/Pause/Stop", "Componente con 3 botones grandes: Iniciar (verde), Pausar (amarillo), Finalizar (rojo). Estados: idle→recording→paused→done."],
    ["04-grabacion-de-rutas/04.4-estadisticas-en-vivo.md", "Estadísticas en Vivo", "Componente con 4 cards: Distancia (km), Tiempo (h:mm:ss), Desnivel (m), Velocidad (km/h). Actualización cada segundo."],
    ["04-grabacion-de-rutas/04.6-sincronizacion-al-recuperar-conexion.md", "Sincronización al Recuperar Conexión", "Listener de NetInfo que dispara sincronización de tracks pendientes en MMKV. Cola con retry exponencial."],
    ["04-grabacion-de-rutas/04.7-pantalla-de-resumen-al-finalizar.md", "Pantalla de Resumen al Finalizar", "Pantalla post-grabación con mapa del track, stats finales, opción de guardar nombre, compartir en RRSS, y subir a la API."],
    // 05
    ["05-mapas-offline/05.1-selector-de-zona-para-descarga.md", "Selector de Zona para Descarga", "Mapa donde el usuario dibuja un rectángulo para seleccionar la zona a descargar para uso offline (Premium)."],
    ["05-mapas-offline/05.2-calculador-de-tamano-estimado.md", "Calculador de Tamaño Estimado", "Mostrar estimación de MB según zoom levels y área seleccionada antes de descargar."],
    ["05-mapas-offline/05.3-descarga-progresiva-de-tiles.md", "Descarga Progresiva de Tiles", "Descarga en background de tiles para los zoom levels 8-16 de la zona seleccionada. Barra de progreso."],
    ["05-mapas-offline/05.4-gestion-de-mapas-descargados.md", "Gestión de Mapas Descargados", "Lista de zonas descargadas con nombre, tamaño, fecha. Opción de eliminar para liberar espacio."],
    ["05-mapas-offline/05.5-modo-offline-automatico.md", "Modo Offline Automático", "Detección automática de sin-conexión y uso de tiles locales. Banner 'Modo offline' visible."],
    // 06
    ["06-perfil-y-estadisticas/06.1-pantalla-de-perfil.md", "Pantalla de Perfil", "Foto, nombre, bio, stats totales, lista de rutas grabadas, rutas guardadas. Botón editar perfil."],
    ["06-perfil-y-estadisticas/06.2-estadisticas-totales.md", "Estadísticas Totales", "Cards con: km totales, desnivel total, rutas completadas, tiempo total, mejor ruta, racha semanal."],
    ["06-perfil-y-estadisticas/06.3-lista-de-rutas-grabadas.md", "Lista de Rutas Grabadas", "FlatList con rutas del usuario. Cada card: minimap, nombre, fecha, stats. Tap → detalle."],
    ["06-perfil-y-estadisticas/06.4-detalle-de-ruta-grabada.md", "Detalle de Ruta Grabada", "Mapa con track completo, perfil elevación, stats, botón compartir, botón eliminar."],
    ["06-perfil-y-estadisticas/06.5-compartir-ruta-en-redes.md", "Compartir Ruta en Redes", "Generar imagen con mapa+stats del track. Share sheet nativo de iOS/Android."],
    // 07
    ["07-logros-y-ranking/07.1-pantalla-de-logros.md", "Pantalla de Logros", "Grid de logros con iconos, progreso, badges desbloqueados. Categorías por actividad (activity-identity.ts)."],
    ["07-logros-y-ranking/07.2-progreso-de-logros.md", "Progreso de Logros", "Barra de progreso circular por logro. Ejemplo: 'Andarín: 7/10km (70%)'."],
    ["07-logros-y-ranking/07.3-modal-al-conseguir-logro.md", "Modal al Conseguir Logro", "Modal celebratorio animado (confetti) al desbloquear un logro. Botón compartir."],
    ["07-logros-y-ranking/07.4-ranking-global.md", "Ranking Global", "Lista de usuarios por km/desnivel/rutas. Posición del usuario actual destacada."],
    ["07-logros-y-ranking/07.5-ranking-de-amigos.md", "Ranking de Amigos", "Lista filtrada por amigos (conexiones). Invitar amigos por enlace."],
    // 08
    ["08-funcionalidades-premium/08.1-pantalla-de-suscripciones.md", "Pantalla de Suscripciones", "Comparativa de planes: Free vs Explorer vs Peak. Precios, features, botón 'Suscribirse'. Stripe."],
    ["08-funcionalidades-premium/08.2-integracion-con-stripe.md", "Integración con Stripe", "Stripe React Native SDK. Payment sheet. Webhook confirmation. Endpoint /api/stripe/payment-intent."],
    ["08-funcionalidades-premium/08.3-control-de-limites-por-plan.md", "Control de Límites por Plan", "Free: 3 rutas/mes. Explorer: ilimitadas. Peak: offline+alertas. Verificación client-side + server-side."],
    ["08-funcionalidades-premium/08.4-mapas-offline-solo-premium.md", "Mapas Offline Solo Premium", "Bloquear descarga de mapas para plan Free. Mostrar paywall con beneficios de upgrade."],
    ["08-funcionalidades-premium/08.5-alertas-de-desvio-solo-premium.md", "Alertas de Desvío Solo Premium", "Durante grabación, alertar si el usuario se desvía >50m de la ruta planificada (Premium Peak)."],
    // 09
    ["09-sincronizacion-y-backend/09.1-api-client.md", "API Client", "Axios instance con interceptors para auth, retry, timeout. React Query para cache y refetch."],
    ["09-sincronizacion-y-backend/09.2-sincronizacion-de-tracks-offline.md", "Sincronización de Tracks Offline", "Algoritmo de sync: detectar conexión → buscar pendientes → subir uno a uno → marcar synced."],
    ["09-sincronizacion-y-backend/09.3-cola-de-peticiones-pendientes.md", "Cola de Peticiones Pendientes", "Queue persistente en MMKV para cualquier POST/PUT que falle por falta de conexión. Retry automático."],
    ["09-sincronizacion-y-backend/09.4-gestion-de-errores-de-red.md", "Gestión de Errores de Red", "Patrones de error: timeout → retry, 401 → refresh token, 500 → mostrar error amigable, offline → queue."],
    ["09-sincronizacion-y-backend/09.5-notificaciones-push.md", "Notificaciones Push", "Firebase Cloud Messaging. Notificaciones: logro desbloqueado, reto semanal, nueva ruta cerca."],
    // 10
    ["10-testing-y-publicacion/10.1-testing-en-simuladores.md", "Testing en Simuladores", "Configuración de simuladores iOS (Xcode) y Android (Android Studio). Simular GPS con rutas GPX."],
    ["10-testing-y-publicacion/10.2-testing-en-dispositivos-reales.md", "Testing en Dispositivos Reales", "Lista de dispositivos mínimos: iPhone 12+, Android 10+. Testing de GPS real en campo."],
    ["10-testing-y-publicacion/10.3-preparacion-para-app-store.md", "Preparación para App Store", "Screenshots 6.5\" y 5.5\", descripción, keywords, categoría, privacy policy, review guidelines."],
    ["10-testing-y-publicacion/10.4-preparacion-para-google-play.md", "Preparación para Google Play", "Screenshots, feature graphic, descripción, categoría, content rating, privacy policy, aab bundle."],
    ["10-testing-y-publicacion/10.5-estrategia-de-beta-y-feedback.md", "Estrategia de Beta y Feedback", "TestFlight (iOS) + Internal Testing (Android). 20 beta testers. Formulario de feedback. Iteración rápida."],
]

let count = 0
for (const [file, title, desc] of prds) {
    const fullPath = path.join(base, file)
    if (fs.existsSync(fullPath)) continue
    const content = `# PRD: ${title}

| Metadata | Valor |
|----------|-------|
| **Versión** | 1.0 |
| **Fecha** | 2026-03-10 |
| **Estado** | Borrador |

## 🎯 Objetivo
${desc}

## 🧠 Experiencia de Usuario
*Por definir — seguir plantilla estándar*

## 📱 Pantallas / Componentes
*Por definir*

## 🔌 APIs Necesarias
*Por definir*

## 🗃️ Datos (Modelo/Estado)
*Por definir*

## ⚙️ Lógica de Negocio
*Por definir*

## 🧪 Casos de Prueba
*Por definir*

## ⏱️ Tiempo Estimado
*Por estimar*

## 🔗 Dependencias
*Por definir*
`
    fs.writeFileSync(fullPath, content)
    count++
}
console.log("Generated " + count + " PRD stubs")
