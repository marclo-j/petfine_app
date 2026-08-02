# PetFine: Definición del Producto MVP

> Versión 3.0 — 30/07/2026 (MVP expandido con interacciones sociales y chat interno)
> MVP de 4 semanas + ~10-13 días — Presupuesto $0/mes — Español (Perú)
>
> **Cambios vs v2.0:** habilitación de interacciones sociales (seguidos/seguidores con feed ponderado, likes, compartidos), chat interno iniciado desde posts con WhatsApp degradado a fallback, botones contextualizados por tipo de post, validación 30 días por cron. Ver `requerimientos_mvp_v3.md` para el detalle funcional y no funcional con IDs codificados.

---

## 1. Descripción del Producto

**PetFine** es una aplicación móvil para publicar perros en adopción, perdidos o encontrados. Permite conectar a personas que necesitan ayuda con animales, facilitando el contacto vía **chat interno** con WhatsApp como respaldo. Incluye un directorio de veterinarias verificadas, **notificaciones automáticas (push)** cuando hay match entre publicaciones, **interacciones sociales** (seguidores, likes, compartidos), y un feed organizado en secciones con orden ponderado que prioriza posts de usuarios seguidos.

---

## 2. Objetivo del MVP

Lanzar en 4 semanas + ~10-13 días una app funcional que permita:
- Publicar perros (adopción, perdidos, encontrados)
- Ver publicaciones organizadas en 3 secciones, ordenadas por seguidos primero
- Interactuar socialmente: seguir usuarios, dar likes, compartir posts
- Contactar vía **chat interno** (iniciado solo desde botones contextualizados de un post)
- Sugerir veterinarias
- Moderación manual por admin
- Matching automático entre Perdido↔Encontrado del mismo distrito
- Notificaciones push (match, validación 30 días, nuevos mensajes de chat)
- Validación 30 días de posts activos (cron)

---

## 3. Público Objetivo

- Personas que dan perros en adopción
- Personas que perdieron a su perro
- Personas que encontraron un perro sin dueño
- Personas que quieren adoptar un perro (solo consumen el feed filtrado, no publican)

---

## 4. Features Incluidas en el MVP

### 4.1 Autenticación
- **Google OAuth** (registro/login rápido)
- **Email + OTP** (registro manual opcional vía Resend)
- Onboarding obligatorio: pantalla de login/registro requerida para entrar a la app
- Todos los usuarios deben estar logueados (no hay feed libre anónimo)

### 4.2 Publicaciones (Posts)
- **3 tipos de publicación:**
  1. **Adopción** — Se da un perro en adopción
  2. **Perdido** — Se perdió un perro
  3. **Encontrado** — Se encontró un perro sin dueño
- **"Quiero adoptar" NO es un tipo de post.** Es un usuario que solo filtra el feed por tipo=adopción y contacta. No publica nada.
- Datos requeridos por post:
  - Tipo (adopción / perdido / encontrado)
  - Título
  - Descripción
  - Fotos (mínimo 1, máximo 3) en Cloudinary
  - Ubicación: calle + distrito (solo texto, sin lat/lng, sin maps)
  - WhatsApp de contacto (usado por el chat como fallback)
- Estados del post:
  - `activo` — visible en el feed
  - `pausado` — marcado por cron tras 30 días sin cierre. No visible en feed principal, accesible vía perfil del dueño. Reactivable por dueño o admin. No recibe notificaciones de match mientras esté pausado.
  - `resuelto` — marcado por el usuario o admin, desaparece del feed
  - `oculto` — marcado por admin (moderación)
- **Matching automático:** al publicar un post tipo `perdido` o `encontrado`, el backend busca posts activos del tipo opuesto en el mismo distrito normalizado `LOWER(TRIM(distrito))`. Si encuentra coincidencias, registra match en tabla `matches` (con `notified_at` para idempotencia) y envía push a los dueños de ambos posts. El tipo `adopción` NO participa en matching.

