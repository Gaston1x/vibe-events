// Datos del responsable del sitio. Se muestran en el pie de página, Contacto y
// las políticas legales. Los valores entre corchetes son pendientes: cámbialos por
// los datos reales del negocio antes de publicar en producción.
export const business = {
  brand: "Vibe Events",
  legalName: "[Razón social registrada]",
  taxId: "[NIT]",
  address: "[Dirección fiscal], Ciudad de Guatemala, Guatemala",
  email: "[correo de contacto]",
  privacyEmail: "[correo para privacidad y datos personales]",
  phone: "[teléfono de atención]",
  hours: "Lunes a viernes, 9:00 a. m. a 6:00 p. m. (hora de Guatemala)",
  jurisdiction: "Guatemala",
  // Mientras sea true, el sitio avisa que proveedores, precios y reservas son ficticios.
  demoMode: true,
};

export const legalVersion = "2026-10-29";
export const legalUpdatedAt = "29 de octubre de 2026";

export const isPending = (value) => /^\[.*\]/.test(value);
