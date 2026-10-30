# Vibe Events

**Marketplace para cotizar, comparar y reservar proveedores de eventos en Guatemala:** salones, catering, decoración, fotografía, sonido e iluminación y mobiliario.

[![CI](https://github.com/Gaston1x/vibe-events/actions/workflows/ci.yml/badge.svg)](https://github.com/Gaston1x/vibe-events/actions/workflows/ci.yml)
![React 19](https://img.shields.io/badge/React-19-61dafb)
![Vite 8](https://img.shields.io/badge/Vite-8-646cff)
![Express 5](https://img.shields.io/badge/Express-5-000000)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-cc2927)
![Licencia MIT](https://img.shields.io/badge/licencia-MIT-green)

**Demo:** https://gaston1x.github.io/vibe-events/

> La demo pública muestra proveedores y precios **ficticios** y no procesa pagos. El registro y el inicio de sesión necesitan la API y la base de datos, que todavía no están publicadas (ver [Estado del proyecto](#estado-del-proyecto)).

---

## Funcionalidades

- **Búsqueda por categoría, departamento, tipo de evento y precio**, con 120 proveedores de ejemplo.
- **Ficha del proveedor** con servicios, paquetes, zona de cobertura y botón para compartir el enlace.
- **Solicitud de reserva en 4 pasos** con validación, autorización explícita para compartir datos con el proveedor y desglose de precio (anticipo del 30 %, comisión Q0, transporte aparte).
- **Cuentas de usuario**: registro, inicio de sesión, panel, baja de correos promocionales y eliminación de cuenta.
- **Cumplimiento**: políticas de privacidad, términos, reembolsos y cookies; banner de consentimiento; créditos de imágenes. Ver [docs/CUMPLIMIENTO.md](docs/CUMPLIMIENTO.md).
- **Accesibilidad (WCAG 2.1 AA)**: navegación con teclado, contraste AA, textos alternativos, respeto a «reducir movimiento».
- **URLs por pantalla** (`#/proveedor?providerId=...`), así que funcionan el botón Atrás y los enlaces compartidos.

## Tecnologías

| Capa | Herramientas |
| --- | --- |
| Frontend | React 19, Vite 8, Framer Motion, Three.js, Lucide |
| API | Node.js, Express 5, Zod, JWT, bcrypt, Helmet, CORS, express-rate-limit |
| Base de datos | SQL Server 2022 (`mssql`) |
| Despliegue | GitHub Pages (frontend) |

## Estructura

```
├── database/schema.sql      Esquema de SQL Server (idempotente, se puede ejecutar varias veces)
├── docs/                    Cumplimiento, informe QA y guía de base de datos
├── public/                  Favicon y archivos estáticos
├── server/                  API Express
│   ├── routes/auth.js       Registro, login, /me, preferencias y eliminación de cuenta
│   └── middleware/auth.js   Verificación del token JWT
└── src/
    ├── App.jsx              Pantallas y navegación
    ├── Legal.jsx            Páginas legales
    ├── business.js          Datos del negocio (pendientes de completar)
    ├── consent.js           Consentimiento de cookies
    ├── data.js              Catálogo de ejemplo
    └── api.js               Cliente de la API
```

## Instalación

**Requisitos:** Node.js 20 o superior y SQL Server 2022 (Express o Developer). La guía paso a paso está en [docs/BASE-DE-DATOS.md](docs/BASE-DE-DATOS.md).

```bash
npm install
cp .env.example .env   # en Windows: copy .env.example .env
```

Edita `.env` con tus credenciales y crea la base de datos:

```bash
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -C -i database/schema.sql
```

## Desarrollo

```bash
npm run dev:full
```

- Frontend: http://127.0.0.1:5173/vibe-events/
- API: http://127.0.0.1:4000/api/health

Con `npm run dev` levantas solo el frontend y con `npm run dev:api` solo la API.

## Despliegue

```bash
npm run deploy
```

Compila y publica `dist/` en la rama `gh-pages`. Para producción, la API se despliega aparte (por ejemplo Azure App Service o Render) con Azure SQL. Después hay que poner su URL en `VITE_API_BASE_URL` y en el `connect-src` de la política CSP de `index.html`.

## Estado del proyecto

| Área | Estado |
| --- | --- |
| Interfaz, búsqueda, ficha y flujo de reserva | ✅ Completo (datos de ejemplo) |
| Páginas legales, cookies y consentimientos | ✅ Completo (revisión legal pendiente) |
| Usuarios: registro, login, baja y eliminación | ✅ API + SQL Server |
| Proveedores, cotizaciones, reservas y favoritos en BD | ⏳ Por hacer: hoy viven en `src/data.js` |
| API publicada en internet | ⏳ Por hacer |
| Pasarela de pagos | ⏳ Por hacer |

El plan detallado está en [docs/BASE-DE-DATOS.md](docs/BASE-DE-DATOS.md#próximos-pasos).

## Antes de producción

1. Completa los datos reales del negocio en [`src/business.js`](src/business.js): razón social, NIT, dirección, correos y teléfono. Luego cambia `demoMode` a `false`.
2. Pide a un abogado guatemalteco que revise las políticas legales. Son una plantilla sólida, no asesoría legal.
3. Usa un `JWT_SECRET` largo y aleatorio, y pon `SQL_ENCRYPT=true` en la base de datos de producción.

## Licencia

[MIT](LICENSE) © 2026 Gaston1x. Fotografías de referencia: [Licencia Unsplash](https://unsplash.com/license).
