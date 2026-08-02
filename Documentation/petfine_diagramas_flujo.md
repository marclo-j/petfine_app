# PetFine - Diagramas de Flujo de Proceso (MVP v3)

> **Documento actualizado — MVP v3 (julio 2026)**
>
> Los diagramas reflejan el alcance de MVP v3: matching automático por **mismo distrito** (no radio geográfico), notificaciones push (Expo Push), validación de 30 días con estado `pausado`, feed en 3 secciones ordenado por seguidos primero, interacciones sociales (likes, shares, follows) y **chat interno iniciado solo desde botones contextualizados del post** con WhatsApp como respaldo dentro del chat.
>
> El tipo **Adopción** no participa en matching. El chat no incluye WebSockets (polling 5s).

---

## Diagrama 1: Reporte de Perro Perdido

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Usuario reporta pérdida]
    A --> B[Ingresa foto, ubicación calle + distrito]
    B --> C[Sistema busca hallazgos activos en el mismo distrito]
    C --> D{¿Hay hallazgos<br/>coincidentes?}

    D -- SÍ --> E[Notifica al dueño vía Expo Push]
    E --> F[Dueño revisa hallazgo en bloque Posibles coincidencias]
    F --> G{¿Es su perro?}
    G -- SÍ --> H[Toca ¡Es mi perro! en el post encontrado]
    H --> I[Abre chat interno 1-a-1 con el encontrador]
    I --> J[Coordinan encuentro por texto o fotos]
    J --> K{¿Logran reencuentro?}
    K -- SÍ --> L[Ambos marcan sus posts como resuelto]
    L --> FIN1([FIN - Reencuentro])
    K -- NO, sin respuesta --> M[Toca Contactar por WhatsApp dentro del chat]
    M --> N[Coordinan por WhatsApp]
    N --> L

    G -- NO --> O[Descarta match]
    O --> P[Reporte sigue activo]
    P --> FIN2([FIN - Sigue buscando])

    D -- NO --> Q[Reporte queda activo]
    Q --> R[Espera hasta nuevo reporte compatible]
    R --> FIN3([FIN - En espera de match])
```

---

## Diagrama 2: Reporte de Perro Encontrado

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Usuario reporta hallazgo]
    A --> B[Ingresa foto, ubicación calle + distrito]
    B --> C[Sistema busca pérdidas activas en el mismo distrito]
    C --> D{¿Hay pérdidas<br/>coincidentes?}

    D -- SÍ --> E[Notifica a dueños vía Expo Push]
    E --> F[Dueño revisa foto en bloque Posibles coincidencias]
    F --> G{¿Es su perro?}
    G -- SÍ --> H[Toca ¡Es mi perro! en el post encontrado → Abre chat interno]
    H --> I[Chat 1-a-1 con el encontrador]
    I --> J[Coordinan entrega por texto o fotos]
    J --> K{¿Logran entrega?}
    K -- SÍ --> L[Ambos marcan sus posts como resuelto]
    L --> FIN1([FIN - Reencuentro])
    K -- NO, sin respuesta --> M[Toca Contactar por WhatsApp dentro del chat]
    M --> N[Coordinan por WhatsApp]
    N --> L

    G -- NO --> O[Descarta match]
    O --> P[Reporte sigue activo]
    P --> FIN2([FIN - Sigue esperando])

    D -- NO --> Q[Reporte queda activo]
    Q --> R[Espera hasta nuevo reporte compatible]
    R --> FIN3([FIN - En espera de match])
```

---

## Diagrama 3: Notificación al Publicar Nuevo Reporte (Búsqueda Cruzada)

