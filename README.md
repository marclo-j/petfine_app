# PetFine 🐾

App para reportar perros perdidos, encontrarlos y darles en adopción.
Prototipo funcional construido a partir del diseño en Figma.

## Stack

- Expo SDK 57 · React Native · TypeScript
- NativeWind (Tailwind CSS) · React Navigation
- React Query · React Hook Form + Zod · Zustand
- Capa de datos mock intercambiable (`src/api`)

## Estructura

- `app/` — aplicación móvil (todo el código)
- `Documentation/` — docs del producto y decisiones de arquitectura
- `graphify-out/` — knowledge graph del codebase (consulta con `graphify query`)

## Ejecutar

```sh
cd app
npm install
npm run web      # navegador
npm start        # Metro + Expo Go en el teléfono
```

## Verificar

```sh
npm run lint && npx tsc --noEmit
```

## Workflow de git (GitHub Flow)

- `main` es siempre la rama estable.
- Trabajo nuevo en ramas `feature/*` cortas, integradas vía PR.
- Sin ramas `develop`/`release` por ahora: equipo pequeño en fase MVP.
