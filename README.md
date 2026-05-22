# Vibe Events

Marketplace ficticio de proveedores para eventos en Guatemala, hecho con React, Vite, Three.js y una API Express preparada para SQL Server.

Demo pública: https://gaston1x.github.io/Web-Developer-/

## Funciones

- Home con buscador, categorías y escena 3D.
- Catálogo con 120 proveedores ficticios: 20 por categoría.
- Resultados, filtros, detalles, favoritos, reservas y cotizaciones.
- Registro e inicio de sesión usando API propia.
- SQL Server para usuarios.
- Seguridad básica: Helmet, CORS, rate limit, validación con Zod, JWT y contraseñas con bcrypt.

## Requisitos

- Node.js 24 o compatible.
- SQL Server activo.
- `sqlcmd` o SQL Server Management Studio para ejecutar el esquema.

## Instalación

```bash
npm install
```

Copia `.env.example` como `.env` y cambia los valores:

```bash
PORT=4000
CLIENT_ORIGIN=http://127.0.0.1:5173
JWT_SECRET=usa-una-clave-larga-y-random
SQL_SERVER=localhost
SQL_PORT=1433
SQL_DATABASE=VibeEvents
SQL_USER=vibe_app
SQL_PASSWORD=tu-password
```

## Base de datos

Ejecuta el archivo [database/schema.sql](database/schema.sql) desde SQL Server Management Studio o con `sqlcmd`.

Ejemplo:

```bash
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -i database/schema.sql
```

## Desarrollo

Frontend:

```bash
npm run dev
```

API:

```bash
npm run dev:api
```

Todo junto:

```bash
npm run dev:full
```

Frontend: http://127.0.0.1:5173  
API: http://127.0.0.1:4000/api/health

## Build

```bash
npm run build
```
