# PetFine: Requerimientos Funcionales y No Funcionales (MVP V3)

> Versión 3.0 — 30/07/2026
> MVP v3 = MVP v2 + interacciones sociales (seguidores, likes, compartidos), feed ponderado por seguidos, y chat interno iniciado desde posts.
> Nomenclatura basada en Visure Solutions (formato "El sistema debe...") con IDs codificados para trazabilidad.

---

## 1. Requisitos Funcionales

### 1.1 Autenticación

**RF-01 — Registro y login**: El sistema debe permitir a los usuarios registrarse e iniciar sesión utilizando Google OAuth o email + OTP (vía Resend), con onboarding obligatorio previo al uso de la app.

**RF-02 — Login obligatorio**: El sistema debe bloquear el acceso al feed y a cualquier funcionalidad de la app a usuarios no autenticados. No existe feed anónimo.

**RF-03 — Onboarding sin tutorial**: El sistema debe mostrar únicamente la pantalla de login/registro durante el onboarding, sin tutorial ni pantallas informativas adicionales.

**RF-04 — Roles de usuario**: El sistema debe asignar el rol `user` por defecto a todo nuevo registro, y permitir que cuentas marcadas como `admin` accedan a un panel de moderación oculto visible solo para role=admin.

### 1.2 Publicaciones (Posts)

**RF-05 — Tipos de publicación**: El sistema debe permitir crear publicaciones de exactamente 3 tipos: `adopcion`, `perdido`, `encontrado`.

**RF-06 — Datos obligatorios de un post**: El sistema debe exigir los siguientes campos para crear una publicación: tipo, título, descripción, mínimo 1 y máximo 3 fotos (subidas a Cloudinary), calle, distrito, y WhatsApp de contacto.

**RF-07 — Ubicación texto-only**: El sistema debe almacenar la ubicación de un post únicamente como texto (calle + distrito), sin lat/lng, sin mapas, sin PostGIS.

**RF-08 — Normalización de distrito**: El sistema debe normalizar el distrito al guardarlo y al consultarlo usando `LOWER(TRIM(distrito))`, con el fin de habilitar matching exacto por distrito.

**RF-09 — Estados del post**: El sistema debe gestionar 4 estados de publicación: `activo` (visible en feed), `pausado` (no visible en feed, accesible solo desde perfil del dueño), `resuelto` (desaparece del feed), `oculto` (moderación admin, no visible).

**RF-10 — Transiciones de estado**: El sistema debe aplicar las siguientes transiciones de estado: `activo`→`pausado` (solo por cron 30 días), `activo`↔`pausado` (reactivable por dueño o admin), `activo`/`pausado`→`resuelto` (dueño o admin), `activo`/`pausado`→`oculto` (admin), `resuelto`/`oculto` son terminales en MVP.

**RF-11 — Validación 30 días**: El sistema debe ejecutar diariamente (vía Railway Cron Job) un proceso que marque como `pausado` todo post `activo` con `last_validated_at` mayor a 30 días, y enviar push al dueño preguntando "¿sigues buscando?".

### 1.3 Interacciones sociales (likes y compartidos)

**RF-12 — Like en un post**: El sistema debe permitir a cualquier usuario autenticado dar "Me gusta" a un post, con la restricción de un único like por usuario por post (unique compuesto user_id + post_id).

**RF-13 — Quitar like (toggle)**: El sistema debe permitir quitar un "Me gusto" previamente dado, eliminando el registro de like sin dejar rastro.

**RF-14 — Contador de likes público**: El sistema debe mostrar el contador total de likes en cada post, visible para cualquier usuario autenticado.

**RF-15 — Indicador de like propio**: El sistema debe marcar visualmente el botón de "Me gusta" como activo cuando el usuario actual ya haya dado like al post.

**RF-16 — Compartir un post**: El sistema debe permitir a cualquier usuario autenticado compartir un post, incrementando el contador de compartidos del post.

**RF-17 — Contador de compartidos público**: El sistema debe mostrar el contador total de compartidos en cada post, visible para cualquier usuario autenticado.

**RF-18 — Sin límite de compartidos**: El sistema debe permitir que un usuario comparta el mismo post múltiples veces (no existe unique constraint por usuario para shares).

### 1.4 Seguidos y seguidores

