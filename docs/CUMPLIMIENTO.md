# Lista de cumplimiento

Estado de los 20 puntos de cumplimiento legal, ética y accesibilidad del sitio. Actualizado el 29 de octubre de 2026.

Leyenda: ✅ implementado · 🟡 implementado, falta un dato o una revisión externa

## Privacidad y legal

| # | Punto | Estado | Dónde |
| --- | --- | --- | --- |
| 1 | Política de privacidad | 🟡 | `#/legal?page=privacidad` · [src/Legal.jsx](../src/Legal.jsx). Falta: datos del responsable en [src/business.js](../src/business.js) y revisión de un abogado. |
| 2 | Términos y condiciones | 🟡 | `#/legal?page=terminos`. Misma revisión pendiente. |
| 3 | Política de reembolsos | 🟡 | `#/legal?page=reembolsos`. Anticipo del 30 % y reembolso escalonado (100 % / 50 % / 0 %). Ajusta los porcentajes a tu modelo de negocio. |
| 4 | Política de cookies | ✅ | `#/legal?page=cookies`. Enumera cada clave guardada en el navegador. |
| 5 | Banner de consentimiento de cookies | ✅ | `CookieBanner` en [src/App.jsx](../src/App.jsx) y [src/consent.js](../src/consent.js). «Rechazar» tiene el mismo peso visual que «Aceptar», la decisión se versiona y se reabre desde el pie de página. |
| 6 | Consentimientos en formularios | ✅ | Registro: términos y privacidad (obligatorio) y correos (opcional, desmarcado). Reserva: autorización explícita para enviar los datos al proveedor. La API guarda fecha y versión de los términos aceptados. |
| 7 | No recolectar datos innecesarios | ✅ | Solo nombre, correo y contraseña. El presupuesto es opcional. El JWT ya no lleva nombre ni correo. No se pide DPI, fecha de nacimiento ni teléfono. |
| 8 | Auditoría de SDKs de terceros | ✅ | Sin analítica, píxeles ni publicidad. Único tercero en el navegador: Unsplash (imágenes), declarado en privacidad y cookies. `npm audit`: 0 vulnerabilidades. |
| 9 | Eliminar patrones oscuros | ✅ | Ya no hay casillas premarcadas, contadores falsos de fotos o mensajes, insignias de notificación inventadas ni botones que no hacían nada. |
| 10 | Eliminar cobros ocultos | ✅ | Desglose antes de pagar: precio, comisión Q0, transporte (que nunca se cobra sin aprobación) y monto de hoy. «Desde» se marca como precio referencial. |

## Contenido y accesibilidad

| # | Punto | Estado | Dónde |
| --- | --- | --- | --- |
| 1 | Eliminar reseñas falsas | ✅ | Se quitaron las 3 reseñas inventadas y las calificaciones y conteos generados. La pestaña Reseñas explica que solo opinan clientes con reserva completada. |
| 2 | Afirmaciones sin respaldo | ✅ | Se quitaron frases como «Más de 10 años de experiencia», «Proveedores verificados» sin criterio y «Tu información está segura». La insignia «Proveedor revisado» explica qué se verificó. Un aviso global indica que los datos son de demostración. |
| 3 | Texto alternativo | ✅ | Las imágenes de referencia describen la foto y no el nombre del proveedor. Las decorativas usan `alt=""` y la escena 3D tiene `aria-hidden`. |
| 4 | Corrección de colores (contraste) | ✅ | Tokens oscurecidos hasta llegar a un contraste mínimo de 4.5:1 (ej. gris `#a5a9bd` → `#6b6f8a`, ámbar `#f59e0b` → `#b45309`). |
| 5 | Navegación con teclado | ✅ | Enlace «Saltar al contenido», foco visible, modal con Escape y foco atrapado, pestañas con flechas y `aria-selected`, menú móvil con `aria-expanded` y foco al cambiar de paso en la reserva. |
| 6 | Datos de tu negocio | 🟡 | Pie de página y Contacto los leen de [src/business.js](../src/business.js). **Falta poner los datos reales** (razón social, NIT, dirección, correo y teléfono). |
| 7 | Consentimiento parental | ✅ | Casilla obligatoria de mayoría de edad en el registro (guardada en `is_adult_confirmed`). Si eres menor, una madre, padre o tutor debe crear la cuenta. |
| 8 | Link de baja | ✅ | Interruptor en Configuración (`PATCH /api/auth/me/preferences`) y página `#/legal?page=baja`. Cada correo promocional debe incluir el enlace de baja en un clic (pendiente cuando se integre un servicio de correo). |
| 9 | Licencia de imágenes | ✅ | `#/legal?page=creditos` con la Licencia Unsplash y la URL de cada foto. Aviso en la ficha de que las fotos no son del proveedor. |
| 10 | Eliminación de datos | ✅ | Configuración → «Eliminar mi cuenta» (`DELETE /api/auth/me`, confirma con contraseña). El historial de auditoría queda anónimo. Página `#/legal?page=eliminar-datos`. |

## Nota legal

Guatemala aún no tiene una ley general de protección de datos personales. Estas políticas siguen buenas prácticas internacionales, como el RGPD, y el derecho constitucional de acceso a datos. Son una plantilla, no asesoría legal: haz que un abogado las revise antes de operar con clientes reales.