### 4.3 Feed Principal
- **3 secciones:** Perdidos, Encontrados, Quiero Adoptar (filtro tipo=adopción)
- **Orden ponderado por seguidos (NUEVO v3):** dentro de cada sección, los posts publicados por usuarios que el usuario actual sigue aparecen primero, luego los de usuarios que no sigue. Dentro de cada grupo, orden descendente por `created_at`.
- **Bloque "Posibles coincidencias":** inserta al inicio de las secciones Perdidos y Encontrados una sección con posts del tipo opuesto del mismo distrito (origen: tabla `matches`). Visible solo si hay matches pendientes de acción.
- Filtros por distrito por sección
- Pull-to-refresh
- Paginación infinita con cursor (20 posts por página) respetando el orden ponderado
- Posts en estados `pausado`, `resuelto` u `oculto` no aparecen en el feed

### 4.4 Interacciones sociales (NUEVO v3)
- **Me gusta en posts:** cualquier usuario autenticado puede dar "Me gusta" a un post, con un único like por usuario por post (unique compuesto). Toggle para quitar like. Contador visible públicamente.
- **Compartidos en posts:** cualquier usuario autenticado puede compartir un post. Contador público. Sin límite por usuario (no unique constraint).
- **Seguidos y seguidores:** un usuario puede seguir a otro de forma unidireccional (`follower_id` → `following_id`). Unique compuesto. No se puede seguir a sí mismo. Sin notificación push al dejar/dejar de seguir (v3).

### 4.5 Chat interno (NUEVO v3)
- **El chat se inicia ÚNICAMENTE desde un botón contextualizado en un post.** No existe botón de contacto directo en el perfil.
- **Botones contextualizados por tipo:**
  - Tipo `adopcion` → "Quiero adoptar"
  - Tipo `perdido` → "¡Vi a tu perro!"
  - Tipo `encontrado` → "¡Es mi perro!"
- **Visibilidad del botón:** aparece en estados `activo` y `pausado`. Oculto en `resuelto` y `oculto`.
- Al tocar el botón, se crea (si no existe) o abre una conversación 1-a-1 entre el usuario actual y el dueño del post.
- **Contenido del chat:** texto + fotos. Sin audio, sin video.
- **Entrega de mensajes:** polling cada 5 segundos en la conversación abierta (sin WebSockets ni Socket.io).
- **Notificación push:** cuando llega un mensaje nuevo y el destinatario no tiene la conversación abierta, recibe push "Nuevo mensaje de [nombre] sobre [título del post]".
- **Pestaña "Mensajes"** en la app: lista conversaciones activas ordenadas por última actividad, con nombre, avatar, último mensaje, timestamp, e indicador de no leído.
- **WhatsApp como respaldo dentro del chat:** cada conversación incluye un botón "Contactar por WhatsApp" que abre `wa.me` con el teléfono del dueño del post.
- **Sin edición ni eliminación de mensajes por el usuario.** El admin puede eliminar mensajes individuales en caso de abuso.
- **El admin puede ver conversaciones en modo solo-lectura** cuando exista un reporte vinculado.

### 4.6 Perfil de Usuario
- **Público** (visible para otros usuarios autenticados)
- **Datos visibles (NUEVO v3):** nombre, avatar, número de seguidores, número de seguidos, lista de seguidores, lista de seguidos, posts publicados (incluye posts `pausados` del propio usuario), WhatsApp.
- **Botón Seguir/Dejar de seguir** visible en el perfil de otros usuarios.
- **NO existe botón de "Contactar" ni de "Iniciar chat" en el perfil (NUEVO v3).** El chat se inicia únicamente desde el botón contextualizado de un post.
- Editable por el propio usuario (nombre, avatar, WhatsApp).
- **Gestión de push tokens silenciosa:** el dispositivo registra su `ExpoPushToken` al primer login. Soporta un token por dispositivo (un usuario puede tener tokens múltiples → tabla `push_tokens` uno-a-muchos). Los tokens inválidos (`DeviceNotRegistered` en receipts) se eliminan automáticamente.

