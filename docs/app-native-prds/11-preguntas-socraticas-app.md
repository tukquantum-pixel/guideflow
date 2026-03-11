# Preguntas Socráticas: App Nativa PATHY

| Metadata | Valor |
|----------|-------|
| **Versión** | 1.0 |
| **Fecha** | 2026-03-10 |
| **Estado** | Borrador |

## Antes de empezar a codificar, responde honestamente

### Sobre el MVP

1. ¿Qué funcionalidad es la que hace que un usuario NECESITE la app nativa en vez de la web?
2. ¿Podemos lanzar sin mapas offline? ¿Sin logros? ¿Sin premium?
3. ¿Cuál es la funcionalidad mínima para que un usuario diga "esto me sirve"?

### Sobre GPS

4. ¿Hemos probado `react-native-background-geolocation` en un dispositivo REAL?
2. ¿Cuánta batería consume en 1 hora de grabación?
3. ¿Qué accuracy necesitamos? ¿HIGH consume demasiado?
4. ¿Qué pasa si el GPS pierde señal 5 minutos en un valle?

### Sobre Offline

8. ¿Cuántos MB ocupa una zona de 50x50km en tiles zoom 8-16?
2. ¿MMKV puede manejar tracks de 8 horas (miles de puntos)?
3. ¿Qué pasa si el usuario tiene el storage lleno?

### Sobre UX

11. ¿Un usuario de Wikiloc entendería nuestra app en 10 segundos?
2. ¿Los controles de grabación son suficientemente grandes para usar con guantes?
3. ¿La app funciona con una sola mano?
4. ¿Qué pasa si el usuario pierde el móvil mid-ruta?

### Sobre Publicación

15. ¿Tenemos cuenta de Apple Developer ($99/año) y Google Play ($25)?
2. ¿Cuánto tarda la review de App Store? (media: 24-48h)
3. ¿Tenemos screenshots profesionales para las stores?
4. ¿La privacy policy cubre el uso de GPS en background?

### Sobre Competencia

19. ¿Qué hace Wikiloc que nosotros NO vamos a tener en v1.0?
2. ¿Qué hacemos MEJOR que Wikiloc desde el día 1?