Este diagrama muestra qué pasa cuando alguien más publica un reporte mientras el tuyo sigue activo.

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Nuevo reporte se publica]
    A --> B{¿Tipo de<br/>reporte?}

    B -- Hallazgo --> C[Busca pérdidas activas en el mismo distrito]
    B -- Pérdida --> D[Busca hallazgos activos en el mismo distrito]
    B -- Adopción --> Z[No participa en matching, solo feed]

    C --> E{¿Coincide con<br/>alguna pérdida?}
    E -- SÍ --> F[Registra match en tabla matches]
    F --> G[Notifica al dueño vía Expo Push]
    G --> FIN1([FIN - Dueño notificado])
    E -- NO --> H[Reporte queda en espera]
    H --> FIN2([FIN - Sin match, sigue activo])

    D --> I{¿Coincide con<br/>algún hallazgo?}
    I -- SÍ --> J[Registra match en tabla matches]
    J --> K[Notifica a quien encontró vía Expo Push]
    K --> FIN3([FIN - Encontrador notificado])
    I -- NO --> L[Reporte queda en espera]
    L --> FIN4([FIN - Sin match, sigue activo])
```

---

## Diagrama 4: Validación cada 30 Días

Aplica tanto a reportes de pérdida como de hallazgo que siguen activos sin cierre.

```mermaid
flowchart TD
    INICIO([INICIO - Pasan 30 días]) --> A[Railway Cron Job corre diariamente]
    A --> B{Marca post como PAUSADO}
    B --> C[Notifica al usuario vía Expo Push]

    C --> D{¿Deseas continuar<br/>buscando?}

    D -- Sí, continuar --> E[Reporte vuelve a ACTIVO]
    E --> F[Próxima validación en 30 días]
    F --> FIN1([FIN - Sigue activo])

    D -- Pausar por ahora --> G[Reporte permanece PAUSADO]
    G --> H[No recibe notificaciones de match]
    H --> I{¿Usuario<br/>reactiva?}
    I -- SÍ --> E
    I -- NO --> FIN2([FIN - Permanece pausado])

    D -- Ya se resolvió --> J[Reporte pasa a RESUELTO]
    J --> FIN3([FIN - Caso cerrado])
```

---

## Diagrama 5: Publicación de Adopción

El tipo **Adopción** no participa en matching. Es un flujo directo: publicación → feed (sección Quiero Adoptar) → contacto vía chat interno.

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Usuario crea publicación]
    A --> B[Selecciona tipo: Adopción]
    B --> C[Completa título, descripción, 1-3 fotos, calle, distrito, WhatsApp]
    C --> D[Publica]
    D --> E[Post aparece en feed sección Quiero Adoptar]
    E --> F[Otro usuario filtra feed por seccion Quiero Adoptar]
    F --> G[Ve post en detalle]
    G --> H[Toca Quiero adoptar → Abre chat interno 1-a-1 con el dueño]
    H --> I[Coordinan por texto o fotos]
    I --> J{¿Adopción completada?}
    J -- SÍ --> K[Dueño del post marca como resuelto]
    K --> FIN1([FIN - Adopción completada])
    J -- NO, sin respuesta --> L[Toca Contactar por WhatsApp dentro del chat]
    L --> M[Coordinan por WhatsApp]
    M --> J
```

---

## Diagrama 6: Chat Interno Iniciado Desde Post (NUEVO v3)

El chat empezará únicamente desde un botón contextualizado de un post. No existe botón de contacto directo en el perfil.

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Usuario ve un post en el feed]
    A --> B{¿Tipo de post?}
    B -- Adopción --> C[Boton: Quiero adoptar]
    B -- Perdido --> D[Boton: ¡Vi a tu perro!]
    B -- Encontrado --> E[Boton: ¡Es mi perro!]

    C --> F{Estado del post?}
    D --> F
    E --> F

    F -- Activo o Pausado --> G[Botón visible]
    F -- Resuelto u Oculto --> H[Botón oculto, no se puede iniciar chat]
    H --> FIN1([FIN - Sin chat disponible])

    G --> I[Usuario toca el botón]
    I --> J{¿Existe conversación<br/>entre emisor y dueño<br/>para este post?}
    J -- SÍ --> K[Abre conversación existente]
    J -- NO --> L[Backend crea conversación en tabla conversations]
    L --> M[Backend inserta mensaje automático inicial con datos del post]
    M --> N[Abre conversación nueva]

    K --> O[Chat 1-a-1: texto y fotos. Polling 5s]
    N --> O

    O --> P{Llega mensaje<br/>nuevo del destinatario?}
    P -- SÍ --> Q{¿Conversación abierta<br/>en el destinatario?}
    Q -- NO --> R[Expo Push: Nuevo mensaje de nombre sobre titulo]
    R --> S[Destinatario abre conversación]
    S --> O
    Q -- SÍ --> T[No se envía push, solo visualización en vivo]
    T --> O

    P -- NO --> U{¿Usuario quiere<br/>contactar por WhatsApp?}
    U -- SÍ --> V[Toca Contactar por WhatsApp dentro del chat]
    V --> W[Abre wa.me con teléfono del dueño]
    W --> FIN2([FIN - WhatsApp fallback])
    U -- NO --> O
