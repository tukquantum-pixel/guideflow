# 10 – Preguntas Socráticas

| Metadata | Valor |
|----------|-------|
| Versión | 1.0 |
| Última actualización | 2026-03-08 |
| Responsable | Todo el equipo |
| Estado | Borrador |

## 🧠 Preguntas clave de decisión

### Producto

1. **¿Llamamos a los planes "Explorer" y "Peak" o buscamos otros nombres?**
   - Alternativas: "Trail" y "Summit", "Base" y "Cumbre"

2. **¿Lanzamos primero solo Explorer (Fase 1) o esperamos a tener más funcionalidades?**
   - Pro lanzar pronto: validar demanda, feedback temprano
   - Pro esperar: experiencia más completa, menos riesgo de churn

3. **¿App nativa (React Native) o PWA para las funcionalidades GPS?**
   - RN: mejor GPS background, acceso a sensores, tienda de apps
   - PWA: un solo codebase, despliegue inmediato, sin review de Apple

### Tecnología

1. **¿Qué APIs meteorológicas usamos? (OpenWeather, AEMET, ambas)**
   - OpenWeather: global, API clean, coste ~60$/mes
   - AEMET: datos oficiales España, gratuita, API irregular

2. **¿Cómo almacenamos mapas offline?**
   - MBTiles + SQLite (estándar de la industria)
   - PMTiles (formato nuevo, más eficiente pero menos soporte)

### Negocio

1. **¿Monetizamos solo con suscripción o también compra única por región (como Komoot)?**
   - Suscripción: ingresos recurrentes, más predecible
   - Compra única: menor barrera, pero ingreso puntual

2. **¿Priorizamos identificador de cimas (RA) o condiciones del sendero?**
   - Cimas: factor wow, viral, diferenciador
   - Condiciones: utilidad diaria, mayor retention

3. **¿Ofrecemos trial gratuito?**
   - 7 días → reduce fricción, pero riesgo de abuso
   - Sin trial → conversión menor, pero usuarios más comprometidos

### Comunidad

1. **¿Los reportes de condiciones deben ser gratuitos o premium?**
   - Gratis: más data, más valor para todos, efecto red
   - Premium: incentivo de pago, pero menos datos

2. **¿Moderamos waypoints comunitarios manualmente o con IA?**
    - Manual: calidad alta, coste humano
    - IA: escalable, riesgo de falsos positivos

## 💡 La pregunta definitiva

> *"Si tú fueras a hacer el Camino de Santiago o una ruta por los Pirineos, ¿pagarías 10€ al año por tener mapas offline, alertas de seguridad y que tu familia sepa dónde estás?"*

**Si la respuesta es SÍ → adelante.**
