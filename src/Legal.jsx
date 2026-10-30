import { ArrowLeft } from "lucide-react";
import { business, legalUpdatedAt } from "./business.js";
import { imageCredits } from "./data.js";

const contactLine = `${business.privacyEmail} · ${business.address}`;

export const legalPages = {
  privacidad: {
    title: "Política de privacidad",
    intro: `Esta política explica qué datos personales trata ${business.brand}, para qué los usamos y cómo puedes ejercer tus derechos.`,
    sections: [
      [
        "Responsable",
        `${business.legalName} (NIT ${business.taxId}), con domicilio en ${business.address}. Contacto de privacidad: ${business.privacyEmail}.`,
      ],
      [
        "Datos que recopilamos",
        [
          "Cuenta: nombre, correo electrónico y contraseña (guardada solo como hash cifrado con bcrypt).",
          "Solicitudes de cotización: tipo y fecha del evento, número de invitados, ubicación, servicios y, de forma opcional, presupuesto.",
          "Registro de consentimientos: fecha y versión de los términos aceptados y si aceptaste recibir correos promocionales.",
          "Datos técnicos mínimos: registros del servidor por seguridad (fecha, ruta y código de respuesta). No usamos analítica ni publicidad.",
        ],
      ],
      [
        "Datos que no pedimos",
        "No solicitamos DPI, fecha de nacimiento, ubicación GPS, contactos ni datos de tarjeta. Los pagos se procesarán con un proveedor certificado PCI DSS y nunca guardamos números de tarjeta.",
      ],
      [
        "Para qué usamos tus datos",
        [
          "Crear y mantener tu cuenta.",
          "Enviar tu solicitud al proveedor que elijas, solo después de que lo autorices en el formulario.",
          "Enviarte correos promocionales, solo si marcaste esa casilla. Puedes darte de baja cuando quieras.",
          "Prevenir fraude y abuso (límite de intentos de inicio de sesión).",
        ],
      ],
      [
        "Con quién los compartimos",
        "Con el proveedor que selecciones para tu evento y con proveedores de infraestructura (alojamiento y base de datos) que actúan por nuestra cuenta. No vendemos ni alquilamos datos personales.",
      ],
      [
        "Servicios de terceros",
        "Las fotos de referencia se cargan desde Unsplash (images.unsplash.com), que recibe tu dirección IP al mostrarlas. El sitio no carga píxeles de seguimiento, SDK de analítica ni redes publicitarias.",
      ],
      [
        "Conservación",
        "Conservamos la cuenta mientras esté activa. Si la eliminas, borramos tus datos personales de inmediato y solo guardamos un registro anónimo de que la eliminación ocurrió.",
      ],
      [
        "Menores de edad",
        "El servicio está dirigido a personas mayores de 18 años. Si eres menor, una madre, padre o tutor debe crear la cuenta y hacer las solicitudes. Si detectamos una cuenta de un menor sin ese consentimiento, la eliminamos.",
      ],
      [
        "Tus derechos",
        "Puedes acceder, corregir o eliminar tus datos y retirar tu consentimiento en cualquier momento desde Configuración o escribiendo a " +
          `${business.privacyEmail}. Respondemos en un máximo de 15 días hábiles.`,
      ],
    ],
  },
  terminos: {
    title: "Términos y condiciones",
    intro: `Estos términos regulan el uso de ${business.brand}, un marketplace que conecta a personas que organizan eventos con proveedores en ${business.jurisdiction}.`,
    sections: [
      [
        "Qué hace la plataforma",
        `${business.brand} muestra proveedores, recibe solicitudes de cotización y facilita reservas. El contrato del servicio del evento se celebra entre tú y el proveedor; nosotros no prestamos directamente el servicio del evento.`,
      ],
      ["Cuenta", "Debes ser mayor de 18 años, dar datos verdaderos y mantener tu contraseña en privado. Puedes cerrar tu cuenta cuando quieras."],
      [
        "Precios",
        "Los precios con la palabra «Desde» son referenciales. Antes de cualquier pago verás el desglose completo: precio del proveedor, transporte si aplica, impuestos y comisión. La comisión de la plataforma es de Q0. Nunca se cobra un monto que no hayas visto y aprobado.",
      ],
      [
        "Proveedores revisados",
        "La insignia de proveedor revisado indica que verificamos su identidad, su NIT y al menos un contrato o factura de un evento anterior. No garantiza el resultado del evento.",
      ],
      [
        "Reseñas",
        "Solo pueden dejar reseñas clientes con una reserva completada. No publicamos reseñas pagadas ni inventadas y no eliminamos reseñas negativas legítimas.",
      ],
      ["Uso aceptable", "No está permitido publicar información falsa, suplantar a otra persona ni intentar acceder a cuentas ajenas."],
      [
        "Ley aplicable",
        `Estos términos se rigen por las leyes de la República de Guatemala. Contacto: ${business.email}.`,
      ],
    ],
  },
  reembolsos: {
    title: "Política de reembolsos y cancelaciones",
    intro: "Así funcionan los anticipos, las cancelaciones y los reembolsos de las reservas hechas en la plataforma.",
    sections: [
      ["Anticipo", "Para confirmar una reserva se paga un anticipo del 30 % del total aprobado. El saldo se paga directamente según lo acordado con el proveedor."],
      [
        "Si cancelas tú",
        [
          "Con 30 días o más de anticipación: reembolso del 100 % del anticipo.",
          "Entre 15 y 29 días antes: reembolso del 50 % del anticipo.",
          "Con menos de 15 días: el anticipo no es reembolsable, salvo caso de fuerza mayor documentado.",
        ],
      ],
      ["Si cancela el proveedor", "Recibes el 100 % de lo pagado y te ayudamos a encontrar un reemplazo sin costo adicional."],
      ["Plazo", "Los reembolsos se emiten al mismo método de pago en un máximo de 10 días hábiles desde que se aprueban."],
      ["Cómo solicitarlo", `Desde la reserva en tu panel o escribiendo a ${business.email} con el número de reserva.`],
    ],
  },
  cookies: {
    title: "Política de cookies y almacenamiento",
    intro: "El sitio guarda muy poca información en tu navegador y no usa cookies de analítica ni de publicidad.",
    sections: [
      [
        "Necesarias (siempre activas)",
        [
          "vibe:token: mantiene tu sesión iniciada. Se borra al cerrar sesión.",
          "vibe:cookie-consent: recuerda tu decisión sobre este aviso.",
        ],
      ],
      ["Preferencias (opcional)", ["vibe:favorites: recuerda los proveedores que guardaste. Si no lo aceptas, los favoritos solo duran mientras la página esté abierta."]],
      ["Terceros", "Las imágenes de referencia se cargan desde Unsplash, que puede registrar tu IP como cualquier servidor web. No instalamos cookies de terceros."],
      ["Cambiar tu decisión", "Puedes cambiarla en cualquier momento con el enlace «Preferencias de cookies» del pie de página."],
    ],
  },
  creditos: {
    title: "Créditos y licencias de imágenes",
    intro:
      "Las fotografías son imágenes de referencia de Unsplash, publicadas bajo la Licencia Unsplash (uso comercial y no comercial gratuito, sin atribución obligatoria). No muestran a los proveedores listados.",
    sections: [["Licencia", "https://unsplash.com/license"]],
  },
  baja: {
    title: "Darse de baja de correos",
    intro: "Puedes dejar de recibir correos promocionales en cualquier momento, sin costo y sin cerrar tu cuenta.",
    sections: [
      ["Desde tu cuenta", "Entra a Configuración y desactiva «Recibir correos promocionales». El cambio es inmediato."],
      ["Desde un correo", "Cada correo promocional incluye un enlace «Darme de baja» que funciona con un solo clic, sin pedir contraseña."],
      ["Por correo electrónico", `Escribe a ${business.email} con el asunto «Baja» desde la dirección que quieres retirar.`],
      ["Qué seguirás recibiendo", "Solo mensajes necesarios del servicio: confirmaciones de reserva, cambios de cotización y avisos de seguridad."],
    ],
  },
  "eliminar-datos": {
    title: "Eliminación de datos",
    intro: "Tienes derecho a que eliminemos tu cuenta y tus datos personales.",
    sections: [
      ["Desde tu cuenta", "Entra a Configuración → «Eliminar mi cuenta» y confirma con tu contraseña. Se borran tu cuenta, favoritos y preferencias de inmediato."],
      ["Sin acceso a tu cuenta", `Escribe a ${business.privacyEmail} desde el correo registrado. Respondemos en un máximo de 15 días hábiles.`],
      ["Qué conservamos", "Un registro anónimo de que la cuenta se eliminó, y datos de reservas pagadas solo el tiempo que exija la ley fiscal guatemalteca."],
    ],
  },
};