```

---

## Diagrama 7: Seguir a un Usuario y Feed Ponderado (NUEVO v3)

Los seguidores no cambian el feed en secciones, solo el **orden dentro de cada sección**: posts de seguidos aparecen primero.

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Usuario entra al perfil de otro usuario]
    A --> B[Perfil muestra: nombre, avatar, #seguidores, #seguidos, posts]
    B --> C{¿Usuario actual sigue<br/>a este perfil?}
    C -- NO --> D[Boton: Seguir]
    C -- SÍ --> E[Boton: Dejar de seguir]

    D --> F[Usuario toca Seguir]
    F --> G[Backend crea registro en tabla follows]
    G --> H[NO se envía notificación push al seguido]
    H --> I[El usuario seguido aparece primero en feed del seguidor]
    I --> FIN1([FIN - Relación creada])

    E --> J[Usuario toca Dejar de seguir]
    J --> K[Backend elimina registro de follows]
    K --> L[NO se envía notificación push]
    L --> M[Los posts del usuario dejan de priorizarse en el feed]
    M --> FIN2([FIN - Relación eliminada])

    FIN1 --> N[Próximo refresh del feed]
    FIN2 --> N
    N --> O[Feed en 3 secciones: Perdidos, Encontrados, Quiero Adoptar]
    O --> P[En cada sección: posts de seguidos primero, luego no seguidos]
    P --> Q[Dentro de cada grupo, ordenados por created_at DESC]
    Q --> FIN3([FIN - Feed ponderado actualizado])
```

---

## Diagrama 8: Like y Compartir en un Post (NUEVO v3)

```mermaid
flowchart TD
    INICIO([INICIO]) --> A[Usuario ve un post en feed o detalle]
    A --> B[Botón corazón y botón compartir visibles]

    B --> C{Usuario toca el<br/>corazón?}
    C -- SÍ --> D{¿Ya dio like<br/>a este post?}
    D -- NO --> E[Crea registro en post_likes user_id + post_id]
    E --> F[Contador de likes incrementa]
    F --> G[Botón corazón se marca activo]
    G --> FIN1([FIN - Like dado])
    D -- SÍ --> H[Toggle: elimina registro de post_likes]
    H --> I[Contador de likes decrementa]
    I --> J[Botón corazón se marca inactivo]
    J --> FIN2([FIN - Like quitado])

    C -- NO --> K{Usuario toca<br/>compartir?}
    K -- SÍ --> L[Incrementa shares_count del post]
    L --> M[Contador de compartidos incrementa]
    M --> N[Usuario puede repetir múltiples veces]
    N --> FIN3([FIN - Compartido contado])

    K -- NO --> FIN4([FIN - Sin interacción])

    FIN1 --> O[Contadores visibles para todos los usuarios autenticados]
    FIN2 --> O
    FIN3 --> O
```

---

## Diagrama 9: Moderación de Chat por Admin (NUEVO v3)