**RF-19 — Seguir a un usuario**: El sistema debe permitir a un usuario autenticado seguir a otro usuario, creando una relación unidireccional (follower_id → following_id).

**RF-20 — Restricciones de follow**: El sistema debe impedir que un usuario siga al mismo usuario dos veces (unique compuesto follower_id + following_id) y que un usuario se siga a sí mismo (validación en backend).

**RF-21 — Dejar de seguir**: El sistema debe permitir a un usuario dejar de seguir a otro usuario, eliminando el registro de `follows` sin enviar notificación al usuario objetivo.

**RF-22 — Sin notificaciones de nuevo seguidor**: El sistema NO debe enviar notificación push cuando un usuario comienza a seguir a otro, en el MVP v3.

**RF-23 — Contadores en el perfil**: El sistema debe mostrar en el perfil público de cada usuario el número de seguidores y el número de seguidos.

**RF-24 — Botón Seguir/Dejar de seguir**: El sistema debe mostrar en el perfil de otro usuario un botón "Seguir" o "Dejar de seguir" según el estado actual de la relación.

**RF-25 — Listas de seguidores y seguidos**: El sistema debe permitir ver, desde el perfil de cualquier usuario, la lista paginada de seguidores y la lista paginada de seguidos (cada item muestra nombre y avatar).

### 1.5 Feed

**RF-26 — Tres secciones de feed**: El sistema debe organizar el feed en 3 secciones: Perdidos, Encontrados, y Quiero Adoptar (esta última filtra posts por tipo=adopción).

**RF-27 — Orden ponderado por seguidos**: El sistema debe ordenar los posts dentro de cada sección mostrando primero los posts publicados por usuarios que el usuario actual sigue, y luego los posts de usuarios que no sigue.

**RF-28 — Orden secundario**: El sistema debe ordenar, dentro del grupo de seguidos y dentro del grupo de no seguidos, por fecha de creación descendente (más reciente primero).

**RF-29 — Paginación con cursor**: El sistema debe implementar paginación infinita con cursor por sección, manteniendo el orden ponderado por seguidos en cada página adicional.

**RF-30 — Filtros por distrito**: El sistema debe permitir filtrar el feed de cada sección por distrito (texto normalizado), además de los filtros por tipo ya aplicados por sección.

**RF-31 — Bloque "Posibles coincidencias"**: El sistema debe insertar al inicio de las secciones Perdidos y Encontrados un bloque con posts del tipo opuesto del mismo distrito cuyo origen es la tabla `matches`. Visible solo si hay matches pendientes de acción.

**RF-32 — Pull-to-refresh**: El sistema debe permitir recargar cada sección del feed mediante pull-to-refresh.

**RF-33 — Exclusión automática del feed**: El sistema debe excluir del feed principal todo post en estado `pausado`, `resuelto` u `oculto`. Solo los posts `activo` aparecen en el feed.

### 1.6 Chat interno (iniciado solo desde posts)

**RF-34 — Botones de acción contextualizados en el post**: El sistema debe mostrar en cada post un botón de acción cuyo texto depende del tipo de post: "Quiero adoptar" (tipo=adopcion), "¡Vi a tu perro!" (tipo=perdido), "¡Es mi perro!" (tipo=encontrado).

**RF-35 — Visibilidad del botón según estado**: El sistema debe mostrar el botón de acción del post en los estados `activo` y `pausado`, y ocultarlo en los estados `resuelto` y `oculto`.

**RF-36 — Inicio de conversación 1-a-1**: El sistema debe crear (si no existe) o abrir una conversación 1-a-1 entre el usuario que toca el botón y el dueño del post al tocar el botón de acción, sin posibilidad de iniciar chat de otra forma (no hay botón de contacto en el perfil).

**RF-37 — Un chat único por post por par de usuarios**: El sistema debe reutilizar la misma conversación entre dos usuarios para un mismo post, de modo que tocar el botón múltiples veces abre la misma conversación existente.

**RF-38 — Sin grupos en el chat**: El sistema debe crear conversaciones exclusivamente 1-a-1 (dos participantes: el dueño del post y el usuario que inició). No existen chats grupales en MVP v3.

**RF-39 — Mensaje automático inicial**: El sistema debe insertar un mensaje automático inicial en la conversación al crearla, conteniendo los datos del post (título, tipo, distrito) como contexto.