### 4.7 Veterinarias
- Directory list de veterinarias verificadas
- **Ingreso manual por admin** (seed inicial + carga progresiva)
- **Sugerencia por usuarios**: cualquier usuario logueado puede sugerir una veterinaria → entra en cola de revisión → admin aprueba o rechaza
- Datos por veterinaria: nombre, dirección, distrito, teléfono, horarios

### 4.8 Moderación (Admin)
- El admin ingresa a la app como un usuario normal
- Botón adicional oculto (solo visible para role=admin) que redirige al panel admin
- Acciones del admin:
  - ✅ **Ocultar posts** (moderación de contenido)
  - ✅ **Banear usuarios** (oculta automáticamente el perfil + todos sus posts)
  - ✅ **Aprobar / rechazar veterinarias sugeridas**
  - ✅ **Marcar post como resuelto**
  - ✅ **Reactivar posts pausados** (vuelve a `activo` y reinicia `last_validated_at`)
  - ✅ **Eliminar mensajes individuales de chat** en caso de reporte (NUEVO v3)
  - ✅ **Ver conversaciones en disputa** solo-lectura cuando hay reporte (NUEVO v3)
  - ❌ Editar posts ajenos (no incluido)

### 4.9 Resolución de Posts
- El usuario que publicó puede marcar su post como "resuelto"
- El admin también puede marcar como resuelto cualquier post
- Post resuelto → desaparece del feed
- **Transiciones entre estados:**
  - `activo` ↔ `pausado`: usuario o admin pueden reactivar (vuelve a `activo`, reinicia `last_validated_at`)
  - `activo` → `pausado`: solo por cron automático (30 días sin cierre)
  - `activo`/`pausado` → `resuelto`: dueño o admin
  - `activo`/`pausado` → `oculto`: admin
  - `resuelto` / `oculto`: terminales en MVP

---

## 5. Features Excluidas del MVP (Post-MVP)

- **Sistema de puntuación peer-rating** — eliminado por simplificación de producto
- **Mapa nativo / lat-lng / PostGIS / búsqueda por radio** — ubicación es solo texto (calle + distrito). Matching es por distrito exacto
- **Chat con WebSockets / tiempo real / "escribiendo..." / fotos en chat — solo polling 5s + texto + fotos** (NUEVO v3)
- **Llamadas dentro de la app**
- **Deep links / compartir publicaciones fuera de la app** — post-MVP
- **Favoritos / guardados / historial de usuario** — post-MVP
- **Onboarding con tutorial** — solo pantalla de login/registro, sin tutorial
- **Analytics avanzado** — solo Sentry (crash tracking) en MVP
- **i18n (multi-idioma)** — solo español (Perú)
- **Notificación push de nuevo seguidor** — excluido en v3 (no se notifica al seguir/dejar de seguir)
- **Edición o eliminación de mensajes por el usuario** — excluido en v3 (solo admin_elimina mensajes)

---

## 6. Reglas de Negocio Definitivas

### 6.1 Reglas de Usuarios
| Regla | Definición |
|-------|------------|
| Login obligatorio | Todos los usuarios deben loguearse para entrar a la app |
| Onboarding | Pantalla de login/registro obligatoria (sin tutorial) |
| Perfil | Público para otros usuarios autenticados |
| Baneo | Admin puede banear → perfil y posts se ocultan automáticamente |

### 6.2 Reglas de Publicaciones
| Regla | Definición |
|-------|------------|
| Tipos | Adopción, Perdido, Encontrado (3 tipos) |
| "Quiero adoptar" | NO es post. Usuario que filtra feed por tipo=adopción |
| Fotos | Mínimo 1, máximo 3 por post |
| Ubicación | Calle + distrito (texto). Sin lat/lng, sin maps |
| Estado activo | Visible en feed |
| Estado pausado | No visible en feed. Marcado por cron tras 30 días sin cierre. Reactivable por dueño o admin |
| Estado resuelto | Desaparece del feed. Marcable por usuario o admin |
| Estado oculto | Marcado por admin (moderación). No visible en feed |