```mermaid
flowchart TD
    INICIO([INICIO - reporte de chat recibido]) --> A[Admin abre panel de moderación]
    A --> B[Admin ve reporte vinculado a conversación]
    B --> C[Admin abre la conversación en modo SOLO LECTURA]
    C --> D[Admin no puede enviar mensajes]
    D --> E[Admin lee el contexto del chat]

    E --> F{¿Hay mensaje(s)<br/>problemáticos?}
    F -- NO --> G[Admin cierra el reporte sin acción]
    G --> FIN1([FIN - Sin acción])

    F -- SÍ, mensaje individual --> H[Admin elimina mensaje específico]
    H --> I[Mensaje se elimina de la tabla messages]
    I --> J[Resto de la conversación se preserva]
    J --> FIN2([FIN - Mensaje eliminado])

    F -- SÍ, comportamiento sistemático --> K[Admin decide banear al usuario]
    K --> L[Admin marca usuario como baneado]
    L --> M[Perfil del usuario baneado oculto]
    M --> N[Posts del usuario baneado ocultos del feed]
    N --> FIN3([FIN - Usuario baneado])
```

---

## Resumen Visual: Comparación de Escenarios

```mermaid
flowchart LR
    A[Se publica reporte] --> B{¿Tipo?}

    B -- Perdido/Encontrado --> C{¿Match en<br/>mismo distrito?}
    C -- SÍ --> D[Registra match]
    D --> E[Notificación push instantánea de match]
    E --> F[Dueño toca ¡Es mi perro!]
    F --> G[Abre chat interno 1-a-1]
    G --> H[Coordinan por texto o fotos]
    H --> I{¿Logran<br/>reencuentro?}
    I -- SÍ --> J[Ambos marcan resuelto]
    J --> K[FIN - Reencuentro]
    I -- NO --> N[Toca Contactar por WhatsApp dentro del chat]
    N --> O[Coordinan por WhatsApp]
    O --> I

    C -- NO --> P[Reporte activo, sin expirar]
    P --> Q[Espera hasta nuevo reporte compatible]
    Q --> R{¿Alguien publica<br/>algo compatible?}
    R -- SÍ, en cualquier momento --> D
    R -- NO --> S[Validación cada 30 días]
    S --> P

    B -- Adopción --> T[Publicación directa al feed sección Quiero Adoptar]
    T --> U[Sin matching, solo se muestra filtrable]
    U --> V[Usuario toca Quiero adoptar]
    V --> W[Abre chat interno 1-a-1 con el dueño]
    W --> X[Coordinan por texto o fotos, o WhatsApp fallback]
    X --> Y[Dueño del post marca resuelto cuando adopta]
    Y --> Z[FIN - Adopción completada]
```

---

## Notas

- Todos los reportes son **no expirables**: el sistema nunca elimina un reporte por sí solo.
- El cierre de un reporte (match exitoso, adopción completada o abandono) **siempre lo decide el usuario**, nunca el sistema automáticamente.
- La validación de 30 días es solo una **pregunta de seguimiento**, no un cierre forzado. El estado `pausado` bloquea notificaciones de match pero el post sigue accesible desde el perfil.
- **Matching por distrito (MVP v3):** la coincidencia se basa en el string del distrito normalizado (`LOWER(TRIM(distrito))`). No hay lat/lng ni radio geográfico.
- **Push habilitado (MVP v3):** Expo Push se usa para notificaciones de match, validación 30 días, y **nuevos mensajes de chat (NUEVO v3)**. Límite: 600 notificaciones/segundo.
- **Cron job:** Railway Cron Jobs corre diariamente para detectar posts activos con `last_validated_at` > 30 días y marcarlos como `pausado`.
- **Adopción fuera de matching:** el tipo Adopción solo aparece en el feed filtrable y se contacta directamente vía chat interno (botón "Quiero adoptar"), sin participar en el motor de matching.
- **Chat en MVP v3:** implementado con polling REST 5s, sin WebSockets ni Socket.io. Solo texto y fotos. Botones contextualizados visibles en estados `activo` y `pausado`, ocultos en `resuelto` y `oculto`.
- **WhatsApp en v3:** degradado a botón de respaldo **dentro del chat**, no canal primario. No existe botón de contacto directo en el perfil.
- **Seguidores en v3:** relación unidireccional sin notificación push. El feed ordena primero los posts de seguidos dentro de cada sección, sin cambiar las secciones.
- **Likes en v3:** únicos por usuario por post (toggle). Compartidos: sin límite por usuario. Contadores públicos.
