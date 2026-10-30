import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Filter,
  Grid3X3,
  Heart,
  Home,
  Info,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Music,
  Palette,
  Phone,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sofa,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  User,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  categories,
  departments,
  eventTypes,
  formatCurrency,
  providers,
  quotes,
  reservations,
} from "./data.js";
import { deleteAccount, getCurrentUser, loginUser, registerUser, updatePreferences } from "./api.js";
import { business, isPending, legalVersion } from "./business.js";
import { readConsent, saveConsent } from "./consent.js";
import { LegalPage, legalPages } from "./Legal.jsx";

// Fecha local de hoy en formato AAAA-MM-DD, para no permitir eventos en el pasado.
function todayISO() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// También se puede forzar con ?sin-animaciones en la URL (útil para pruebas automatizadas).
const prefersReducedMotion = () =>
  new URLSearchParams(window.location.search).has("sin-animaciones") ||
  (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

// Rutas en el hash (#/resultados?category=salones) para que cada vista tenga URL,
// funcione el botón Atrás y se puedan compartir enlaces en GitHub Pages.
const routeSlugs = {
  home: "",
  results: "resultados",
  detail: "proveedor",
  booking: "reserva",
  dashboard: "panel",
  info: "info",
  legal: "legal",
};

function routeToHash(route) {
  const { name, draft, ...params } = route;
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ).toString();
  return `#/${routeSlugs[name] ?? ""}${query ? `?${query}` : ""}`;
}

function hashToRoute(hash) {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const name = Object.keys(routeSlugs).find((key) => routeSlugs[key] === path) || "home";
  const params = Object.fromEntries(new URLSearchParams(query));
  if (params.step) params.step = Number(params.step) || 1;
  return { ...params, name };
}

const iconMap = {
  building: Building2,
  utensils: Utensils,
  sparkles: Sparkles,
  camera: Camera,
  music: Music,
  sofa: Sofa,
};

const dashboardItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "buscar", label: "Buscar", icon: Search },
  { id: "cotizaciones", label: "Cotizaciones", icon: ClipboardList },
  { id: "reservas", label: "Reservas", icon: Calendar },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "mensajes", label: "Mensajes", icon: MessageCircle },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

function sanitize(value) {
  return String(value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function slugLabel(id) {
  return categories.find((category) => category.id === id)?.label ?? "Servicios";
}

function getIcon(categoryId) {
  const iconName = categories.find((category) => category.id === categoryId)?.icon;
  return iconMap[iconName] ?? Grid3X3;
}

function Logo({ compact = false }) {
  return (
    <button className="logo" onClick={() => window.dispatchEvent(new CustomEvent("navigate-home"))} aria-label="Ir al inicio">
      <span className="logo-mark">V</span>
      <span className="logo-copy">
        <strong>vibe</strong>
        {!compact && <small>EVENTS</small>}
      </span>
    </button>
  );
}

function Header({ navigate, openDashboard, openAuth, currentUser, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { label: "Explorar", action: () => navigate({ name: "home" }) },
    { label: "Proveedores", action: () => navigate({ name: "results", category: "salones" }) },
    { label: "Cómo funciona", action: () => navigate({ name: "info", section: "como-funciona" }) },
    { label: "Blog", action: () => navigate({ name: "info", section: "blog" }) },
    { label: "Contacto", action: () => navigate({ name: "info", section: "contacto" }) },
  ];

  return (
    <header className="topbar">
      <Logo />
      <nav className="main-nav" aria-label="Navegación principal">
        {nav.map((item) => (
          <button key={item.label} onClick={item.action}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="top-actions">
        <button className="ghost icon-only" aria-label="Buscar proveedores" onClick={() => navigate({ name: "results", category: "salones" })}>
          <Search size={18} />
        </button>
        {currentUser ? (
          <>
            <button className="btn secondary login-btn" onClick={openDashboard}>
              <User size={16} />
              Mi panel
            </button>
            <button className="btn primary register-btn" onClick={onLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button className="btn secondary login-btn" onClick={() => openAuth("login")}>
              <LogIn size={16} />
              Iniciar sesión
            </button>
            <button className="btn primary register-btn" onClick={() => openAuth("register")}>
              <UserPlus size={16} />
              Registrarse
            </button>
          </>
        )}
        <button
          className="ghost icon-only menu-toggle"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu" id="menu-movil">
          {nav.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function ThreeScene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.3);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const materialA = new THREE.MeshStandardMaterial({
      color: "#7c3aed",
      roughness: 0.28,
      metalness: 0.36,
      emissive: "#2f0a77",
      emissiveIntensity: 0.18,
    });
    const materialB = new THREE.MeshStandardMaterial({
      color: "#38bdf8",
      roughness: 0.22,
      metalness: 0.42,
      emissive: "#083344",
      emissiveIntensity: 0.14,
    });
    const materialC = new THREE.MeshStandardMaterial({
      color: "#facc15",
      roughness: 0.32,
      metalness: 0.22,
      emissive: "#713f12",
      emissiveIntensity: 0.12,
    });

    const shapes = [
      new THREE.Mesh(new THREE.TorusKnotGeometry(0.56, 0.13, 110, 16), materialA),
      new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), materialB),
      new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.045, 18, 90), materialC),
    ];

    shapes[0].position.set(-1.2, 0.2, 0.1);
    shapes[1].position.set(1.1, -0.18, -0.15);
    shapes[2].position.set(0.12, -0.05, 0.35);
    shapes.forEach((shape) => group.add(shape));

    const lights = [
      new THREE.PointLight("#ffffff", 2.4, 8),
      new THREE.PointLight("#8b5cf6", 1.4, 7),
      new THREE.AmbientLight("#dbeafe", 1.5),
    ];
    lights[0].position.set(2, 2, 3);
    lights[1].position.set(-2, -1, 2);
    lights.forEach((light) => scene.add(light));

    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          Array.from({ length: 180 }, (_, index) => {
            const lane = index % 3;
            const radius = 1.9 + lane * 0.5;
            const angle = index * 0.34;
            return [Math.cos(angle) * radius, Math.sin(angle * 0.9) * 0.85, Math.sin(angle) * radius * 0.34];
          }).flat(),
          3,
        ),
      ),
      new THREE.PointsMaterial({ color: "#ffffff", size: 0.028, transparent: true, opacity: 0.58 }),
    );
    scene.add(particles);

    let frame = 0;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const reducedMotion = prefersReducedMotion();
    const animate = () => {
      if (!reducedMotion) frame = window.requestAnimationFrame(animate);
      const time = reducedMotion ? 1.2 : performance.now() * 0.001;
      group.rotation.y = time * 0.25;
      group.rotation.x = Math.sin(time * 0.6) * 0.08;
      shapes[0].rotation.x = time * 0.42;
      shapes[1].rotation.y = -time * 0.36;
      shapes[2].rotation.z = time * 0.28;
      particles.rotation.y = time * 0.08;
      renderer.render(scene, camera);
    };

    resize();
    animate();
    const onResize = () => {
      resize();
      if (reducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      shapes.forEach((shape) => {
        shape.geometry.dispose();
      });
      particles.geometry.dispose();
      particles.material.dispose();
      materialA.dispose();
      materialB.dispose();
      materialC.dispose();
      renderer.dispose();
      host.replaceChildren();
    };
  }, []);

  return <div ref={hostRef} className="three-stage" />;
}