**RF-40 — Contenido del chat (texto + fotos)**: El sistema debe permitir enviar mensajes de texto y fotos en el chat. Las fotos se suben a Cloudinary bajo el perfil del usuario emisor.

**RF-41 — Sin audio ni video**: El sistema NO debe permitir enviar audio, video ni otros tipos de contenido multimedia en el chat del MVP v3. Solo texto y fotos.

**RF-42 — Polling de mensajes**: El sistema debe entregar los mensajes nuevos al cliente mediante polling: el cliente consulta el endpoint de mensajes cada 5 segundos cuando tiene una conversación abierta.

**RF-43 — Notificación push de nuevo mensaje**: El sistema debe enviar una notificación push (Expo Push) al destinatario cuando recibe un nuevo mensaje y no tiene la conversación abierta en foreground. El texto: "Nuevo mensaje de [nombre] sobre [título del post]".

**RF-44 — Pestaña "Mensajes"**: El sistema debe incluir una pestaña/sección "Mensajes" que lista las conversaciones activas del usuario actual ordenadas por última actividad descendente.

**RF-45 — Lista de conversaciones**: El sistema debe mostrar en cada item de la lista de conversaciones: nombre del otro participante, avatar, último mensaje (truncado), timestamp, e indicador de mensajes no leídos.

**RF-46 — Marcar como leída**: El sistema debe marcar una conversación como leída cuando el usuario la abre, eliminando el indicador de no leído.

**RF-47 — WhatsApp como respaldo dentro del chat**: El sistema debe mostrar dentro de cada conversación un botón "Contactar por WhatsApp" que abre wa.me con el teléfono del dueño del post como canal secundario de respaldo.

**RF-48 — Sin edición ni eliminación de mensajes por el usuario**: El sistema NO debe permitir al usuario editar ni eliminar sus propios mensajes en el chat del MVP v3.

**RF-49 — Eliminación de mensajes por admin**: El sistema debe permitir al admin eliminar mensajes individuales del chat en caso de reporte o abuso, sin afectar al resto de la conversación.

**RF-50 — Admin ve conversaciones en disputa**: El sistema debe permitir al admin abrir cualquier conversación en modo solo-lectura cuando exista un reporte relacionado con esa conversación.

### 1.7 Perfil de usuario

**RF-51 — Perfil público**: El sistema debe mostrar el perfil de cualquier usuario a cualquier usuario autenticado, sin例外.

**RF-52 — Datos visibles en el perfil**: El sistema debe mostrar en el perfil: nombre, avatar, número de seguidores, número de seguidos, lista de posts publicados (incluyendo posts pausados del propio usuario), y WhatsApp.

**RF-53 — Sin botón de contacto en el perfil**: El sistema NO debe mostrar un botón de "Contactar" ni de "Iniciar chat" en el perfil de usuario. El chat únicamente se inicia desde el botón contextualizado de un post.

**RF-54 — Edición del perfil propio**: El sistema debe permitir al usuario editar su propio nombre, avatar, y WhatsApp. No se puede editar el rol ni el auth_provider.

**RF-55 — Baneo oculta perfil**: El sistema debe ocultar el perfil y todos los posts de un usuario cuando un admin lo marca como baneado, impidiendo que otros usuarios lo vean en feed ni en perfil.

### 1.8 Moderación (Admin)

**RF-56 — Acceso al panel admin**: El sistema debe mostrar un botón oculto visible solo para role=admin que redirige al panel de administración dentro de la misma app.

**RF-57 — Ocultar posts**: El sistema debe permitir al admin marcar cualquier post como `oculto`, desapareciéndolo del feed de todos los usuarios.

**RF-58 — Banear usuarios**: El sistema debe permitir al admin banear a un usuario, lo que oculta automáticamente su perfil y todos sus posts del feed.

**RF-59 — Aprobar veterinarias**: El sistema debe permitir al admin aprobar o rechazar sugerencias de veterinarias enviadas por usuarios.

**RF-60 — Marcar post como resuelto**: El sistema debe permitir al admin marcar cualquier post como `resuelto`, independientemente de si es o no el dueño del post.

**RF-61 — Reactivar posts pausados**: El sistema debe permitir al admin (y al dueño) reactivar un post en estado `pausado`, volviéndolo a `activo` y reiniciando `last_validated_at` a la fecha actual.

