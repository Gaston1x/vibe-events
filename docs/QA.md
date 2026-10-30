# Informe QA / QC

Pruebas manuales y automatizadas en el navegador (Chromium, escritorio 1280 px y móvil 375 px) del 29 de octubre de 2026.

## Defectos encontrados y corregidos

| ID | Severidad | Defecto | Corrección |
| --- | --- | --- | --- |
| QA-01 | Alta | Se podía «Finalizar reserva» sin fecha, sin invitados y sin servicios. | Validación por paso con mensajes accesibles. |
| QA-02 | Alta | Al terminar una reserva se abría el panel con la usuaria ficticia «María López», sin haber iniciado sesión. | El panel exige sesión y muestra el usuario real. La reserva termina en una confirmación honesta. |
| QA-03 | Alta | Registro e inicio de sesión mostraban el error técnico `Failed to fetch` cuando la API no estaba disponible. | Mensaje claro en español. |
| QA-04 | Media | La búsqueda «Fotógrafos en Ciudad de Guatemala» llevaba a Decoración y «Sonido e iluminación» a otra categoría: se calculaban por posición. | Cada búsqueda popular define su categoría, departamento y tipo de evento. |
| QA-05 | Media | El filtro de departamento «Guatemala» mostraba todos los proveedores del país. | «Todo el país» es una opción aparte y «Guatemala» filtra el departamento. |
| QA-06 | Media | El título siempre decía «en Guatemala» aunque se filtrara otro departamento. | El título refleja la ubicación aplicada. |
| QA-07 | Media | La fecha mínima estaba fija en 21/05/2026, así que se podían elegir fechas pasadas. | La fecha mínima es la de hoy y además se valida al enviar. |
| QA-08 | Media | Ninguna pantalla tenía URL: recargar volvía al inicio, Atrás salía del sitio y no había enlaces para compartir. | Rutas con hash (`#/proveedor?providerId=...`). |
| QA-09 | Media | No había botón para cerrar sesión. | Cerrar sesión en la cabecera y en el panel. |
| QA-10 | Media | El modal no se cerraba con Escape y el foco quedaba detrás. | Escape, foco inicial, foco atrapado y foco devuelto al cerrar. |
| QA-11 | Baja | «Compartir», «Ver todas las fotos», «Responder» y las pestañas de cotizaciones no hacían nada. | Compartir funciona; los demás se quitaron. |
| QA-12 | Baja | «Limpiar filtros» no aplicaba el cambio. | Limpia y aplica en un clic. |
| QA-13 | Baja | Registrar dos veces el mismo correo al mismo tiempo provocaba un error 500. | La API responde 409 ante la violación de clave única. |
| QA-14 | Baja | El paquete de JavaScript pesaba 894 kB. | Separado en app (78 kB), vendor y three.js, cacheables por separado. |
| QA-15 | Seguridad | 12 vulnerabilidades en dependencias (1 crítica en `proxy-addr`). | `npm audit fix`: 0 vulnerabilidades. |
| QA-16 | Seguridad | 80 intentos de login cada 15 minutos por IP. | Límite de 10 intentos en `/login`. |

## Casos verificados después de las correcciones

- Las 4 búsquedas populares llevan a la categoría y ubicación correctas.
- Atrás del navegador regresa a la pantalla anterior.
- El registro sin API muestra un mensaje claro; las casillas obligatorias impiden enviar el formulario.
- `#/panel` sin sesión pide iniciar sesión.
- Reserva: fecha pasada → error; sin autorización → error; desglose correcto (anticipo de Q 7,310 × 30 % = Q 2,193).
- Pestañas: se cambian con las flechas y tienen `aria-selected`.
- Banner de cookies: rechazar no guarda favoritos y se puede reabrir desde el pie.
- Sin desbordamiento horizontal a 375 px.

## No cubierto

- Registro, login, baja y eliminación de cuenta **contra SQL Server**: no hay instancia en el equipo de prueba. Solo se verificó la sintaxis del servidor (`node --check`).
- Lectores de pantalla reales (NVDA/VoiceOver).

Para correr las pruebas sin animaciones (útil en navegadores automatizados) agrega `?sin-animaciones` a la URL.
