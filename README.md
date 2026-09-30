# app-inca — contenedor iframe (solo para desarrollo)

Monta `itcm-dp-sdr-do` en un `<iframe>` y le pasa un **JWT estático de ejemplo** (`src/token.ts`) de dos formas:

1. **Query param**: `http://localhost:5173/?token=<JWT>`.
2. **postMessage** `{ type: 'AUTH_SESSION', token }` al cargar el iframe. Es el mecanismo que itcm-dp-sdr-do lee hoy (UC-AC-01).

## Correr

```bash
npm install
npm run dev          # http://localhost:5180
```

En `itcm-dp-sdr-do/front-end/.env` (o `.env.local`) hay que allowlistear este origen:

```
VITE_IFRAME_PARENT_ORIGIN=http://localhost:5180
```

Además, el backend tiene que estar corriendo con `JWT_SECRET=change-me-in-env`, y `admin@empresa.com` tiene que existir en `usuarios`. Si ese correo no existe, generá otro token:

```bash
npm run gen-token -- tu.correo@empresa.com
```