**RF-62 — Editar posts ajenos**: El sistema NO debe permitir al admin editar el contenido de posts de otros usuarios, solo cambiar su estado.

### 1.9 Veterinarias

**RF-63 — Directorio de veterinarias**: El sistema debe mostrar un directorio de veterinarias verificadas con los datos: nombre, dirección, distrito, teléfono, horarios.

**RF-64 — Ingreso manual por admin**: El sistema debe permitir al admin agregar veterinarias al directorio de forma manual (seed inicial + carga progresiva).

**RF-65 — Sugerencia por usuarios**: El sistema debe permitir a cualquier usuario autenticado sugerir una veterinaria, la cual ingresa a una cola de revisión. El admin aprueba o rechaza cada sugerencia.

**RF-66 — Datos de sugerencia**: El sistema debe exigir para una sugerencia de veterinaria los campos: nombre, dirección, distrito, teléfono, horarios.

### 1.10 Matching automático

**RF-67 — Matching Perdido↔Encontrado**: El sistema debe ejecutar la búsqueda de coincidencias al publicar un post tipo `perdido` o `encontrado`, buscando posts activos del tipo opuesto en el mismo distrito normalizado.

**RF-68 — Adopción no participa en matching**: El sistema NO debe ejecutar matching sobre posts tipo `adopcion` en ningún caso.

**RF-69 — Idempotencia del match**: El sistema debe registrar cada match en la tabla `matches` con `notified_at` nullable. Si `notified_at` ya tiene valor, el sistema no debe enviar notificación duplicada al volver a cruzar el mismo par de posts.

**RF-70 — Push al detectar match**: El sistema debe enviar una notificación push a los dueños de ambos posts cuando se detecta un nuevo match cuyo `notified_at` sea NULL.

**RF-71 — Descarte de match**: El sistema debe permitir al usuario descartar un match sugerido en el bloque "Posibles coincidencias" sin que esto afecte el estado del post.

### 1.11 Notificaciones push

**RF-72 — Captura silenciosa del push token**: El sistema debe capturar el ExpoPushToken del dispositivo al primer login del usuario y registrarlo en la tabla `push_tokens` (uno-a-muchos, un usuario puede tener múltiples dispositivos).

**RF-73 — Tipos de notificación en MVP v3**: El sistema debe enviar notificaciones push en 3 escenarios: (a) match automático detectado, (b) validación 30 días, y (c) nuevo mensaje de chat.

**RF-74 — Limpieza de tokens inválidos**: El sistema debe eliminar de la tabla `push_tokens` los tokens que reciban receipt `DeviceNotRegistered` desde Expo Push, sin afectar a los demás tokens del mismo usuario.

**RF-75 — Toggle local de notificaciones**: El sistema debe permitir al usuario silenciar las notificaciones desde un toggle local en settings. El toggle afecta la visualización local pero no el envío del backend.

---

## 2. Requisitos No Funcionales

### 2.1 Rendimiento

**RNF-01 — Latencia de feed ponderado**: El sistema debe resolver la query del feed de cada sección en menos de 300 ms bajo carga normal, utilizando un LEFT JOIN con `follows` y `ORDER BY CASE WHEN follower_id IS NOT NULL THEN 0 ELSE 1 END, created_at DESC` apoyado en el índice compuesto `(tipo, distrito_norm, status)`.

**RNF-02 — Paginación de feed**: El sistema debe entregar el feed en páginas de 20 posts, usando un cursor que Preserve el orden ponderado (seguidos primero) entre páginas consecutivas.

**RNF-03 — Polling de chat**: El sistema debe entregar mensajes nuevos en una conversación con una latencia máxima de 5 segundos, usando un endpoint `GET /conversations/:id/messages?afterId=N` que retorna solo mensajes con `id > N`.

**RNF-04 — Rate limiting general**: El sistema debe limitar las peticiones a 100 por minuto por IP y a 5 posts por hora por usuario, usando express-rate-limit en memoria.

**RNF-05 — Rate limiting de chat**: El sistema debe limitar el envío de mensajes de chat a 30 mensajes por minuto por usuario, para prevenir spam.