export function LegalPage({ slug, navigate }) {
  const page = legalPages[slug] ?? legalPages.privacidad;

  return (
    <main className="legal-page" id="contenido">
      <button className="link-btn" onClick={() => navigate({ name: "home" })}>
        <ArrowLeft size={16} />
        Volver al inicio
      </button>
      <article>
        <span className="eyebrow">Información legal</span>
        <h1>{page.title}</h1>
        <p className="legal-meta">Última actualización: {legalUpdatedAt}</p>
        <p className="legal-intro">{page.intro}</p>
        {page.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            {Array.isArray(body) ? (
              <ul>
                {body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : body.startsWith("https://") ? (
              <p>
                <a href={body} target="_blank" rel="noreferrer">
                  {body}
                </a>
              </p>
            ) : (
              <p>{body}</p>
            )}
          </section>
        ))}
        {slug === "creditos" && (
          <section>
            <h2>Fotografías usadas</h2>
            <ul className="credit-list">
              {imageCredits.map((credit) => (
                <li key={credit.url}>
                  <span>{credit.category}</span>
                  <a href={credit.url} target="_blank" rel="noreferrer">
                    {credit.url.replace("https://images.unsplash.com/", "")}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="legal-contact">¿Dudas? {contactLine}</p>
      </article>
    </main>
  );
}
