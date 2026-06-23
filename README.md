# TropelCare Control Room

Consola operativa en React + TypeScript para monitorear Tropeles (hackathon DBP).

## Integrantes

- Kate Alva
- Joseph Geraldo Soto
- Luis Enrique Nieva

## Stack

React 19 · TypeScript estricto · Vite · React Router v7 · Tailwind CSS v4 · Fetch API.

## Requisitos previos

- Node.js 18+ y npm.
- Backend del curso (ya desplegado en Cloud Run). Su URL va en `VITE_API_BASE_URL`.

## Variables de entorno

Crea un archivo `.env` en la raíz (hay una plantilla en `.env.example`):

```env
VITE_API_BASE_URL=https://<backend-url>/api/v1
```

> En desarrollo, usa **el puerto 5173** (`http://localhost:5173`): es el único
> origen local permitido por el CORS del backend.

## Instalación y comandos

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo (http://localhost:5173)
npm run typecheck    # verificar tipos (debe pasar sin errores)
npm run build        # build de producción
npm run preview      # previsualizar el build
```

## Deploy (Vercel, auto-deploy desde GitHub)

El proyecto despliega en **Vercel** porque el backend solo acepta por CORS los
orígenes `*.vercel.app`, `*.netlify.app` y `localhost:5173` (GitHub Pages queda
descartado).

Pasos (una sola vez):

1. Entra a **vercel.com** e inicia sesión con GitHub.
2. **Add New → Project** e importa el repositorio.
3. Vercel detecta Vite automáticamente (build `npm run build`, output `dist`).
4. En **Environment Variables** agrega:
   `VITE_API_BASE_URL = https://<backend-url>/api/v1`
5. **Deploy**. Cada `push` a `main` redepliega solo.

`vercel.json` reescribe cualquier ruta a `index.html`, así el deploy abre directo
en cualquier ruta (`/dashboard`, `/signals/:id`, etc.).

**Link del deploy:** _(completar tras el primer deploy en Vercel)_

## Decisiones técnicas

- **BrowserRouter + `vercel.json` rewrites**: URLs limpias y deep-linking que abre
  directo en cualquier ruta sin `404.html`.
- **Capa compartida** (`src/types/api.ts`, `src/lib/apiClient.ts`): tipos de la
  API y un `apiFetch` que inyecta `Authorization: Bearer`, soporta
  `AbortController` y normaliza errores. Reutilizable por todo el equipo.
- **Sesión**: el JWT se guarda en `localStorage`; al recargar se restaura con
  `GET /auth/me`. Rutas privadas (`ProtectedRoute`) esperan esa restauración
  antes de decidir redirigir a `/login`.
- **Estados explícitos**: cada vista de datos maneja loading, error (con
  reintento) y vacío. Las animaciones usan el variante `motion-safe:` de
  Tailwind, respetando `prefers-reduced-motion`.

## Estructura

```
src/
  auth/        AuthProvider, useAuth, ProtectedRoute, contexto
  components/  Layout, KpiCard, Spinner, ErrorState
  lib/         apiClient (fetch + token + abort)
  pages/       LoginPage, DashboardPage
  types/       contratos y enums de la API
```

## Reparto del equipo

- **Integrante A:** autenticación, layout, dashboard y deploy.
- **Integrante B:** Tropeles, filtros en URL y feed infinito.
- **Integrante C:** Sector Story Engine (scrollytelling).
