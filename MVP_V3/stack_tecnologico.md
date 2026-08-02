# PetFine: Stack Tecnológico

> Versión 3.0 — 30/07/2026
> **Cambios v3:** incorpora interacciones sociales (follows, likes, shares), feed ponderado, chat interno con polling REST (sin WebSockets), 5 tablas nuevas y 1 columna nueva.
> Presupuesto $0/mes confirmado.

---

## Stack Final ($0/mes)

| Capa | Servicio | Plan | Costo | Notas |
|------|----------|------|-------|-------|
| **Mobile Build** | Expo EAS + `--local` | Free | $0 | 30 builds/mes en nube + ilimitado local |
| **Backend** | Railway Free | Free | $0 | $1 crédito/mes incluido cubre servicio Node ~256MB 24/7. Sin sleep. Sin cold starts. Dockerfile deploy |
| **Cron scheduler** | Railway Cron Jobs | Free (incluido) | $0 | 2 cron jobs free. Mín 5 min entre ejecuciones |
| **Base de datos** | Neon Postgres | Free | $0 | 3GB storage, 190h compute/mes, sin PostGIS |
| **Fotos (posts + chat NUEVO v3)** | Cloudinary | Free | $0 | 25GB storage, transformaciones incluidas, no expira |
| **Mapas** | — (sin maps en MVP) | — | $0 | Ubicación es solo texto (calle + distrito) |
| **Matching** | Backend query en Railway | Free | $0 | Query SQL `tipo`, `distrito_norm`, `status`. Tabla `matches` para idempotencia |
| **Chat (NUEVO v3)** | Backend REST polling 5s en Railway | Free | $0 | Sin Socket.io, sin WebSockets. Reutiliza HTTP del API principal |
| **Contacto** | WhatsApp (wa.me) | Free | $0 | Botón de respaldo **dentro** del chat, no canal primario (CAMBIADO v3) |
| **Auth OAuth** | Google OAuth (Passport.js) | Free | $0 | Ilimitado |
| **Auth Email** | Resend | Free | $0 | 3000 emails/mes (OTP) |
| **Notificaciones push** | Expo Push Service | Free | $0 | 600 notif/segundo/proyecto. Sin cuota de mensajes. Escenarios en v3: match, validación 30 días, nuevo mensaje de chat |
| **Monitoreo** | Sentry Free + Railway logs | Free | $0 | 5K errors/mes, logs integrados |
| **Rate limiting** | express-rate-limit (in-memory) | Free | $0 | Suficiente para MVP single-instance. **Includes 30 msg/min usuario en chat (NUEVO v3)** |
| **TOTAL** | | | **$0/mes** | Sin variación respecto a v2 |

---

## Stack Técnico (Lenguajes y Frameworks)

### Frontend (Mobile)
- React Native + Expo
- TailwindCSS + NativeWind
- Zustand (state management)
- React Query (server state + cache)
- `expo-notifications` (recepción de push en dispositivo)
- `expo-device` (obtener push token)

### Backend (API)
- Node.js + Express
- TypeScript
- Drizzle ORM (migrations + type-safe queries)
- Zod (validación)
- Passport.js (Google OAuth)
- `expo-server-sdk-node` — gestión de push tickets, receipts y limpieza de tokens `DeviceNotRegistered`
- Railway Cron Jobs nativo — scheduler para validación 30 días
- **Sin Socket.io (NUEVO v3):** el chat se implementa con polling REST 5s, no WebSockets

### Base de datos
- Neon Postgres (Postgres plano, sin PostGIS)
- Drizzle migrations

---

## Esquema de Base de Datos (NUEVO v3 — cambios resaltados)

### Tablas existentes (mismas que v2)
- `users` — sin cambios (id, name, avatar, whatsapp, role, auth_provider, created_at)
- `veterinarias` — sin cambios
- `push_tokens` — sin cambios (id, user_id, token, created_at)
- `matches` — sin cambios (id, post_perdido_id, post_encontrado_id, distrito_norm, notified_at, created_at)