### 6.3 Reglas de Interacciones Sociales (NUEVO v3)
| Regla | Definición |
|-------|------------|
| Like | Único por usuario por post (unique compuesto). Toggle. Contador público |
| Compartido | Contador público. Sin límite por usuario |
| Seguir | Relación unidireccional follower→following. Unique compuesto. No auto-follow |
| Notificación al seguir | NO se notifica al ser seguido en MVP v3 |
| Feed ponderado | Posts de seguidos primero, luego no seguidos, por sección. Dentro de cada grupo por `created_at DESC` |

### 6.4 Reglas de Chat (NUEVO v3)
| Regla | Definición |
|-------|------------|
| Inicio del chat | Únicamente desde el botón contextualizado de un post. Sin botón de chat en el perfil |
| Botón "Quiero adoptar" | Posts tipo adopcion. Crea/abre conversación 1-a-1 con el dueño |
| Botón "¡Vi a tu perro!" | Posts tipo perdido. Crea/abre conversación 1-a-1 con el dueño |
| Botón "¡Es mi perro!" | Posts tipo encontrado. Crea/abre conversación 1-a-1 con el dueño |
| Visibilidad botón | Visible en `activo` y `pausado`. Oculto en `resuelto` y `oculto` |
| Participantes | 1-a-1: usuario emisor y dueño del post. Sin grupos |
| Reutilización | Tocar el botón reabre la misma conversación existente para ese post y ese par |
| Contenido | Texto + fotos (Cloudinary). Sin audio, sin video |
| Entrega | Polling 5s (sin WebSockets) |
| Push | Notificación push al destinatario si no tiene la conversación abierta |
| WhatsApp | Botón secundario dentro del chat, abre wa.me |
| Edición mensajes | No permitida en MVP |
| Eliminación mensajes | Solo por admin (moderación ante reporte) |
| Admin ve conversación | Solo-lectura cuando hay reporte vinculado |

### 6.5 Reglas de Veterinarias
| Regla | Definición |
|-------|------------|
| Ingreso oficial | Manual por admin |
| Sugerencia | Cualquier usuario logueado puede sugerir |
| Cola de aprobación | Sugerencias entran en cola → admin aprueba o rechaza |
| Datos | Nombre, dirección, distrito, teléfono, horarios |

### 6.6 Reglas de Moderación
| Acción | Permisos |
|--------|----------|
| Ocultar post | Admin |
| Banear usuario | Admin (oculta perfil + posts) |
| Aprobar veterinaria | Admin |
| Rechazar veterinaria | Admin |
| Marcar resuelto | Usuario dueño del post O Admin |
| Reactivar post pausado | Admin (vuelve a activo, reinicia last_validated_at) |
| Eliminar mensaje de chat | Admin (solo ante reporte) |
| Ver conversación ajena | Admin (solo-lectura, ante reporte) |
| Editar post ajeno | ❌ No permitido |

### 6.7 Reglas de Matching
| Regla | Definición |
|-------|------------|
| Coincidencia | Perdido ↔ Encontrado del mismo distrito |
| Distrito | String normalizado (`LOWER(TRIM(distrito))`). Sin lat/lng, sin radio |
| Adopción | **Nunca participa en matching** |
| Cuándo matchear | Al publicar un nuevo reporte de Perdido o Encontrado |
| Tabla matches | Registra idempotencia con `notified_at` para evitar doble notificación |
| Push | Expo Push hacia todos los dispositivos del dueño del post coincidente |
| Tokens inválidos | `DeviceNotRegistered` → se eliminan de `push_tokens` tras receipt |

### 6.8 Reglas de Revalidación
| Regla | Definición |
|-------|------------|
| Trigger | Cron job Railway corre **diariamente**, busca posts activos con `last_validated_at > 30 días` |
| Acción automática | Post pasa a `pausado` (no aparece en feed principal) |
| Notificación | Expo Push al dueño: "¿Sigues buscando a tu perro?" |
| Opciones del usuario | Reactivar (vuelve a `activo`, reinicia `last_validated_at`) o Dejar como está (sigue `pausado`) |
| Sin expiración forzada | El sistema nunca elimina un post por sí solo |
| Reactivación por admin | Admin puede reactivar posts pausados desde el panel (restablece `activo` + `last_validated_at`)

