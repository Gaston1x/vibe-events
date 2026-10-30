# Base de datos: instalación y próximos pasos

## Situación actual

- **Conectado a SQL Server (probado):** solo los usuarios (tablas `Users` y `UserAuditLog`), mediante la API de `server/`.
- **Sin base de datos:** proveedores, cotizaciones, reservas, favoritos y mensajes. Se generan en [src/data.js](../src/data.js) o se guardan en el navegador.
- **En la demo de GitHub Pages no hay API ni base de datos.** GitHub Pages solo sirve archivos estáticos, así que el login no puede funcionar ahí.

## Qué instalar (Windows)

| Herramienta | Para qué | Cómo |
| --- | --- | --- |
| Node.js 20+ (LTS) | Compilar el frontend y correr la API | `winget install OpenJS.NodeJS.LTS` |
| SQL Server 2022 Developer o Express | Motor de base de datos local (gratis) | `winget install Microsoft.SQLServer.2022.Developer` o el instalador de microsoft.com/sql-server |
| sqlcmd | Ejecutar `schema.sql` desde la terminal | `winget install Microsoft.Sqlcmd` |
| SQL Server Management Studio (opcional) | Ver tablas y datos con interfaz gráfica | `winget install Microsoft.SQLServerManagementStudio` |
| Docker Desktop (alternativa) | SQL Server en contenedor, sin instalarlo en Windows | `docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=TuClave#2026 -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest` |

## Configuración

1. Habilita el **modo de autenticación mixto** (SQL Server y Windows) y el protocolo **TCP/IP en el puerto 1433**. Se hace en *SQL Server Configuration Manager*; después reinicia el servicio.
2. Crea la base de datos y las tablas:
   ```bash
   sqlcmd -S localhost -U sa -P "TU_PASSWORD" -C -i database/schema.sql
   ```
3. Crea un usuario con permisos mínimos para la app (no uses `sa` en la app):
   ```sql
   USE VibeEvents;
   CREATE LOGIN vibe_app WITH PASSWORD = 'UnaClaveLarga#2026';
   CREATE USER vibe_app FOR LOGIN vibe_app;
   ALTER ROLE db_datareader ADD MEMBER vibe_app;
   ALTER ROLE db_datawriter ADD MEMBER vibe_app;
   ```
4. Copia `.env.example` a `.env` y completa `SQL_USER`, `SQL_PASSWORD` y un `JWT_SECRET` aleatorio. Para generarlo:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
5. `npm run dev:full` y abre http://127.0.0.1:4000/api/health.

## Próximos pasos

En orden de prioridad, para que el sitio deje de depender de datos de ejemplo:

1. **Tablas del catálogo:** `Providers`, `ProviderServices`, `ProviderPackages` y `ProviderImages`, con un script de carga inicial (seed) a partir de `src/data.js`. Agregar `GET /api/providers` con filtros y paginación.
2. **Solicitudes y reservas:** `QuoteRequests` (con `share_consent_at`), `Reservations` y `Payments`. Los endpoints se protegen con `requireAuth`.
3. **Favoritos en el servidor:** `Favorites(user_id, provider_id)`, para que se sincronicen entre dispositivos.
4. **Reseñas verificadas:** `Reviews` ligada a una `Reservation` completada, para que solo opine quien contrató.
5. **Producción:** API en Azure App Service o Render, base de datos en Azure SQL Database (tiene un nivel gratuito) con `SQL_ENCRYPT=true`. Después, apuntar `VITE_API_BASE_URL` a esa URL y agregarla al CSP de `index.html`.
6. **Pagos:** pasarela con soporte en Guatemala (por ejemplo Recurrente, Pagalo o Visanet) usando su checkout alojado, para no tocar datos de tarjeta.
7. **Correo transaccional:** un servicio como Resend o Brevo para confirmaciones, con enlace de baja en un clic en los correos promocionales.

## Si la API no puede iniciar sesión en SQL Server

- `Login failed for user 'vibe_app'`: revisa que `SQL_PASSWORD` esté entre comillas si tiene `#`, y que el modo de autenticación sea mixto.
- `ECONNREFUSED 127.0.0.1:1433`: SQL Server Express trae TCP desactivado. Actívalo en *SQL Server Configuration Manager → Protocolos → TCP/IP*, con el puerto 1433 en *IPAll*, y reinicia el servicio `SQL Server (SQLEXPRESS)`.