**RNF-06 — Upload de fotos optimizado**: El sistema debe aplicar transformaciones Cloudinary `f_auto,q_auto,w_800` automáticamente a toda foto subida (posts y chat), reduciendo peso sin afectar la calidad visual.

### 2.2 Escalabilidad

**RNF-07 — Base de datos gratuita**: El sistema debe operar sobre Neon Postgres free (3GB storage, 190h compute/mes) sin requerir PostGIS ni índices espaciales en MVP v3.

**RNF-08 — Storage de fotos**: El sistema debe almacenar todas las fotos (posts + chat) en Cloudinary free (25GB), sin uso de almacenamiento local en el backend.

**RNF-09 — Rate limiting single-instance**: El sistema debe usar express-rate-limit en memoria dado el despliegue single-instance en Railway Free. En caso de escalar a multi-VM, se debe migrar a Upstash Redis.

**RNF-10 — Sin WebSockets en MVP**: El sistema debe implementar el chat mediante polling REST (sin Socket.io ni WebSockets) durante el MVP v3, dada la restricción de recursos en Railway Free.

**RNF-11 — Cron jobs Railway**: El sistema debe usar Railway Cron Jobs (mínimo 5 min entre ejecuciones) para la validación diaria de 30 días, sin consumir tiempo de compute del servicio web principal.

### 2.3 Usabilidad

**RNF-12 — Idioma español Perú**: El sistema debe estar localizado en español (Perú), sin soporte multi-idioma en MVP v3.

**RNF-13 — Onboarding mínimo**: El sistema debe llevar del login a la pantalla principal en máximo 2 taps, sin tutorial ni pantallas intermedias innecesarias.

**RNF-14 — Chat accionable en 3 taps**: El sistema debe permitir iniciar una conversación de chat en máximo 3 taps desde el feed: tap en post → tap en botón contextualizado → conversación abierta.

**RNF-15 — Botones contextualizados claros**: El sistema debe mostrar botones con texto inequívoco según tipo de post ("Quiero adoptar" / "¡Vi a tu perro!" / "¡Es mi perro!") para evitar confusión sobre el resultado esperado.

**RNF-16 — Indicadores de estado visibles**: El sistema debe mostrar de forma clara el estado del post (activo, pausado, resuelto, oculto para el dueño) en la UI, especialmente en el perfil del usuario.

### 2.4 Confiabilidad

**RNF-17 — Posts no expiran**: El sistema NO debe eliminar automáticamente posts pasados, aunque estén pausados. La eliminación o cierre de un post siempre lo decide el usuario o el admin.

**RNF-18 — Sin pérdida de mensajes de chat**: El sistema debe persistir todos los mensajes enviados en la tabla `messages`, de modo que una caída del backend no provoque pérdida de mensajes en tránsito.

**RNF-19 — Resiliencia del cron**: El sistema debe diseñar el cron de validación 30 días de modo que, si un día no corre (Railway no reintenta), al día siguiente procese los posts acumulados sin pérdida de datos, consultando `last_validated_at > 30 días` sin importar el último día de ejecución.

**RNF-20 — Trazabilidad de errores**: El sistema debe enviar todas las excepciones no controladas a Sentry (5K errors/mes free) para facilitar el diagnóstico en producción.

**RNF-21 — Sin expiración forzada de tokens**: El sistema debe mantener los push tokens en la tabla `push_tokens` hasta que Expo Push devuelva receipt `DeviceNotRegistered`, sin expiración automática por tiempo.

### 2.5 Seguridad

**RNF-22 — Auth obligatoria en todos los endpoints**: El sistema debe exigir autenticación en todos los endpoints excepto login/registro. No existe endpoint público del feed ni de perfil en MVP v3.

**RNF-23 — Rate limiting con IP y usuario**: El sistema debe aplicar rate limiting por IP (100 req/min) y por usuario autenticado (5 posts/hora, 30 msg/min) de forma independiente.

**RNF-24 — Acceso restringido a conversaciones**: El sistema debe validar que el usuario que lee o envía un mensaje en una conversación sea uno de los participantes registrados en `conversation_participants` de esa conversación. Cualquier otro acceso debe rechazarse con 403.

**RNF-25 — Admin con acceso de solo lectura a chats ajenos**: El sistema debe permitir al admin abrir conversaciones en modo solo-lectura únicamente cuando exista un reporte activo vinculado a la conversación, sin permitirle enviar mensajes.