---

## 7. Flujos de Usuario Principales

### Flujo 1: Usuario publica un perro en adopción
1. App abre → onboarding login/registro
2. Login (Google o email+OTP)
3. Botón "Crear publicación"
4. Selecciona tipo: Adopción
5. Completa: título, descripción, sube 1-3 fotos, calle, distrito, WhatsApp
6. Publica → post aparece en feed (sección Quiero Adoptar)

### Flujo 2: Usuario quiere adoptar (consumidor)
1. App abre → onboarding login/registro
2. Login
3. Ve feed en sección "Quiero Adoptar" (ordenado: primero posts de seguidos)
4. Toca un post → ve detalle + botón "Quiero adoptar"
5. Toca "Quiero adoptar" → se abre chat interno con el dueño del post
6. Conversa por texto/fotos → si el otro no responde, puede tocar "Contactar por WhatsApp" como respaldo

### Flujo 3: Usuario pierde a su perro
1. Login → "Crear publicación" → tipo: Perdido
2. Completa datos + fotos + última vez visto + calle + distrito
3. Publica → aparece en sección "Perdidos"
4. **Matching automático:** si hay posts `encontrado` activos del mismo distrito, se notifica push al dueño del post coincidente y se inserta en bloque "Posibles coincidencias"
5. Cuando alguien ve el perro perdido, toca "¡Vi a tu perro!" en el post → abre chat con el dueño
6. Cuando recupera → marca como resuelto → desaparece del feed

### Flujo 4: Usuario encontró un perro
1. Login → "Crear publicación" → tipo: Encontrado
2. Completa datos + fotos + calle + distrito
3. Publica → aparece en sección "Encontrados"
4. Si alguien cree que es suyo, toca "¡Es mi perro!" → abre chat con el dueño del post (encontrador)
5. Coordinan entrega por chat (o WhatsApp fallback)
6. Ambos marcan sus posts como resueltos → desaparecen del feed

### Flujo 5: Usuario sugiere veterinaria
1. Login → sección veterinarias
2. Botón "Sugerir veterinaria"
3. Completa: nombre, dirección, distrito, teléfono, horarios
4. Sugerencia entra en cola → admin aprueba/rechaza
5. Si aprobada → aparece en directorio oficial

### Flujo 6: Admin modera
1. Login (cuenta admin) → botón admin oculto visible
2. Toca botón → entra al panel admin
3. Ve posts reportados/pendientes → oculta si corresponde
4. Ve usuarios → banea si corresponde (oculta perfil + posts)
5. Ve veterinarias sugeridas → aprueba/rechaza
6. Ve lista de posts pausados → reactiva si corresponde
7. **Ante reporte de chat:** abre conversación en modo solo-lectura, elimina mensajes problemáticos si corresponde

### Flujo 7: Matching automático Perdido↔Encontrado
1. Usuario publica un post tipo "Perdido"
2. Backend ejecuta query: busca posts "Encontrado" activos del mismo distrito
3. **Si encuentra match(s):**
   a. Crea registro en tabla `matches` con `notified_at`
   b. Envía Expo Push a todos los dispositivos del dueño del post encontrado
   c. El dueño del encontrado ve el match en feed → bloque "Posibles coincidencias"
   d. Toca **"¡Es mi perro!"** → abre chat interno con el dueño del perdido
   e. Coordinan reencuentro
   f. Ambos marcan sus posts como "resuelto" → desaparecen del feed
4. **Si no encuentra match:** post queda `activo` a la espera de futuros matches

### Flujo 8: Validación 30 días
1. Cron job Railway corre diariamente (cada 24h UTC)
2. Para cada post `activo` con `last_validated_at` > 30 días (o NULL y `created_at` > 30 días):
   a. Cambia estado a `pausado`
   b. Envía Expo Push al dueño: "Han pasado 30 días. ¿Sigues buscando a [nombre del perro]?"
