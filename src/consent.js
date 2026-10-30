import { legalVersion } from "./business.js";

const CONSENT_KEY = "vibe:cookie-consent";

// "necessary" siempre está activo: guarda la sesión y esta misma decisión.
// "preferences" permite recordar favoritos en este navegador.
// El sitio no usa cookies de analítica ni de publicidad.
export function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (!saved || saved.version !== legalVersion) return null;
    return saved;
  } catch {
    return null;
  }
}

export function saveConsent({ preferences }) {
  const consent = {
    necessary: true,
    preferences: Boolean(preferences),
    version: legalVersion,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    if (!consent.preferences) localStorage.removeItem("vibe:favorites");
  } catch {
    // Sin almacenamiento disponible: la decisión dura solo esta visita.
  }
  return consent;
}