### Modificaciones a tabla existente
**`posts`** — agregar:
- `shares_count` (integer, default 0) — contador de compartidos (NUEVO v3)

### Tablas nuevas (NUEVO v3)

#### `follows`
| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | — |
| `follower_id` | uuid FK→users | Usuario que sigue |
| `following_id` | uuid FK→users | Usuario seguido |
| `created_at` | timestamp | — |

- **Unique compuesto:** `(follower_id, following_id)`
- **Check constraint:** `follower_id != following_id` (no seguirse a sí mismo)
- **Índices nuevos:** `idx_follows_follower` (follower_id), `idx_follows_following` (following_id)

#### `post_likes`
| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | — |
| `user_id` | uuid FK→users | Quien dio like |
| `post_id` | uuid FK→posts | Post que recibió el like |
| `created_at` | timestamp | — |

- **Unique compuesto:** `(user_id, post_id)` — un usuario, un like por post
- **Índice nuevo:** `idx_post_likes_post` (post_id) — para conteo eficiente
- **ON DELETE CASCADE:** si se elimina el post, se eliminan los likes asociados

#### `conversations`
| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | — |
| `post_id` | uuid FK→posts | Post origen del chat |
| `created_at` | timestamp | — |

- **Índice:** `(post_id)` — para buscar la conversación existente por post y par de usuarios

#### `conversation_participants`
| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | — |
| `conversation_id` | uuid FK→conversations | — |
| `user_id` | uuid FK→users | Un participante (dueño del post o emisor del botón) |

- **Unique compuesto:** `(conversation_id, user_id)` — un par usuario-conversación único
- **Índice:** `(user_id)` — para listar conversaciones de un usuario

#### `messages`
| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | uuid PK | — |
| `conversation_id` | uuid FK→conversations | — |
| `sender_id` | uuid FK→users | Emisor del mensaje |
| `content` | text | Texto del mensaje (nullable si solo foto) |
| `photo_url` | text | URL Cloudinary de foto (nullable si solo texto) |
| `is_auto` | bool default false | true para el mensaje automático inicial con datos del post |
| `created_at` | timestamp | — |

- **Índice compuesto:** `(conversation_id, created_at)` — lookup mensajes de una conversación ordenados por tiempo
- **Endpoint de polling:** `WHERE conversation_id = :id AND id > :afterId ORDER BY id ASC`
- **ON DELETE CASCADE:** si se elimina la conversación, se eliminan los mensajes

---

## Índices de Base de Datos

### Existentes (v2)
- `posts(tipo)` — tipo de post (adopción, perdido, encontrado)
- `posts(distrito_norm)` — normalizado `LOWER(TRIM(distrito))`
- `posts(status)` — estado (activo, pausado, resuelto, oculto)
- `posts(tipo, distrito_norm, status)` — compuesto para query de matching
- `push_tokens(user_id)` — listar tokens por usuario

### Nuevos (v3)
- `follows(follower_id)` — listar a quién sigue un usuario (para feed ponderado)
- `follows(following_id)` — contar seguidores de un usuario
- `post_likes(post_id)` — contar likes de un post
- `conversations(post_id)` — buscar conversación por post
- `conversation_participants(user_id)` — listar conversaciones de un usuario
- `messages(conversation_id, created_at)` — listar mensajes de una conversación

---

## Query de Feed Ponderado (NUEVO v3)

```sql
SELECT p.*, 
       COALESCE(SUM(CASE WHEN l.user_id = :currentUserId THEN 1 ELSE 0 END), 0) AS liked_by_me,
       COUNT(l.id) AS likes_count
FROM posts p
LEFT JOIN follows f 
  ON f.follower_id = :currentUserId 
  AND f.following_id = p.user_id
LEFT JOIN post_likes l 
  ON l.post_id = p.id
WHERE p.tipo = :tipo
  AND p.status = 'activo'
  AND (:distrito IS NULL OR p.distrito_norm = LOWER(TRIM(:distrito)))
GROUP BY p.id, f.follower_id
ORDER BY 
  CASE WHEN f.follower_id IS NOT NULL THEN 0 ELSE 1 END,
  p.created_at DESC
LIMIT 20;
```