3. Usuario recibe notificación push → abre app
4. Ve opciones en el post (desde perfil, ya que está pausado):
   - **"Sí, sigo buscando"** → post vuelve a `activo`, `last_validated_at` = ahora
   - **"Pausar por ahora"** → post sigue `pausado`, no recibe match ni notificaciones
   - **"Ya se resolvió"** → post pasa a `resuelto`, desaparece del feed
5. Si el usuario no reacciona → post permanece `pausado`
6. El cron corre al día siguiente sin re-procesar posts que ya están `pausados`

### Flujo 9: Seguir a otro usuario (NUEVO v3)
1. Desde un post o desde la lista de seguidores de otro perfil, el usuario toca el avatar o nombre → va al perfil
2. Ve contador de seguidores y seguidos, botón "Seguir"
3. Toca "Seguir" → relación creada inmediatamente (sin notificación al seguido)
4. A partir de ese momento, los posts del usuario seguido aparecerán primero en el feed de cada sección
5. Puede tocar "Dejar de seguir" en cualquier momento, sin notificación

### Flujo 10: Dar like y compartir (NUEVO v3)
1. En cualquier post del feed o del detalle, el usuario toca el icono de corazón → incrementa el contador de likes y el botón se marca activo
2. Toca nuevamente → quita el like (toggle), contador decrementa
3. Toca el icono de compartir → se incrementa el contador de compartidos (sin límite por usuario)
4. Los contadores son visibles para todos los usuarios autenticados

---

## 8. Restricciones del MVP

- **Timeline:** 4 semanas + ~10-13 días adicionales por features v3
- **Presupuesto:** $0/mes
- **Idioma:** Español (Perú)
- **Alcance geográfico:** Inicial Perú (validar con seed de veterinarias)
- **Plataforma:** iOS + Android (Expo)
- **Notificaciones push activas (Expo Push).** Límite: 600 notificaciones/segundo por proyecto. Sin cuota de mensajes
- **Sin WebSockets ni Socket.io** en chat. Implementación por polling REST 5s (NUEVO v3)
- **Chat 1-a-1 exclusivamente.** Sin grupos (NUEVO v3)
- **Sin edición ni eliminación de mensajes por el usuario** (NUEVO v3)

---

## 9. Criterios de Aceptación del MVP

1. Usuario se registra/login (Google o email+OTP) → entra a la app
2. Usuario crea post (3 tipos: adopción, perdido, encontrado) con min 1 foto, calle + distrito
3. Usuario ve feed en 3 secciones, con posts de seguidos primero en cada sección (NUEVO v3)
4. Usuario puede dar/quitar like a un post. Contador público (NUEVO v3)
5. Usuario puede compartir un post. Contador público (NUEVO v3)
6. Usuario puede seguir/dejar de seguir a otro usuario desde su perfil (NUEVO v3)
7. Usuario puede ver número de seguidores y seguidos en cualquier perfil (NUEVO v3)
8. Usuario toca el botón contextualizado de un post ("Quiero adoptar" / "¡Vi a tu perro!" / "¡Es mi perro!") → se abre el chat interno 1-a-1 con el dueño (NUEVO v3)
9. Usuario puede enviar texto + fotos en el chat. Recibe push de mensajes nuevos (NUEVO v3)
10. Usuario puede tocar "Contactar por WhatsApp" dentro del chat como respaldo (NUEVO v3)
11. Usuario puede marcar su post como resuelto → desaparece del feed
12. Usuario puede sugerir veterinaria → admin la aprueba → aparece en directorio
13. Admin puede ocultar posts, banear usuarios, eliminar mensajes en disputa, ver conversaciones reportadas
14. App deployada en TestFlight + Play Internal
15. Usuario recibe Expo Push cuando alguien pública un post compatible con su reporte activo del mismo distrito
16. Usuario puede reactivar su post pausado tras notificación de verificación de 30 días
17. Cron job Railway corre diariamente y marca posts como `pausado` correctamente
