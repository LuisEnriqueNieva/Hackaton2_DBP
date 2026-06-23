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
- Backend del curso (se entrega vía Docker). Expón su URL en `VITE_API_BASE_URL`.

## Variables de entorno

Crea un archivo `.env` en la raíz (hay una plantilla en `.env.example`):

```env
VITE_API_BASE_URL=https://<backend-url>/api/v1
```

> El backend corre en Docker; usa la URL/puerto que exponga el contenedor
> (por defecto `http://localhost:8080/api/v1`).

## Instalación y comandos

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo (http://localhost:5173)
npm run typecheck    # verificar tipos (debe pasar sin errores)
npm run build        # build de producción
npm run preview      # previsualizar el build
npm run deploy       # build + publicar a GitHub Pages
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

Publica `dist/` en la rama `gh-pages`. Luego en GitHub: **Settings → Pages →
Branch: `gh-pages`**. El sitio queda en `https://<usuario>.github.io/<repo>/`.

**Link del deploy:** _(completar tras el primer deploy)_

## Decisiones técnicas

- **HashRouter** en lugar de BrowserRouter: en GitHub Pages garantiza que
  cualquier ruta abra directo (al recargar o pegar la URL) sin necesidad de
  `404.html` ni configuración de servidor.
- **`base: './'`** en `vite.config.ts`: assets relativos al subpath del repo,
  sin hardcodear su nombre.
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