- Cursor: paginar por `(is_followed, created_at, id)` preservando el orden ponderado
- `is_followed` se calcula como `(f.follower_id IS NOT NULL)` en cada página

---

## Query de Polling de Chat (NUEVO v3)

```sql
SELECT id, sender_id, content, photo_url, is_auto, created_at
FROM messages
WHERE conversation_id = :conversationId
  AND id > :afterId
ORDER BY id ASC;
```

- Endpoint: `GET /api/conversations/:convId/messages?afterId=N`
- El cliente IDLE mantiene polling cada 5s cuando la conversación está abierta
- No hay WebSockets: backend solo responde a este GET

---

## API REST — Endpoints (MVP v3)

### Existentes (v2, sin cambios funcionales)
- Auth: `POST /auth/google`, `POST /auth/email/request-otp`, `POST /auth/email/verify-otp`
- Posts: `POST /api/posts`, `GET /api/posts/:id`, `PATCH /api/posts/:id/status`
- Feed: `GET /api/feed/:tipo` (MODIFICADO en v3 — ver query ponderado más arriba)
- Veterinarias: `POST /api/veterinarias/suggest`, `GET /api/veterinarias`, `PATCH /api/veterinarias/:id/approve` (admin)
- Push tokens: `POST /api/push-tokens`, `DELETE /api/push-tokens/:token`
- Matches: interno (no expuesto como endpoint público — se ejecuta al publicar post)

### Nuevos (NUEVO v3)

#### Seguidos / Seguidores
- `POST /api/follows/:userId` — Seguir a un usuario
- `DELETE /api/follows/:userId` — Dejar de seguir
- `GET /api/users/:userId/followers` — Lista paginada de seguidores
- `GET /api/users/:userId/following` — Lista paginada de seguidos
- `GET /api/users/:userId/is-following` — ¿El usuario actual sigue a `userId`? (para botón UI)

#### Likes / Compartidos
- `POST /api/posts/:postId/like` — Toggle like/unlike (POST = like, DELETE dentro del handler = unlike) 
- `GET /api/posts/:postId/like-status` — ¿Usuario actual dio like?
- `POST /api/posts/:postId/share` — Incrementar shares_count

#### Chat interno
- `GET /api/conversations` — Listar conversaciones del usuario actual (paginadas)
- `POST /api/conversations` — Crear conversación desde un post (body: `{ postId }`)
  - Backend valida: si existe conversación `(post_id, usuario actual, dueño del post)` → la devuelve (200), si no existe → la crea (201)
  - Backend inserta el mensaje automático inicial con datos del post
  - Backend valida que el post esté en estado `activo` o `pausado` (si no, responde 409)
- `GET /api/conversations/:convId/messages?afterId=N` — Mensajes nuevos (parsed para polling 5s)
- `POST /api/conversations/:convId/messages` — Enviar mensaje (body: `{ content, photoUrl }`)
  - Valida `sender_id` sea participante
  - Respuesta 403 si no es participante
  - Trigger de push al destinatario si la conversación no está marcada como abierta (ver `mark-read`)
  - Rate-limit 30 msg/min/usuario
- `POST /api/conversations/:convId/mark-read` — Marcar conversación como leída (elimina indicador de no leído)
- `DELETE /api/conversations/:convId/messages/:msgId` — Solo admin (elimina un mensaje ante reporte)

#### Perfil (extiende v2)
- `GET /api/users/:userId` — Perfil público (incluye seguidores_count, following_count, is_followed_by_me)
- `PATCH /api/users/me` — Edición del propio perfil

---

## Consideraciones Técnicas Clave

