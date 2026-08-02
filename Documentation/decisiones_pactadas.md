# PetFine: Decisiones Pactadas

> Estado: ABIERTO — v3 (MVP expandido con interacciones sociales y chat interno)
>
> **Motivo de reapertura:** se incorporan 3 nuevas features (interacciones sociales + feed ponderado, chat interno iniciado desde posts, validación extendida) que modifican decisiones de v2. La incorporación del chat interno revierte decisiones previas que excluían el chat in-app; WhatsApp pasa de canal primario a fallback dentro del chat.
>
> **Verificaciones críticas detectadas:**
> - El chat se implementa con polling REST 5s, sin WebSockets ni Socket.io, para no aumentar el consumo del backend en Railway Free.
> - El feed ponderado requiere un LEFT JOIN con `follows` + ORDER BY CASE, apoyado en índices compuestos existentes.
> - 5 tablas nuevas y 1 columna nueva en posts.

## Resumen de Decisiones Finales

| Decisión | Final (MVP v3) | Post-MVP |
|----------|-------------|----------|
| **Hosting backend** | Railway Free ($1 crédito incluido, sin sleep, cron jobs nativos). Plan B: Render Free + CronJob.org | Pay-as-you-go Hobby ($5/mes) al escalar |
| **Base de datos** | Neon Postgres plano (sin PostGIS) — 3GB free, sin pausa | — |
| **Storage fotos** | Cloudinary free (25GB, no expira). Incluye fotos en chat (NUEVO v3) | Plan pago si >25GB |
| **Auth** | Google OAuth (Passport.js) + Email/OTP (Resend, 3000/mes) | — |
| **Monitoreo** | Sentry free (5K errors/mes) + Railway logs | Analytics de producto |
| **Rate limiting** | express-rate-limit in-memory (single-instance). Incluye rate-limit de chat 30 msg/min (NUEVO v3) | Upstash Redis multi-VM |
| **Notificaciones push** | Expo Push. Escenarios v3: match, validación 30 días, **+ nuevo mensaje de chat (NUEVO v3)** | — |
| **Sistema de puntuación** | Eliminado | — |
| **Tipos de publicación** | 3: Adopción, Perdido, Encontrado ("Quiero adoptar" no es post) | — |
| **Login** | Obligatorio para todos. Onboarding = login/registro, sin tutorial | — |
| **Perfil de usuario** | Público (nombre, avatar, **#seguidores, #seguidos (NUEVO v3)**, posts, WhatsApp). **Sin botón de contacto directo (CAMBIADO v3)** | — |
| **Ubicación** | Texto (calle + distrito). Sin lat/lng, sin maps, sin PostGIS | — |
| **Matching** | Matching automático entre Perdido↔Encontrado del **mismo distrito** (normalizado). Adopción NO participa. Tabla `matches` con `notified_at` para idempotencia | Matching por foto/semejanza visual |
| **Fotos por post** | Mínimo 1, máximo 3 | — |
| **Idioma** | Solo Español (Perú). Sin i18n | i18n |
| **Deep links** | Excluidos | Para compartir publicaciones |
| **Veterinarias** | Ingreso manual por admin + sugerencias de usuarios (cola de aprobación) | API Google Places |
| **Admin panel** | Integrado en la app (botón oculto para role=admin) | — |
| **Acciones admin** | Ocultar posts, banear usuarios, aprobar/rechazar veterinarias, marcar resuelto, reactivar posts pausados, **eliminar mensajes de chat ante reporte (NUEVO v3)**, **ver conversaciones reportadas solo-lectura (NUEVO v3)** | — |
| **Editar posts ajenos** | No permitido | — |
| **Baneo de usuario** | Oculta perfil + todos sus posts del feed | — |
| **Estados del post** | `activo`, `pausado`, `resuelto`, `oculto` | — |
| **Validación 30 días** | Cron job Railway (corre diariamente, marca `pausado` los posts activos con `last_validated_at > 30 días`). Notifica al usuario vía Expo Push con pregunta "¿sigues buscando?". Sin cierre forzado | — |
| **Cron scheduler** | Railway Cron Jobs nativo (mín 5 min entre ejecuciones). Job daily para validación 30 días | — |
| **Push tokens multi-dispositivo** | Tabla `push_tokens` uno-a-muchos. Limpieza individual por receipt (`DeviceNotRegistered`) | — |
| **Contacto (CAMBIADO v3)** | **Chat interno primario** iniciado solo desde botones contextualizados de un post ("Quiero adoptar" / "¡Vi a tu perro!" / "¡Es mi perro!"). WhatsApp degradado a botón de respaldo **dentro** del chat. **No existe botón de contacto en el perfil** | — |
| **Chat interno (NUEVO v3)** | Implementado con polling REST 5s (sin Socket.io/WebSockets). 1-a-1 con dueño del post. Contenido: texto + fotos. Botones contextualizados visibles salvo en posts resuelto/oculto. Sin edición/eliminación de mensajes por el usuario. Admin elimina mensajes ante reporte | WebSockets, tiempo real, "escribiendo...", read receipts |
| **Seguidos y seguidores (NUEVO v3)** | Relación unidireccional follower→following. Tabla `follows` con unique compuesto. Sin notificación push al ser seguido. Botón Seguir/Dejar de seguir en perfil de otros | Notificación de nuevo seguidor |
| **Likes (NUEVO v3)** | Único por usuario por post (unique compuesto user_id+post_id). Toggle. Contador público | Lista pública de usuarios que dieron like |
| **Compartidos (NUEVO v3)** | Contador público. Sin unique constraint (mismo usuario puede compartir múltiples veces) | — |
| **Feed (NUEVO v3)** | Organizado en 3 secciones (Perdidos, Encontrados, Quiero Adoptar). Ordenado dentro de cada sección: posts de seguidos primero (ordenados por `created_at DESC`), luego no seguidos (por `created_at DESC`). Paginación cursor preservando el orden ponderado | — |

---

## Plan de Implementación (4 semanas v2 + ~10-13 días por features v3)

1. **Semana 1:** Foundation + Auth (Google OAuth + Email/OTP) + Posts CRUD + Feed con 3 secciones + filtros + esquema DB extendido (`last_validated_at`, `matches`, `push_tokens`)
2. **Semana 2:** Perfil de usuario + Veterinarias (directorio + sugerencias) + Imágenes Cloudinary + matching por distrito
3. **Semana 3:** Moderación + Admin panel integrado + resolución/ocultado/pausado de posts + integración Expo Push (tokens + expo-server-sdk-node + limpieza receipts)
4. **Semana 4 + 3-5 días v2:** Pulido + Testing + Store Prep + cron job 30 días verificado end-to-end + Launch v2
5. **Días adicionales v3 (+10 a +13 días):**
   - **+2.5 días:** Seguidores (tabla `follows` + API follow/unfollow + UI botón + contadores en perfil + listas)
   - **+1.5 días:** Likes/Shares (tablas `post_likes`, columna `posts.shares_count` + API + UI corazón/contador
   - **+0.5 días:** Botones contextualizados en post UI
   - **+2 días:** Feed ponderado (modificación de query con LEFT JOIN `follows` + ORDER BY CASE + cursor adaptado)
   - **+5 a +7 días:** Chat interno (3 tablas nuevas + endpoints + UI lista de conversaciones + UI conversación con polling 5s + push on new message + WhatsApp fallback dentro del chat)
   - **+1 a +2 días:** Pruebas end-to-end chat + seguidores + likes/shares

---

## Riesgos declarados

- **R1 — Railway Free cambios de términos:** durante las 4 semanas del MVP, Railway podría modificar su plan Free (reducción del crédito $1, nuevo sleep, límite de servicios). **Mitigación: Plan B Render Free + warmer externo CronJob.org**, documentado y listo para activar.
- **R2 — Latencia de obtener push token en iOS:** documentación oficial Expo indica que `getExpoPushTokenAsync` puede tardar en resolver en iOS. **Mitigación:** UX muestra "configurando notificaciones" sin bloquear onboarding.
- **R3 — Distrito string libre:** sin enum rígido, dos usuarios escriben "Miraflores" vs "Miraflores, Lima" → no matchean. **Mitigación:** normalización `LOWER(TRIM(distrito))` + validación visual contra lista de 43 distritos de Lima Metropolitan en onboarding.
- **R4 — Caso borde cron 30 días:** si una publicación pierde coincidencia en match entre corridas del cron (pausado → alguien publica compatible), el usuario no recibe notificación. **Mitigación:** publicaciones pausadas no reciben match; al reactivarse, el próximo job de matching evalúa matches pendientes.
- **R5 — Latencia del feed ponderado (NUEVO v3):** cuando un usuario sigue a cientos de otros, el LEFT JOIN con `follows` puede degradar la query del feed. **Mitigación:** índices en `follows(follower_id)` y `posts(user_id, created_at)` + índice compuesto existente `(tipo, distrito_norm, status)`. Medir con >1000 follows; paginar siempre con cursor preservando el orden ponderado.
- **R6 — Polling de chat sobrecarga backend (NUEVO v3):** con muchos usuarios con conversaciones abiertas, el polling 5s puede multiplicar peticiones. **Mitigación:** endpoint `?afterId=N` retorna solo mensajes nuevos (payload mínimo); rate-limit 30 msg/min; monitorear con Sentry. En post-MVP evaluar WebSockets o long-polling.
- **R7 — Abuso de chat (NUEVO v3):** spam o acoso entre usuarios. **Mitigación:** rate-limit 30 msg/min; usuario reporta conversación; admin ve conversación en solo-lectura y elimina mensajes; en caso grave el admin banea al usuario (mecanismo ya existente).
- **R8 — Storage Cloudinary por fotos en chat (NUEVO v3):** fotos en chat aumentan consumo de cuota. **Mitigación:** aplicar `f_auto,q_auto,w_800` a fotos de chat (igual que posts). Vigilar 25GB. Plan pago si se rebasa.
- **R9 — Confusión por botón "¡Es mi perro!" (NUEVO v3):** un usuario no_dueño podría tocar el botón y abrir chat con el dueño. **Mitigación:** el botón abre el chat; el dueño del post valida la identidad en el chat. Sin garantía de propiedad en MVP.

---

## Plan B documentado (si Railway Free cambia términos)

Si Railway Free se vuelve inviable durante el MVP:
1. Migrar backend Express y cron a **Render Free + cron-job.org**.
2. Render Free sleep: 15 min sin tráfico → configurar cron-job.org (gratis, hasta 60 ejecuciones/hora) que haga POST a endpoint `/health` cada 10 minutos para mantener despierto.
3. Limitaciones conocidas Render free: 750h/mes de servicio web, sin one-off jobs (cron fl0 sigue siendo externo), sin SSL custom en free.
4. Presupuesto sigue $0/mes con dependencia de tercero (cron-job.org) — aumentar monitoreo del heartbeat.

Fin del Plan B.

---

> Decisiones v2 mantenidas intactas salvo donde se marca (NUEVO v3) o (CAMBIADO v3). Las modificaciones son resultado de: (a) incorporar interacciones sociales y feed ponderado, (b) revertir la exclusión del chat in-app mediante polling REST, (c) degradar WhatsApp de canal primario a fallback dentro del chat, (d) agregar rate-limit específico para chat y riesgos asociados a las nuevas features.