**RNF-26 — Cloudinary server-side**: El sistema debe realizar todas las subidas a Cloudinary desde el backend con API key, sin exponer credenciales al cliente móvil.

**RNF-27 — Validación con Zod**: El sistema debe validar con Zod todos los payloads entrantes (creación de post, like, share, follow, mensaje de chat, sugerencia de veterinaria) antes de persistir o procesar.

**RNF-28 — Unique constraints en base de datos**: El sistema debe aplicar unique constraints en base de datos para: `(follower_id, following_id)` en `follows`, `(user_id, post_id)` en `post_likes`, y `(conversation_id, user_id)` en `conversation_participants`, como defensa en profundidad contra duplicados.

**RNF-29 — No exponer datos sensibles en el perfil**: El sistema debe exponer únicamente nombre, avatar, WhatsApp y contadores de seguidos/seguidores en el perfil público. No debe exponer email, OTP, rol ni tokens de push al público.

---

## 3. Impactos en Alcance, Presupuesto y Cronograma

### 3.1 Alcance

| ID | Feature nueva | Origen |
|----|---------------|--------|
| A-01 | Seguidos y seguidores con feed ponderado | Incorporación v3 |
| A-02 | Likes públicos únicos por usuario | Incorporación v3 |
| A-03 | Contador de compartidos | Incorporación v3 |
| A-04 | Chat interno iniciado solo desde post | Incorporación v3 (antes excluido) |
| A-05 | Botones contextualizados por tipo de post | Incorporación v3 |
| A-06 | WhatsApp degradado a fallback en chat | Cambio v3 (antes canal primario) |

### 3.2 Presupuesto

| Recurso | v2 | v3 | Impacto |
|---------|----|----|---------|
| Backend Railway Free | $0 | $0 | Sin cambio (chat usa REST, no WebSockets) |
| Neon Postgres | $0 (3GB) | $0 (3GB) | Nuevo: 5 tablas + 1 columna. Margen suficiente. |
| Cloudinary | $0 (25GB) | $0 (25GB) | Nuevo: fotos en chat. Vigilar storage. |
| Expo Push | $0 | $0 | Nuevo: push de mensajes de chat. dentro de 600/seg. |
| **TOTAL** | **$0/mes** | **$0/mes** | Sin variación |

### 3.3 Cronograma

| Fase | v2 | v3 (impacto) | Total adicional |
|------|----|---------------|-----------------|
| Seguidores (schema + API + UI + feed ponderado) | — | +2.5 días | +2.5 días |
| Likes / Shares (schema + API + UI) | — | +1.5 días | +1.5 días |
| Chat interno (3 tablas + API + UI lista y conversación + push) | — | +5 a +7 días | +5 a +7 días |
| Botones contextualizados en post UI | — | +0.5 días | +0.5 días |
| Pruebas end-to-end chat + seguidores + likes | — | +1 a +2 días | +1 a +2 días |
| **TOTAL adicional** | | | **+10.5 a +13.5 días sobre v2** |

### 3.4 Riesgos asociados a v3

| ID | Riesgo | Mitigación |
|----|--------|------------|
| R-01 | Latencia del feed ponderado cuando crece follows por usuario | LEFT JOIN con índices en `follows(follower_id)` y `posts(user_id, created_at)`. Medir con >1000 follows. |
| R-02 | Polling 5s carga backend con muchos chats activos | Endpoint `?afterId=N` retorna solo nuevos. Rate-limit 30 msg/min. Monitorear con Sentry. |
| R-03 | Abuso de chat (spam, acoso) entre usuarios | Rate-limit 30 msg/min. Reporte a admin. Admin puede eliminar mensajes. Posible ban si reporte recurrente (vía baneo de usuario existente). |
| R-04 | Storage Cloudinary por fotos en chat | Aplicar `f_auto,q_auto,w_800` a fotos de chat. Vigilar cuota 25GB. Plan pago si se rebasa. |
| R-05 | Confusión por botón "¡Es mi perro!" en posts de tipo encontrado si el usuario no es dueño real | El botón abre conversación 1-a-1; el dueño del post valida identidad en el chat. Sin garantía de propiedad en MVP. |

---

Fin del documento.