### Railway Free
- **No sleep** — siempre activo. El backend nunca se duerme (clave para matching on-publish y chat por polling)
- **$1 crédito mensual** incluido — suficiente para 1 servicio ~256MB RAM (720h/mes = consumo completo del mes)
- **Dockerfile deploy**
- Plan B documentado en `decisiones_pactadas.md`: Render Free + CronJob.org si Railway cambia términos
- Límite: 1 vCPU / 0.5 GB por servicio en plan Free

### Polling de chat 5s (NUEVO v3) — sin Socket.io
- Decisión deliberada: no usar WebSockets para mantener el stack simple y el backend dentro del límite de Railway Free
- El cliente consulta `GET /conversations/:id/messages?afterId=N` cada 5 segundos cuando tiene una conversación abierta
- Latencia máxima aparente de mensaje: 5 segundos. Aceptable para MVP
- El endpoint debe devolver solo mensajes nuevos (payload mínimo, no toda la conversación)
- El rate-limit de chat es **30 msg/min por usuario** (no incluye lectura por polling, que es lectura y cubierta por el rate-limit general 100/min/IP)
- En post-MVP: evaluar WebSockets con Socket.io o Server-Sent Events

### Neon Postgres (sin PostGIS)
- Solo Postgres plano
- 190h compute/mes: suficiente para MVP baja concurrencia
- **Riesgo v3:** el feed ponderado con many follows puede degradarse. Mitigación: índices en `follows` y `posts(user_id, created_at)`

### Matching por distrito
- Query SQL en Railway (sin cambios respecto a v2):
  ```sql
  SELECT * FROM posts
  WHERE tipo = 'encontrado'
    AND distrito_norm = LOWER(TRIM(:distrito))
    AND status = 'activo';
  ```
- Tabla `matches` con `notified_at` nullable para idempotencia
- Disparado al **publicar** un post tipo Perdido o Encontrado
- Adopción NO participa en matching

### Cloudinary (posts + chat NUEVO v3)
- Upload server-side con API key (no exponer en mobile)
- Transformaciones: `f_auto,q_auto,w_800` para compresión automática
- **NUEVO v3:** las fotos en chat usan el mismo flujo que las de posts (subida desde el backend)
- Límites: 25GB storage, transformaciones ilimitadas
- Riesgo v3: storage puede rebasarse por fotos en chat. Mitigación: `f_auto,q_auto,w_800` + monitoreo

### Expo Push (sin cambios desde v2, + nuevo escenario v3)
- Límite: 600 notificaciones/segundo por proyecto
- Tokens: `getExpoPushTokenAsync()` en el cliente, almacenados en `push_tokens` (uno-a-muchos por usuario)
- `expo-server-sdk-node` envía en batch (hasta 100 por request), recibe receipts
- `DeviceNotRegistered` → eliminar token de `push_tokens`
- **Escenarios de push en MVP v3:**
  1. Match encontrado: "¡Alguien publicó un perro compatible con tu reporte en [distrito]!"
  2. Validación 30 días: "[Nombre del perro] — han pasado 30 días, ¿sigues buscando?"
  3. **Nuevo mensaje de chat (NUEVO v3):** "Nuevo mensaje de [nombre] sobre [título del post]"

### Rate Limiting in-memory
- **Límites v3:**
  - General: 100 req/min por IP
  - Creación de posts: 5 posts/hora por usuario
  - **Chat (NUEVO v3):** 30 msg/min por usuario
- Adecuado para single-instance Railway
- Si escala multi-VM → migrar a Upstash Redis

---

## Plan B: Render Free + warmer

Documentado en `decisiones_pactadas.md`. Si Railway Free no es viable:
- Render Free: sleep tras 15 min sin tráfico → cron-job.org (gratis) hace POST a `/health` cada 10 min
- Limitaciones: 750h/mes, sin persistent disk, sin one-off jobs
- Presupuesto sigue $0/mes pero con dependencia de tercero para el warmer