function HeroSearch({ onSearch, navigate }) {
  const [form, setForm] = useState({
    category: "salones",
    location: "Todos",
    date: "",
  });

  const submit = (event) => {
    event.preventDefault();
    onSearch({
      category: sanitize(form.category) || "salones",
      location: sanitize(form.location) || "Todos",
      date: sanitize(form.date),
    });
  };

  const popularSearches = [
    { label: "Salones en Sacatepéquez", category: "salones", location: "Sacatepéquez" },
    { label: "Catering para bodas", category: "catering", eventType: "Boda" },
    { label: "Fotografía en Guatemala", category: "fotografia", location: "Guatemala" },
    { label: "Sonido e iluminación", category: "sonido" },
  ];

  return (
    <section className="hero">
      <div className="hero-media">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=85" alt="" />
        <div className="hero-shade" />
        <ThreeScene />
      </div>
      <div className="hero-content">
        <span className="pill location-pill">
          <MapPin size={15} /> Guatemala
        </span>
        <h1>Tu evento empieza aquí</h1>
        <p>Cotiza, compara y reserva salones, catering, fotografía y más para tu evento en Guatemala.</p>
        <form className="search-panel" onSubmit={submit}>
          <label>
            <span>¿Qué servicio necesitas?</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>¿Dónde será tu evento?</span>
            <select value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })}>
              <option value="Todos">Todo el país</option>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Fecha del evento (opcional)</span>
            <input
              type="date"
              min={todayISO()}
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <button className="btn primary search-btn" type="submit">
            <Search size={18} />
            Buscar proveedores
          </button>
        </form>
        <div className="popular-searches" aria-label="Búsquedas populares">
          {popularSearches.map(({ label, ...search }) => (
            <button key={label} onClick={() => navigate({ name: "results", ...search })}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryIcon({ categoryId, size = 18 }) {
  const Icon = getIcon(categoryId);
  return <Icon size={size} />;
}

function CategoryRail({ navigate }) {
  return (
    <section className="section compact-section">
      <div className="section-title centered">
        <h2>Explora por categoría</h2>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button key={category.id} className="category-card" onClick={() => navigate({ name: "results", category: category.id })}>
            <img src={providers.find((provider) => provider.category === category.id)?.image} alt="" />
            <span className="category-icon" style={{ color: category.accent }}>
              <CategoryIcon categoryId={category.id} size={24} />
            </span>
            <strong>{category.label}</strong>
            <small>{category.hint}</small>
          </button>
        ))}
        <button className="category-card more-card" onClick={() => navigate({ name: "booking", step: 1 })}>
          <span className="more-dots" aria-hidden="true">...</span>
          <strong>Varios servicios</strong>
          <small>Arma una solicitud con todo lo que necesitas</small>
        </button>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, title: "Proveedores revisados", text: "Revisamos identidad y NIT antes de mostrar la insignia." },
    { icon: Wallet, title: "Precios claros", text: "Ves el desglose completo antes de pagar. Comisión: Q0." },
    { icon: LockKeyhole, title: "Tú decides qué compartir", text: "Tus datos solo llegan al proveedor que autorices." },
    { icon: MessageCircle, title: "Cancelaciones claras", text: "Reglas de reembolso publicadas antes de reservar." },
  ];

  return (
    <section className="trust-bar" aria-label="Cómo protegemos tu reserva">
      {items.map((item) => (
        <article key={item.title}>
          <span aria-hidden="true">
            <item.icon size={24} />
          </span>
          <div>
            <strong>{item.title}</strong>
            <small>{item.text}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

function VerifiedBadge({ size = 18 }) {
  return (
    <span className="verified" role="img" aria-label="Proveedor revisado" title="Proveedor revisado: identidad y NIT verificados">
      <BadgeCheck size={size} aria-hidden="true" />
    </span>
  );
}

function HomePage({ navigate }) {
  return (
    <main id="contenido">
      <HeroSearch onSearch={(payload) => navigate({ name: "results", ...payload })} navigate={navigate} />
      <CategoryRail navigate={navigate} />
      <TrustBar />
      <FeaturedProviders navigate={navigate} />
    </main>
  );
}

function FeaturedProviders({ navigate }) {
  const featured = providers.filter((provider) => provider.featured).slice(0, 8);

  return (
    <section className="section">
      <div className="section-title">
        <div>
          <span className="eyebrow">Proveedores destacados</span>
          <h2>Opciones listas para cotizar</h2>
        </div>
        <button className="btn secondary" onClick={() => navigate({ name: "results", category: "salones" })}>
          Ver catálogo
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="featured-grid">
        {featured.map((provider) => (
          <ProviderTile key={provider.id} provider={provider} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function ProviderTile({ provider, navigate, compact = false, favorite, onFavorite }) {
  return (
    <article className={compact ? "provider-tile compact" : "provider-tile"}>
      <img src={provider.image} alt={provider.imageAlt} loading="lazy" />
      <div className="provider-tile-body">
        <div className="provider-row">
          <span className="mini-category">
            <CategoryIcon categoryId={provider.category} size={15} />
            {provider.categoryLabel}
          </span>
          {provider.verified && <VerifiedBadge />}
        </div>
        <h3>{provider.name}</h3>
        <p>
          <MapPin size={14} />
          {provider.location}
        </p>
        <div className="provider-meta">
          <span>Responde en ~{provider.responseTime}</span>
          <span>Desde {formatCurrency(provider.price)}</span>
        </div>
        <div className="provider-actions">
          <button className="btn primary" onClick={() => navigate({ name: "detail", providerId: provider.id })}>
            Ver detalles<span className="sr-only"> de {provider.name}</span>
          </button>
          {onFavorite && (
            <button className="btn secondary icon-label" aria-pressed={favorite} onClick={() => onFavorite(provider.id)}>
              <Heart size={16} fill={favorite ? "currentColor" : "none"} />
              {favorite ? "Guardado" : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const defaultFilters = { location: "Todos", eventType: "Todos", min: 0, max: 50000 };

function FilterPanel({ filters, setFilters, applyFilters }) {
  return (
    <aside className="filter-panel" aria-label="Filtros">
      <div className="filter-head">
        <strong>Filtrar resultados</strong>
        <button
          type="button"
          onClick={() => {
            setFilters(defaultFilters);
            applyFilters(defaultFilters);
          }}
        >
          Limpiar filtros
        </button>
      </div>
      <label>
        <span>
          <MapPin size={15} />
          Ubicación
        </span>
        <select value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })}>
          <option value="Todos">Todo el país</option>
          {departments.map((department) => (
            <option key={department}>{department}</option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <Calendar size={15} />
          Tipo de evento
        </span>
        <select value={filters.eventType} onChange={(event) => setFilters({ ...filters, eventType: event.target.value })}>
          <option>Todos</option>
          {eventTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <Wallet size={15} />
          Precio máximo
        </span>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={filters.max}
          aria-valuetext={formatCurrency(filters.max)}
          onChange={(event) => setFilters({ ...filters, max: Number(event.target.value) })}
        />
        <small>Hasta {formatCurrency(filters.max)}</small>
      </label>
      <button className="btn outlined full" type="button" onClick={() => applyFilters(filters)}>
        Aplicar filtros
      </button>
    </aside>
  );
}

function ResultsPage({ route, navigate, favorites, toggleFavorite }) {
  const initialFilters = {
    ...defaultFilters,
    location: route.location || defaultFilters.location,
    eventType: route.eventType || defaultFilters.eventType,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const inCategory = providers.filter((provider) => provider.category === route.category);

  const listed = useMemo(() => {
    const base = inCategory
      .filter((provider) => appliedFilters.location === "Todos" || provider.department === appliedFilters.location)
      .filter((provider) => appliedFilters.eventType === "Todos" || provider.tags.includes(appliedFilters.eventType))
      .filter((provider) => provider.price >= appliedFilters.min && provider.price <= appliedFilters.max);

    return [...base].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return Number(b.featured) - Number(a.featured) || a.providerNumber - b.providerNumber;
    });
  }, [appliedFilters, route.category, sort]);

  const where = appliedFilters.location === "Todos" ? "todo el país" : appliedFilters.location;

  return (
    <main className="results-layout" id="contenido">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Home size={15} aria-hidden="true" /> Inicio <span aria-hidden="true">/</span> Resultados de búsqueda
      </nav>
      <div className="results-grid">
        <div className={`filters-shell ${mobileFilters ? "open" : ""}`} id="panel-filtros">
          <FilterPanel filters={filters} setFilters={setFilters} applyFilters={setAppliedFilters} />
        </div>
        <section className="results-panel">
          <div className="results-title">
            <div>
              <span className="eyebrow">Catálogo de proveedores</span>
              <h1>
                {slugLabel(route.category)} en {where}
              </h1>
              <p aria-live="polite">
                {listed.length} de {inCategory.length} proveedores de esta categoría coinciden con tu búsqueda.
              </p>
            </div>
            <div className="sort-row">
              <button
                className="btn secondary mobile-filter-btn"
                aria-expanded={mobileFilters}
                aria-controls="panel-filtros"
                onClick={() => setMobileFilters((value) => !value)}
              >
                <Filter size={16} />
                Filtros
              </button>
              <label>
                Ordenar por
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="relevance">Destacados primero</option>
                  <option value="price">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
              </label>
            </div>
          </div>
          <div className="result-list">
            {listed.map((provider) => (
              <article className="result-card" key={provider.id}>
                <img src={provider.image} alt={provider.imageAlt} loading="lazy" />
                <div className="result-copy">
                  <div className="provider-row">
                    {provider.featured && <span className="badge">Destacado</span>}
                    {provider.verified && <VerifiedBadge size={17} />}
                  </div>
                  <h2>{provider.name}</h2>
                  <p>
                    <MapPin size={15} />
                    {provider.address}
                  </p>
                  <p>
                    <Users size={15} />
                    {provider.capacity}
                    <span className="dot" />
                    Responde en ~{provider.responseTime}
                  </p>
                  <div className="tag-row">
                    {provider.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="result-price">
                  <small>Desde</small>
                  <strong>{formatCurrency(provider.price)}</strong>
                  <span>precio referencial por evento</span>
                  <button className="btn primary" onClick={() => navigate({ name: "detail", providerId: provider.id })}>
                    Ver detalles<span className="sr-only"> de {provider.name}</span>
                  </button>
                  <button
                    className="btn secondary"
                    aria-pressed={favorites.includes(provider.id)}
                    onClick={() => toggleFavorite(provider.id)}
                  >
                    <Heart size={16} fill={favorites.includes(provider.id) ? "currentColor" : "none"} />
                    {favorites.includes(provider.id) ? "Guardado" : "Guardar"}
                    <span className="sr-only"> {provider.name}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          {listed.length === 0 && (
            <div className="empty-state">
              <SlidersHorizontal size={42} />
              <h2>No encontramos resultados con esos filtros</h2>
              <p>Prueba ampliar el rango de precio o cambiar la ubicación.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DetailPage({ route, navigate, favorites, toggleFavorite }) {
  const provider = providers.find((item) => item.id === route.providerId) ?? providers[0];
  const [tab, setTab] = useState("descripcion");
  const [shareStatus, setShareStatus] = useState("");
  const [quickQuote, setQuickQuote] = useState({
    date: "",
    eventType: "Boda",
    guests: "",
  });
  const tabs = [
    ["descripcion", "Descripción"],
    ["servicios", "Servicios"],
    ["paquetes", "Paquetes"],
    ["resenas", "Reseñas"],
    ["ubicacion", "Ubicación"],
  ];

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: provider.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus("Enlace copiado");
    } catch {
      setShareStatus("");
    }
  };

  // Flechas izquierda/derecha para moverse entre pestañas (patrón ARIA de tabs).
  const onTabKeyDown = (event) => {
    const index = tabs.findIndex(([id]) => id === tab);
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const nextId = tabs[(index + delta + tabs.length) % tabs.length][0];
    setTab(nextId);
    document.getElementById(`tab-${nextId}`)?.focus();
  };

  const submitQuickQuote = (event) => {
    event.preventDefault();
    navigate({
      name: "booking",
      step: 2,
      providerId: provider.id,
      draft: {
        eventType: sanitize(quickQuote.eventType),
        date: sanitize(quickQuote.date),
        guests: sanitize(quickQuote.guests),
      },
    });
  };

  return (
    <main className="detail-page" id="contenido">
      <div className="detail-topline">
        <button className="link-btn" onClick={() => navigate({ name: "results", category: provider.category })}>
          <ArrowLeft size={16} />
          Volver a explorar
        </button>
        <div>
          <button className="ghost icon-label" onClick={share}>
            <Share2 size={17} />
            Compartir
          </button>
          <span className="sr-only" role="status">
            {shareStatus}
          </span>
          {shareStatus && <small className="share-status">{shareStatus}</small>}
          <button className="ghost icon-label" aria-pressed={favorites.includes(provider.id)} onClick={() => toggleFavorite(provider.id)}>
            <Heart size={17} fill={favorites.includes(provider.id) ? "currentColor" : "none"} />
            {favorites.includes(provider.id) ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="gallery">
            <div className="gallery-main">
              <img src={provider.gallery[0]} alt={provider.imageAlt} />
            </div>
            <div className="gallery-stack">
              {provider.gallery.slice(1, 4).map((image) => (
                <div className="gallery-small" key={image}>
                  <img src={image} alt={provider.imageAlt} />
                </div>
              ))}
            </div>
          </div>
          <p className="image-note">Fotos de referencia de Unsplash; no corresponden a este proveedor.</p>
          <div className="detail-heading">
            <div>
              <h1>
                {provider.name}
                {provider.verified && <VerifiedBadge size={24} />}
              </h1>
              <p className="rating-line">
                <MapPin size={17} />
                {provider.location}, Guatemala
                <span />
                Responde en ~{provider.responseTime}
              </p>
            </div>
            <button className="btn primary" onClick={() => navigate({ name: "booking", step: 2, providerId: provider.id })}>
              <Calendar size={17} />
              Solicitar cotización
            </button>
          </div>
          <div className="detail-highlights">
            <span>
              <CategoryIcon categoryId={provider.category} size={16} />
              {provider.categoryLabel}
            </span>
            <span>
              <MapPin size={16} />
              Cobertura: {provider.department}
            </span>
            <span>
              <Users size={16} />
              Capacidad: {provider.capacity}
            </span>
          </div>
          <div className="tabs" role="tablist" aria-label="Información del proveedor" onKeyDown={onTabKeyDown}>
            {tabs.map(([id, label]) => (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls="panel-detalle"
                tabIndex={tab === id ? 0 : -1}
                className={tab === id ? "active" : ""}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div id="panel-detalle" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
            <DetailTab tab={tab} provider={provider} />
          </div>
        </section>
        <aside className="quote-card">
          <h2>Solicita una cotización rápida</h2>
          <p>Cuéntanos los detalles de tu evento y recibe una propuesta personalizada.</p>
          <form onSubmit={submitQuickQuote}>
            <label>
              <span>Fecha del evento</span>
              <input
                type="date"
                min={todayISO()}
                value={quickQuote.date}
                onChange={(event) => setQuickQuote({ ...quickQuote, date: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Tipo de evento</span>
              <select value={quickQuote.eventType} onChange={(event) => setQuickQuote({ ...quickQuote, eventType: event.target.value })}>
                {eventTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Número de invitados</span>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={quickQuote.guests}
                onChange={(event) => setQuickQuote({ ...quickQuote, guests: event.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="Ej. 150"
                required
              />
            </label>
            <button className="btn primary full" type="submit">
              Solicitar cotización
              <ArrowRight size={16} />
            </button>
          </form>
          <small className="secure-line">
            <ShieldCheck size={15} />
            Solicitar una cotización es gratis y no te compromete a pagar.
          </small>
        </aside>
      </div>
    </main>
  );
}

function DetailTab({ tab, provider }) {
  if (tab === "servicios") {
    return (
      <div className="tab-panel service-grid">
        {provider.services.map((service) => (
          <article key={service}>
            <CheckCircle size={20} />
            <strong>{service}</strong>
            <span>Incluido bajo coordinación previa.</span>
          </article>
        ))}
      </div>
    );
  }

  if (tab === "paquetes") {
    return (
      <div className="tab-panel packages">
        <article>
          <h3>{provider.package.name}</h3>
          <strong>{formatCurrency(provider.price)}</strong>
          {provider.package.includes.map((item) => (
            <span key={item}>
              <CheckCircle size={16} />
              {item}
            </span>
          ))}
        </article>
        <article>
          <h3>Paquete Experiencia</h3>
          <strong>{formatCurrency(provider.price + 4200)}</strong>
          {["Coordinador dedicado", "Montaje extendido", "Revisión final", "Prioridad en agenda"].map((item) => (
            <span key={item}>
              <CheckCircle size={16} />
              {item}
            </span>
          ))}
        </article>
      </div>
    );
  }

  if (tab === "resenas") {
    return (
      <div className="tab-panel empty-state">
        <Star size={36} aria-hidden="true" />
        <h3>Aún no hay reseñas verificadas</h3>
        <p>
          Solo pueden opinar clientes con una reserva completada con {provider.name}. No publicamos reseñas inventadas ni pagadas.
        </p>
      </div>
    );
  }

  if (tab === "ubicacion") {
    return (
      <div className="tab-panel map-panel">
        <MapPin size={28} />
        <h3>{provider.address}</h3>
        <p>
          Zona de cobertura: {provider.department}, Guatemala. Si tu evento está fuera de esta zona, el proveedor indicará el costo de
          transporte en la cotización, antes de que pagues cualquier monto.
        </p>
      </div>
    );
  }

  return (
    <div className="tab-panel">
      <h2>Descripción</h2>
      <p>{provider.description}</p>
      <h3>Servicios destacados</h3>
      <div className="service-chips">
        {provider.services.slice(0, 6).map((service) => (
          <span key={service}>
            <ShieldCheck size={16} />
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}

function BookingPage({ route, navigate }) {
  const selectedProvider = providers.find((provider) => provider.id === route.providerId);
  const [form, setForm] = useState({
    eventType: route.draft?.eventType || "Boda",
    date: route.draft?.date || "",
    guests: route.draft?.guests || "",
    location: selectedProvider?.department || "Guatemala",
    budget: "",
    services: selectedProvider ? [selectedProvider.category] : ["salones"],
    providerId: selectedProvider?.id || "",
    payment: "reserva",
    shareConsent: false,
  });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  // Si llega desde "Solicitar cotización" con fecha e invitados, empieza en el paso 2.
  const detailsComplete = Boolean(form.date && Number(form.guests) > 0);
  const [step, setStep] = useState(route.step && detailsComplete ? route.step : 1);
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, done]);

  const recommended = useMemo(() => {
    const service = form.services[0] || "salones";
    return providers.filter((provider) => provider.category === service).slice(0, 4);
  }, [form.services]);

  const toggleService = (service) => {
    setForm((current) => ({
      ...current,
      services: current.services.includes(service) ? current.services.filter((item) => item !== service) : [...current.services, service],
    }));
  };

  const validateDetails = () => {
    const found = {};
    if (!form.date) found.date = "Elige la fecha del evento.";
    else if (form.date < todayISO()) found.date = "La fecha no puede estar en el pasado.";
    if (!(Number(form.guests) > 0)) found.guests = "Indica cuántos invitados esperas.";
    if (form.services.length === 0) found.services = "Elige al menos un servicio.";
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateDetails()) return;
    if (step === 3 && !form.shareConsent) {
      setErrors({ shareConsent: "Necesitamos tu autorización para enviar la solicitud al proveedor." });
      return;
    }
    setErrors({});
    setStep((value) => Math.min(value + 1, 4));
  };
  const back = () => setStep((value) => Math.max(value - 1, 1));
  const provider = providers.find((item) => item.id === form.providerId);

  return (
    <main className="booking-page" id="contenido">
      <button className="link-btn" onClick={() => navigate({ name: "home" })}>
        <ArrowLeft size={16} />
        Volver a explorar
      </button>
      <div className="booking-title">
        <div>
          <h1>Nueva solicitud de reserva</h1>
          <p>Cuéntanos los detalles de tu evento. No se cobra nada hasta que apruebes la cotización final.</p>
        </div>
        <ProgressSteps step={done ? 5 : step} />
      </div>
      <div className="booking-grid">
        <section className="booking-card" aria-labelledby="paso-titulo">
          {done ? (
            <BookingDone provider={provider} navigate={navigate} headingRef={headingRef} />
          ) : (
            <>
              {step === 1 && (
                <EventDetails form={form} setForm={setForm} toggleService={toggleService} next={next} errors={errors} headingRef={headingRef} />
              )}
              {step === 2 && (
                <ProviderSelect form={form} setForm={setForm} providers={recommended} next={next} back={back} headingRef={headingRef} />
              )}
              {step === 3 && (
                <Confirmation form={form} setForm={setForm} provider={provider} next={next} back={back} errors={errors} headingRef={headingRef} />
              )}
              {step === 4 && (
                <Payment form={form} setForm={setForm} provider={provider} back={back} finish={() => setDone(true)} headingRef={headingRef} />
              )}
            </>
          )}
        </section>
        <aside className="summary-card">
          <h2>Resumen</h2>
          <SummaryRow icon={Palette} label="Tipo de evento" value={form.eventType} />
          <SummaryRow icon={Calendar} label="Fecha del evento" value={form.date || "--"} />
          <SummaryRow icon={Users} label="Número de invitados" value={form.guests || "--"} />
          <SummaryRow icon={MapPin} label="Departamento" value={form.location || "--"} />
          <SummaryRow icon={Wallet} label="Presupuesto aproximado" value={form.budget ? formatCurrency(Number(form.budget)) : "Sin indicar"} />
          <SummaryRow icon={CheckCircle} label="Servicios necesarios" value={form.services.map(slugLabel).join(", ") || "--"} />
          <div className="secure-box">
            <LockKeyhole size={22} />
            <span>Tú controlas tus datos</span>
            <small>Solo enviamos tu solicitud al proveedor que elijas y autorices en el paso de confirmación.</small>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <small className="field-error" id={id} role="alert">
      {message}
    </small>
  );
}

function ProgressSteps({ step }) {
  const labels = ["Detalles del evento", "Seleccionar proveedor", "Confirmación", "Anticipo"];
  return (
    <ol className="progress-steps" aria-label="Progreso de la solicitud">
      {labels.map((label, index) => (
        <li key={label} className={step >= index + 1 ? "active" : ""} aria-current={step === index + 1 ? "step" : undefined}>
          <span aria-hidden="true">{index + 1}</span>
          <small>{label}</small>
        </li>
      ))}
    </ol>
  );
}

function EventDetails({ form, setForm, toggleService, next, errors, headingRef }) {
  return (
    <div>
      <h2 id="paso-titulo" tabIndex={-1} ref={headingRef}>
        Detalles del evento
      </h2>
      <p>Los campos con * son obligatorios.</p>
      <div className="form-grid">
        <label>
          <span>Tipo de evento *</span>
          <select value={form.eventType} onChange={(event) => setForm({ ...form, eventType: event.target.value })}>
            {eventTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Fecha del evento *</span>
          <input
            type="date"
            min={todayISO()}
            value={form.date}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "error-fecha" : undefined}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
          <FieldError id="error-fecha" message={errors.date} />
        </label>
        <label>
          <span>Número de invitados *</span>
          <input
            inputMode="numeric"
            placeholder="Ej. 150"
            value={form.guests}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? "error-invitados" : undefined}
            onChange={(event) => setForm({ ...form, guests: event.target.value.replace(/\D/g, "").slice(0, 4) })}
          />
          <FieldError id="error-invitados" message={errors.guests} />
        </label>
        <label>
          <span>Departamento del evento *</span>
          <select value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })}>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </label>
        <label className="wide">
          <span>Presupuesto aproximado en quetzales (opcional)</span>
          <input
            inputMode="numeric"
            placeholder="Ayuda al proveedor a ajustar su propuesta"
            value={form.budget}
            onChange={(event) => setForm({ ...form, budget: event.target.value.replace(/\D/g, "").slice(0, 7) })}
          />
        </label>
      </div>
      <h3 id="servicios-titulo">Servicios necesarios *</h3>
      <div className="service-select" role="group" aria-labelledby="servicios-titulo">
        {categories.map((category) => (
          <button
            key={category.id}
            className={form.services.includes(category.id) ? "active" : ""}
            aria-pressed={form.services.includes(category.id)}
            onClick={() => toggleService(category.id)}
            type="button"
          >
            <span aria-hidden="true">{form.services.includes(category.id) && <CheckCircle size={15} />}</span>
            <CategoryIcon categoryId={category.id} />
            {category.label}
          </button>
        ))}
      </div>
      <FieldError id="error-servicios" message={errors.services} />
      <div className="booking-actions">
        <button className="btn primary" onClick={next}>
          Siguiente
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ProviderSelect({ form, setForm, providers: suggestedProviders, next, back, headingRef }) {
  const options = suggestedProviders.some((provider) => provider.id === form.providerId)
    ? suggestedProviders
    : [providers.find((provider) => provider.id === form.providerId), ...suggestedProviders].filter(Boolean).slice(0, 4);

  return (
    <div>
      <h2 id="paso-titulo" tabIndex={-1} ref={headingRef}>
        Seleccionar proveedor
      </h2>
      <p>Estas opciones coinciden con el servicio principal de tu solicitud.</p>
      <div className="select-provider-list">
        {options.map((provider) => (
          <button
            type="button"
            className={form.providerId === provider.id ? "provider-option active" : "provider-option"}
            aria-pressed={form.providerId === provider.id}
            key={provider.id}
            onClick={() => setForm({ ...form, providerId: provider.id })}
          >
            <img src={provider.image} alt="" />
            <span>
              <strong>{provider.name}</strong>
              <small>{provider.location} · {formatCurrency(provider.price)}</small>
            </span>
            {form.providerId === provider.id && <CheckCircle size={22} />}
          </button>
        ))}
      </div>
      <div className="booking-actions split">
        <button className="btn secondary" onClick={back}>
          Atrás
        </button>
        <button className="btn primary" onClick={next} disabled={!form.providerId}>
          Siguiente
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Confirmation({ form, setForm, provider, next, back, errors, headingRef }) {
  return (
    <div className="confirmation">
      <h2 id="paso-titulo" tabIndex={-1} ref={headingRef}>
        Confirmación
      </h2>
      <p>Revisa tu solicitud antes de enviarla.</p>
      <div className="confirm-box">
        <SummaryRow icon={Palette} label="Evento" value={form.eventType} />
        <SummaryRow icon={Calendar} label="Fecha" value={form.date} />
        <SummaryRow icon={Users} label="Invitados" value={form.guests} />
        <SummaryRow icon={Building2} label="Proveedor" value={provider?.name || "Sin proveedor"} />
        <SummaryRow icon={Wallet} label="Presupuesto" value={form.budget ? formatCurrency(Number(form.budget)) : "Sin indicar"} />
      </div>
      <label className="consent-check">
        <input
          type="checkbox"
          checked={form.shareConsent}
          aria-invalid={Boolean(errors.shareConsent)}
          aria-describedby={errors.shareConsent ? "error-consentimiento" : undefined}
          onChange={(event) => setForm({ ...form, shareConsent: event.target.checked })}
        />
        <span>
          Autorizo enviar estos datos del evento a <strong>{provider?.name || "el proveedor elegido"}</strong> para recibir una cotización,
          según la <a href="#/legal?page=privacidad">Política de privacidad</a>.
        </span>
      </label>
      <FieldError id="error-consentimiento" message={errors.shareConsent} />
      <div className="booking-actions split">
        <button className="btn secondary" onClick={back}>
          Atrás
        </button>
        <button className="btn primary" onClick={next}>
          Confirmar
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

const DEPOSIT_RATE = 0.3;

function Payment({ form, setForm, provider, back, finish, headingRef }) {
  const base = provider?.price ?? 0;
  const deposit = Math.round(base * DEPOSIT_RATE);
  const dueNow = form.payment === "reserva" ? deposit : base;

  return (
    <div className="payment">
      <h2 id="paso-titulo" tabIndex={-1} ref={headingRef}>
        Anticipo y desglose
      </h2>
      {business.demoMode && <p className="demo-inline">Modo demostración: no se procesa ningún pago real.</p>}
      <div className="payment-options" role="radiogroup" aria-label="Forma de pago">
        {[
          ["reserva", `Anticipo del ${DEPOSIT_RATE * 100} %`],
          ["total", "Pagar el total"],
        ].map(([option, label]) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={form.payment === option}
            className={form.payment === option ? "active" : ""}
            onClick={() => setForm({ ...form, payment: option })}
          >
            <CreditCard size={20} />
            {label}
          </button>
        ))}
      </div>
      <dl className="price-breakdown">
        <div>
          <dt>Precio referencial de {provider?.name}</dt>
          <dd>{formatCurrency(base)}</dd>
        </div>
        <div>
          <dt>Comisión de la plataforma</dt>
          <dd>{formatCurrency(0)}</dd>
        </div>
        <div>
          <dt>Transporte fuera de {provider?.department}</dt>
          <dd>Se cotiza aparte; nunca se cobra sin tu aprobación</dd>
        </div>
        <div className="total">
          <dt>{form.payment === "reserva" ? "Pagarías hoy (anticipo)" : "Pagarías hoy"}</dt>
          <dd>{formatCurrency(dueNow)}</dd>
        </div>
      </dl>
      <p className="fine-print">
        El proveedor confirmará el total final con impuestos antes de cualquier cobro. Consulta la{" "}
        <a href="#/legal?page=reembolsos">Política de reembolsos y cancelaciones</a>.
      </p>
      <div className="security-notice">
        <LockKeyhole size={22} />
        <p>No guardamos datos de tarjeta. Los pagos se procesarán con un proveedor certificado PCI DSS.</p>
      </div>
      <div className="booking-actions split">
        <button className="btn secondary" onClick={back}>
          Atrás
        </button>
        <button className="btn primary" onClick={finish}>
          Enviar solicitud
          <CheckCircle size={16} />
        </button>
      </div>
    </div>
  );
}

function BookingDone({ provider, navigate, headingRef }) {
  return (
    <div className="booking-done">
      <CheckCircle size={44} aria-hidden="true" />
      <h2 id="paso-titulo" tabIndex={-1} ref={headingRef}>
        Solicitud lista
      </h2>
      {business.demoMode ? (
        <p>
          Este es un proyecto de demostración: la solicitud a {provider?.name} no se envió ni se guardó, y no se cobró nada. Con la base de
          datos conectada, aquí verías el número de solicitud y el proveedor respondería en tu panel.
        </p>
      ) : (
        <p>Enviamos tu solicitud a {provider?.name}. Te avisaremos cuando responda con la cotización final.</p>
      )}
      <button className="btn primary" onClick={() => navigate({ name: "home" })}>
        Volver al inicio
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="summary-row">
      <span>
        <Icon size={17} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function DashboardPage({ route, navigate, favorites, toggleFavorite, currentUser, setCurrentUser, onLogout }) {
  const tab = route.tab || "cotizaciones";
  const setTab = (nextTab) => navigate({ name: "dashboard", tab: nextTab });
  const favoriteProviders = providers.filter((provider) => favorites.includes(provider.id));

  const renderPanel = () => {
    if (tab === "reservas") return <ReservationPanel />;
    if (tab === "favoritos") return <FavoritesPanel providers={favoriteProviders} navigate={navigate} toggleFavorite={toggleFavorite} />;
    if (tab === "mensajes") return <MessagesPanel />;
    if (tab === "perfil") return <ProfilePanel currentUser={currentUser} />;
    if (tab === "configuracion") return <SettingsPanel currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={onLogout} />;
    if (tab === "buscar") return <SearchPanel navigate={navigate} />;
    if (tab === "inicio") return <DashboardHome navigate={navigate} favoritesCount={favorites.length} />;
    return <QuotesPanel navigate={navigate} />;
  };

  return (
    <main className="dashboard" id="contenido">
      <aside className="sidebar">
        <Logo />
        <nav aria-label="Panel de usuario">
          {dashboardItems.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "active" : ""}
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
            >
              <item.icon size={19} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="support-box">
          <ShieldCheck size={26} />
          <strong>¿Necesitas ayuda?</strong>
          <small>Nuestro equipo está listo para ayudarte.</small>
          <button className="btn outlined" onClick={() => setTab("mensajes")}>
            Contactar soporte
          </button>
        </div>
      </aside>
      <section className="dashboard-content">
        <div className="dash-top">
          <button className="link-btn" onClick={() => navigate({ name: "home" })}>
            <ArrowLeft size={16} />
            Volver al sitio
          </button>
          <div className="dash-icons">
            <span className="avatar" aria-hidden="true">
              {initials(currentUser.name)}
            </span>
            <strong>{currentUser.name}</strong>
            <button className="btn secondary" onClick={onLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
        {renderPanel()}
      </section>
    </main>
  );
}

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function DemoDataNote() {
  return (
    <p className="demo-inline">
      <Info size={16} aria-hidden="true" /> Datos de ejemplo: esta sección se llenará con tu información cuando la base de datos de cotizaciones y
      reservas esté conectada.
    </p>
  );
}

function QuotesPanel({ navigate }) {
  return (
    <div>
      <PanelTitle title="Mis cotizaciones" subtitle="Cotizaciones que has pedido a proveedores." />
      <DemoDataNote />
      <div className="quote-list">
        {quotes.slice(0, 8).map((quote) => (
          <article className="quote-row" key={quote.id}>
            <img src={quote.image} alt="" />
            <div>
              <h3>{quote.providerName}</h3>
              <p>Cotización #{quote.id}</p>
              <small>
                <MapPin size={14} />
                {quote.location}
              </small>
            </div>
            <div>
              <small>Enviada el</small>
              <span>{quote.sentAt}</span>
              <span>{quote.time}</span>
            </div>
            <span className={quote.status === "Pendiente" ? "status pending" : "status ok"}>{quote.status}</span>
            <div className="quote-total">
              <small>Total</small>
              <strong>{formatCurrency(quote.total)}</strong>
              <button className="btn primary" onClick={() => navigate({ name: "detail", providerId: quote.providerId })}>
                Ver detalle
                <ArrowRight size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ReservationPanel() {
  return (
    <div>
      <PanelTitle title="Mis reservas" subtitle="Reservas activas y solicitudes en seguimiento." />
      <DemoDataNote />
      <div className="table-panel">
        {reservations.map((reservation) => (
          <article key={reservation.id}>
            <div>
              <strong>{reservation.providerName}</strong>
              <small>Reserva #{reservation.id}</small>
            </div>
            <span>{reservation.type}</span>
            <span>{reservation.date}</span>
            <strong>{formatCurrency(reservation.total)}</strong>
            <span className={reservation.status === "Confirmada" ? "status ok" : "status pending"}>{reservation.status}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function FavoritesPanel({ providers: favoriteProviders, navigate, toggleFavorite }) {
  return (
    <div>
      <PanelTitle title="Favoritos" subtitle="Proveedores guardados para revisar después." />
      {favoriteProviders.length === 0 ? (
        <div className="empty-state">
          <Heart size={42} />
          <h2>Aún no tienes favoritos</h2>
          <p>Guarda proveedores desde resultados o detalle.</p>
        </div>
      ) : (
        <div className="featured-grid">
          {favoriteProviders.map((provider) => (
            <ProviderTile key={provider.id} provider={provider} navigate={navigate} favorite onFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesPanel() {
  return (
    <div>
      <PanelTitle title="Mensajes" subtitle="Conversaciones con proveedores y soporte." />
      <div className="empty-state">
        <MessageCircle size={42} aria-hidden="true" />
        <h2>Aún no tienes mensajes</h2>
        <p>Cuando un proveedor responda a tu solicitud, la conversación aparecerá aquí.</p>
      </div>
    </div>
  );
}

function ProfilePanel({ currentUser }) {
  return (
    <div>
      <PanelTitle title="Perfil" subtitle="Datos de tu cuenta." />
      <div className="profile-card">
        <span className="avatar large" aria-hidden="true">
          {initials(currentUser.name)}
        </span>
        <div>
          <h2>{currentUser.name}</h2>
          <p>{currentUser.email}</p>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ currentUser, setCurrentUser, onLogout }) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const toggleMarketing = async (event) => {
    const marketingOptIn = event.target.checked;
    setSaving(true);
    setStatus("");
    try {
      const result = await updatePreferences({ marketingOptIn });
      setCurrentUser(result.user);
      setStatus(marketingOptIn ? "Listo: recibirás correos promocionales." : "Listo: te diste de baja de los correos promocionales.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  const submitDelete = async (event) => {
    event.preventDefault();
    setDeleteError("");
    try {
      await deleteAccount({ password });
      onLogout();
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  return (
    <div>
      <PanelTitle title="Configuración" subtitle="Privacidad, correos y tu cuenta." />
      <div className="settings-list">
        <label>
          <span>
            Recibir correos promocionales
            <small>Ofertas e ideas para eventos. Puedes darte de baja cuando quieras.</small>
          </span>
          <input type="checkbox" checked={Boolean(currentUser.marketingOptIn)} disabled={saving} onChange={toggleMarketing} />
        </label>
      </div>
      <p className="form-status" role="status">
        {status}
      </p>
      <section className="danger-zone" aria-labelledby="eliminar-titulo">
        <h2 id="eliminar-titulo">Eliminar mi cuenta</h2>
        <p>
          Se borran tu cuenta, tus preferencias y tus favoritos de forma permanente. Más detalles en{" "}
          <a href="#/legal?page=eliminar-datos">Eliminación de datos</a>.
        </p>
        {confirmDelete ? (
          <form onSubmit={submitDelete}>
            <label>
              <span>Escribe tu contraseña para confirmar</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength="8"
                autoComplete="current-password"
                required
              />
            </label>
            {deleteError && (
              <div className="form-error" role="alert">
                {deleteError}
              </div>
            )}
            <div className="booking-actions split">
              <button type="button" className="btn secondary" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn danger">
                <Trash2 size={16} />
                Eliminar definitivamente
              </button>
            </div>
          </form>
        ) : (
          <button className="btn danger-outline" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} />
            Eliminar mi cuenta
          </button>
        )}
      </section>
    </div>
  );
}

function SearchPanel({ navigate }) {
  return (
    <div>
      <PanelTitle title="Buscar proveedores" subtitle="Accesos rápidos por categoría." />
      <div className="category-grid dashboard-cats">
        {categories.map((category) => (
          <button key={category.id} className="category-card" onClick={() => navigate({ name: "results", category: category.id })}>
            <span className="category-icon">
              <CategoryIcon categoryId={category.id} />
            </span>
            <strong>{category.label}</strong>
            <small>{providers.filter((provider) => provider.category === category.id).length} proveedores</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardHome({ navigate, favoritesCount }) {
  return (
    <div>
      <PanelTitle title="Inicio" subtitle="Resumen rápido de tu actividad." />
      <DemoDataNote />
      <div className="stats-grid">
        {[
          ["Cotizaciones (ejemplo)", String(quotes.length)],
          ["Reservas (ejemplo)", String(reservations.length)],
          ["Favoritos", String(favoritesCount)],
          ["Mensajes", "0"],
        ].map(([label, value]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
      <button className="btn primary" onClick={() => navigate({ name: "booking", step: 1 })}>
        Crear nueva reserva
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function PanelTitle({ title, subtitle }) {
  return (
    <div className="panel-title">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function InfoPage({ route, navigate }) {
  const section = route.section || "como-funciona";
  const content = {
    "como-funciona": {
      title: "Cómo funciona",
      subtitle: "Un flujo simple para pedir propuestas, comparar y reservar sin sorpresas.",
      cards: [
        ["Explora", "Filtra proveedores por categoría, departamento, tipo de evento y precio."],
        ["Cotiza gratis", "Envía una solicitud con fecha, invitados y servicios. Tú eliges a qué proveedor se envían tus datos."],
        ["Reserva con reglas claras", "Ves el desglose y la política de cancelación antes de pagar el anticipo del 30 %."],
      ],
    },
    blog: {
      title: "Blog",
      subtitle: "Guías para planificar tu evento.",
      cards: [
        ["Checklist para bodas", "Los puntos clave para coordinar salón, catering, fotos y sonido."],
        ["Tendencias de decoración", "Texturas naturales, luz cálida y rincones lounge para fotos."],
        ["Cómo comparar cotizaciones", "Qué revisar en cada paquete para comparar precios de forma justa."],
      ],
    },
    contacto: {
      title: "Contacto",
      subtitle: `Escríbenos para soporte, dudas sobre una reserva o temas de privacidad.`,
      cards: [
        ["Correo", business.email],
        ["Teléfono", business.phone],
        ["Horario", business.hours],
      ],
    },
  }[section];

  if (!content) return <InfoPage route={{ section: "como-funciona" }} navigate={navigate} />;

  return (
    <main className="info-page" id="contenido">
      <section>
        <span className="eyebrow">Vibe Events</span>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
        <div className="info-grid">
          {content.cards.map(([title, text], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
        {section === "contacto" && <BusinessCard />}
        <button className="btn primary" onClick={() => navigate({ name: "booking", step: 1 })}>
          Crear reserva
          <ArrowRight size={16} />
        </button>
      </section>
    </main>
  );
}

function BusinessCard() {
  const rows = [
    ["Razón social", business.legalName],
    ["NIT", business.taxId],
    ["Dirección", business.address],
    ["Correo", business.email],
    ["Teléfono", business.phone],
    ["Horario", business.hours],
  ];
  return (
    <dl className="business-card">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd className={isPending(value) ? "pending" : ""}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AuthModal({ mode, onClose, onSuccess }) {
  const [activeMode, setActiveMode] = useState(mode || "login");
  const [form, setForm] = useState({ name: "", email: "", password: "", acceptedTerms: false, isAdult: false, marketingOptIn: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    setActiveMode(mode || "login");
    setError("");
  }, [mode]);

  // Foco dentro del diálogo, Escape para cerrar y Tab sin salir del modal.
  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.querySelector("input")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = [...dialogRef.current.querySelectorAll("button, input, a[href]")].filter((el) => !el.disabled);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        email: sanitize(form.email).toLowerCase(),
        password: form.password,
        ...(activeMode === "register"
          ? {
              name: sanitize(form.name),
              acceptedTerms: form.acceptedTerms,
              isAdult: form.isAdult,
              marketingOptIn: form.marketingOptIn,
              termsVersion: legalVersion,
            }
          : {}),
      };
      const result = activeMode === "register" ? await registerUser(payload) : await loginUser(payload);
      localStorage.setItem("vibe:token", result.token);
      onSuccess(result.user);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="ghost icon-only modal-close" aria-label="Cerrar" onClick={onClose}>
          <X size={20} />
        </button>
        <Logo compact />
        <h2 id="auth-title">{activeMode === "register" ? "Crear cuenta" : "Iniciar sesión"}</h2>
        <p>
          {activeMode === "register"
            ? "Regístrate para guardar cotizaciones, favoritos y reservas."
            : "Entra con tu cuenta para continuar con tus cotizaciones."}
        </p>
        <form onSubmit={submit}>
          {activeMode === "register" && (
            <label>
              <span>Nombre completo</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                minLength="2"
                maxLength="80"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label>
            <span>Correo electrónico</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              maxLength="120"
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength="8"
              maxLength="128"
              autoComplete={activeMode === "register" ? "new-password" : "current-password"}
              required
            />
            {activeMode === "register" && <small className="hint">Mínimo 8 caracteres.</small>}
          </label>
          {activeMode === "register" && (
            <div className="consent-group">
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(event) => setForm({ ...form, acceptedTerms: event.target.checked })}
                  required
                />
                <span>
                  Acepto los{" "}
                  <a href="#/legal?page=terminos" target="_blank" rel="noreferrer">
                    Términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#/legal?page=privacidad" target="_blank" rel="noreferrer">
                    Política de privacidad
                  </a>
                  . *
                </span>
              </label>
              <label className="consent-check">
                <input type="checkbox" checked={form.isAdult} onChange={(event) => setForm({ ...form, isAdult: event.target.checked })} required />
                <span>Confirmo que tengo 18 años o más. Si eres menor, pide a tu madre, padre o tutor que cree la cuenta. *</span>
              </label>
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={form.marketingOptIn}
                  onChange={(event) => setForm({ ...form, marketingOptIn: event.target.checked })}
                />
                <span>Quiero recibir ofertas e ideas por correo (opcional, puedo darme de baja cuando quiera).</span>
              </label>
            </div>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? "Procesando..." : activeMode === "register" ? "Crear cuenta" : "Entrar"}
            <ArrowRight size={16} />
          </button>
        </form>
        <button className="switch-auth" onClick={() => setActiveMode(activeMode === "register" ? "login" : "register")}>
          {activeMode === "register" ? "Ya tengo cuenta" : "Crear una cuenta nueva"}
        </button>
      </section>
    </div>
  );
}

function CookieBanner({ onDecide }) {
  const [custom, setCustom] = useState(false);
  const [preferences, setPreferences] = useState(false);

  return (
    <section className="cookie-banner" role="region" aria-labelledby="cookies-titulo">
      <div>
        <h2 id="cookies-titulo">Tu privacidad</h2>
        <p>
          Usamos almacenamiento necesario para tu sesión. Con tu permiso, también recordamos tus favoritos en este navegador. No usamos
          analítica ni publicidad. <a href="#/legal?page=cookies">Política de cookies</a>
        </p>
        {custom && (
          <label className="consent-check">
            <input type="checkbox" checked={preferences} onChange={(event) => setPreferences(event.target.checked)} />
            <span>Preferencias: recordar mis favoritos</span>
          </label>
        )}
      </div>
      <div className="cookie-actions">
        {/* Aceptar y rechazar tienen el mismo peso visual para no inducir la decisión. */}
        <button className="btn secondary" onClick={() => onDecide({ preferences: false })}>
          Rechazar opcionales
        </button>
        {custom ? (
          <button className="btn secondary" onClick={() => onDecide({ preferences })}>
            Guardar selección
          </button>
        ) : (
          <button className="btn secondary" onClick={() => setCustom(true)}>
            Configurar
          </button>
        )}
        <button className="btn secondary" onClick={() => onDecide({ preferences: true })}>
          Aceptar todo
        </button>
      </div>
    </section>
  );
}

function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <Info size={16} aria-hidden="true" />
      <span>
        Proyecto de demostración: proveedores, precios y reservas son ficticios y no se procesan pagos reales.
      </span>
    </div>
  );
}

function Footer({ navigate, openCookieSettings }) {
  const legalLink = (page) => (
    <button key={page} onClick={() => navigate({ name: "legal", page })}>
      {legalPages[page].title}
    </button>
  );

  return (
    <footer className="footer">
      <div>
        <Logo compact />
        <p>Marketplace para cotizar, comparar y reservar proveedores de eventos en Guatemala.</p>
        <address className="footer-business">
          {business.legalName}
          <br />
          NIT {business.taxId}
          <br />
          {business.address}
          <br />
          {business.email} · {business.phone}
        </address>
      </div>
      <div>
        <strong>Explorar</strong>
        {categories.map((category) => (
          <button key={category.id} onClick={() => navigate({ name: "results", category: category.id })}>
            {category.label}
          </button>
        ))}
      </div>
      <div>
        <strong>Compañía</strong>
        <button onClick={() => navigate({ name: "info", section: "como-funciona" })}>Cómo funciona</button>
        <button onClick={() => navigate({ name: "info", section: "blog" })}>Blog</button>
        <button onClick={() => navigate({ name: "info", section: "contacto" })}>Contacto</button>
      </div>
      <div>
        <strong>Legal</strong>
        {["privacidad", "terminos", "reembolsos", "cookies"].map(legalLink)}
        <button onClick={openCookieSettings}>Preferencias de cookies</button>
      </div>
      <div>
        <strong>Tus datos</strong>
        {["baja", "eliminar-datos", "creditos"].map(legalLink)}
      </div>
      <p className="footer-bottom">
        © {new Date().getFullYear()} {business.brand}. Fotos de referencia: Unsplash.
      </p>
    </footer>
  );
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("vibe:favorites") || "[]");
    return Array.isArray(saved) ? saved.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [route, setRoute] = useState(() => hashToRoute(window.location.hash));
  const [authModal, setAuthModal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [consent, setConsent] = useState(() => readConsent());
  const [showCookieBanner, setShowCookieBanner] = useState(() => !readConsent());
  const [favorites, setFavorites] = useState(() => (readConsent()?.preferences ? readFavorites() : []));
  const [pendingRoute, setPendingRoute] = useState(null);

  const navigate = (nextRoute) => {
    setRoute(nextRoute);
    const hash = routeToHash(nextRoute);
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const openDashboard = (tab = "cotizaciones") => {
    if (!currentUser) {
      setPendingRoute({ name: "dashboard", tab });
      setAuthModal("login");
      return;
    }
    navigate({ name: "dashboard", tab });
  };

  const logout = () => {
    localStorage.removeItem("vibe:token");
    setCurrentUser(null);
    navigate({ name: "home" });
  };

  // Atrás/Adelante del navegador y enlaces <a href="#/..."> internos.
  useEffect(() => {
    const sync = () => setRoute(hashToRoute(window.location.hash));
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  useEffect(() => {
    const goHome = () => navigate({ name: "home" });
    window.addEventListener("navigate-home", goHome);
    return () => window.removeEventListener("navigate-home", goHome);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("vibe:token")) return;

    getCurrentUser()
      .then((result) => setCurrentUser(result.user))
      .catch(() => {
        localStorage.removeItem("vibe:token");
        setCurrentUser(null);
      });
  }, []);

  // Los favoritos solo se guardan en el navegador si se aceptaron las cookies de preferencias.
  useEffect(() => {
    if (!consent?.preferences) return;
    try {
      localStorage.setItem("vibe:favorites", JSON.stringify(favorites));
    } catch {
      // Almacenamiento no disponible: los favoritos quedan en memoria.
    }
  }, [favorites, consent]);

  useEffect(() => {
    const titles = {
      results: "Proveedores",
      detail: providers.find((provider) => provider.id === route.providerId)?.name,
      booking: "Nueva solicitud",
      dashboard: "Mi panel",
      info: "Información",
      legal: legalPages[route.page]?.title,
    };
    document.title = titles[route.name] ? `${titles[route.name]} | ${business.brand}` : `${business.brand} | Proveedores para eventos en Guatemala`;
  }, [route]);

  const decideCookies = (choice) => {
    setConsent(saveConsent(choice));
    setShowCookieBanner(false);
  };

  const toggleFavorite = (providerId) => {
    setFavorites((current) => (current.includes(providerId) ? current.filter((id) => id !== providerId) : [...current, providerId]));
  };

  // El panel exige sesión; sin ella se muestra el inicio de sesión.
  const needsLogin = route.name === "dashboard" && !currentUser;

  const page = (() => {
    if (route.name === "results") return <ResultsPage route={{ category: "salones", ...route }} navigate={navigate} favorites={favorites} toggleFavorite={toggleFavorite} />;
    if (route.name === "detail") return <DetailPage route={route} navigate={navigate} favorites={favorites} toggleFavorite={toggleFavorite} />;
    if (route.name === "booking") return <BookingPage route={route} navigate={navigate} />;
    if (route.name === "dashboard" && !needsLogin) {
      return (
        <DashboardPage
          route={route}
          navigate={navigate}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onLogout={logout}
        />
      );
    }
    if (route.name === "info") return <InfoPage route={route} navigate={navigate} />;
    if (route.name === "legal") return <LegalPage slug={route.page} navigate={navigate} />;
    return <HomePage navigate={navigate} />;
  })();

  const showChrome = route.name !== "dashboard" || needsLogin;

  return (
    <div className="app">
      <a
        className="skip-link"
        href="#contenido"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("contenido");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
        }}
      >
        Saltar al contenido
      </a>
      {business.demoMode && <DemoBanner />}
      {showChrome && (
        <Header
          navigate={navigate}
          openDashboard={() => openDashboard("cotizaciones")}
          openAuth={(mode) => setAuthModal(mode)}
          currentUser={currentUser}
          onLogout={logout}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={routeToHash(route)}
          initial={prefersReducedMotion() ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion() ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {needsLogin ? <HomePage navigate={navigate} /> : page}
        </motion.div>
      </AnimatePresence>
      {(authModal || needsLogin) && (
        <AuthModal
          mode={authModal || "login"}
          onClose={() => {
            setAuthModal(null);
            setPendingRoute(null);
            if (needsLogin) navigate({ name: "home" });
          }}
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthModal(null);
            navigate(pendingRoute || (needsLogin ? route : { name: "dashboard", tab: "cotizaciones" }));
            setPendingRoute(null);
          }}
        />
      )}
      {showChrome && <Footer navigate={navigate} openCookieSettings={() => setShowCookieBanner(true)} />}
      {showCookieBanner && <CookieBanner onDecide={decideCookies} />}
    </div>
  );
}
