import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Bookmark,
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
  Image as ImageIcon,
  LockKeyhole,
  LogIn,
  Mail,
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
import { getCurrentUser, loginUser, registerUser } from "./api.js";

const minEventDate = "2026-05-21";

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
  { id: "mensajes", label: "Mensajes", icon: MessageCircle, badge: 2 },
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

function Header({ navigate, currentView, openDashboard, openAuth }) {
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
        {currentView.name !== "dashboard" && (
          <>
            <button className="ghost icon-only" aria-label="Buscar" onClick={() => navigate({ name: "results", category: "salones" })}>
              <Search size={18} />
            </button>
            <button className="ghost icon-only" aria-label="Notificaciones" onClick={openDashboard}>
              <Bell size={18} />
            </button>
          </>
        )}
        <button className="btn secondary login-btn" onClick={() => openAuth("login")}>
          <LogIn size={16} />
          Iniciar sesión
        </button>
        <button className="btn primary register-btn" onClick={() => openAuth("register")}>
          <UserPlus size={16} />
          Registrarse
        </button>
        <button className="ghost icon-only menu-toggle" aria-label="Menú" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
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
    renderer.domElement.setAttribute("aria-label", "Escena 3D decorativa de Vibe Events");
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

    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
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
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
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
    location: "Guatemala",
    date: "",
  });

  const submit = (event) => {
    event.preventDefault();
    onSearch({
      category: sanitize(form.category) || "salones",
      location: sanitize(form.location) || "Guatemala",
      date: sanitize(form.date),
    });
  };

  return (
    <section className="hero">
      <div className="hero-media">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=85"
          alt="Recepción nocturna al aire libre con luces cálidas"
        />
        <div className="hero-shade" />
        <ThreeScene />
      </div>
      <div className="hero-content">
        <span className="pill location-pill">
          <MapPin size={15} /> Guatemala
        </span>
        <h1>Tu evento empieza aquí</h1>
        <p>Cotiza, compara y reserva proveedores verificados para eventos inolvidables en toda Guatemala.</p>
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
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Fecha del evento</span>
            <input
              type="date"
              min={minEventDate}
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <button className="btn primary search-btn" type="submit">
            <Search size={18} />
            Buscar proveedores
          </button>
        </form>
        <div className="popular-searches">
          {["Salones en Antigua", "Catering para bodas", "Fotógrafos en Ciudad de Guatemala", "Sonido e iluminación"].map((label, index) => (
            <button
              key={label}
              onClick={() => navigate({ name: "results", category: categories[index % categories.length].id, query: label })}
            >
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
            <img src={providers.find((provider) => provider.category === category.id)?.image} alt={category.label} />
            <span className="category-icon" style={{ color: category.accent }}>
              <CategoryIcon categoryId={category.id} size={24} />
            </span>
            <strong>{category.label}</strong>
            <small>{category.hint}</small>
          </button>
        ))}
        <button className="category-card more-card" onClick={() => navigate({ name: "results", category: "salones", query: "todos" })}>
          <span className="more-dots">...</span>
          <strong>Más categorías</strong>
          <small>Descubre más opciones</small>
        </button>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, title: "Proveedores verificados", text: "Trabajamos solo con proveedores calificados." },
    { icon: Wallet, title: "Compara y ahorra", text: "Recibe varias cotizaciones y elige mejor." },
    { icon: LockKeyhole, title: "Reserva con confianza", text: "Tus datos y solicitudes viajan protegidos." },
    { icon: MessageCircle, title: "Soporte en cada paso", text: "Te acompañamos antes, durante y después." },
  ];

  return (
    <section className="trust-bar" aria-label="Beneficios de seguridad y confianza">
      {items.map((item) => (
        <article key={item.title}>
          <span>
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

function HomePage({ navigate }) {
  return (
    <main>
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
      <img src={provider.image} alt={provider.name} loading="lazy" />
      <div className="provider-tile-body">
        <div className="provider-row">
          <span className="mini-category">
            <CategoryIcon categoryId={provider.category} size={15} />
            {provider.categoryLabel}
          </span>
          {provider.verified && <BadgeCheck className="verified" size={18} />}
        </div>
        <h3>{provider.name}</h3>
        <p>
          <MapPin size={14} />
          {provider.location}
        </p>
        <div className="provider-meta">
          <span>
            <Star size={14} fill="currentColor" />
            {provider.rating}
          </span>
          <span>Desde {formatCurrency(provider.price)}</span>
        </div>
        <div className="provider-actions">
          <button className="btn primary" onClick={() => navigate({ name: "detail", providerId: provider.id })}>
            Ver detalles
          </button>
          {onFavorite && (
            <button className="btn secondary icon-label" onClick={() => onFavorite(provider.id)}>
              <Heart size={16} fill={favorite ? "currentColor" : "none"} />
              Guardar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function FilterPanel({ filters, setFilters, applyFilters }) {
  return (
    <aside className="filter-panel">
      <div className="filter-head">
        <strong>Filtrar resultados</strong>
        <button onClick={() => setFilters({ location: "Guatemala", eventType: "Todos", min: 1000, max: 50000, rating: 0 })}>
          Limpiar filtros
        </button>
      </div>
      <label>
        <span>
          <MapPin size={15} />
          Ubicación
        </span>
        <select value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })}>
          <option>Todos</option>
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
          Rango de precio
        </span>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={filters.max}
          onChange={(event) => setFilters({ ...filters, max: Number(event.target.value) })}
        />
        <small>Hasta {formatCurrency(filters.max)}</small>
      </label>
      <label>
        <span>
          <Star size={15} />
          Calificación mínima
        </span>
        <div className="rating-filter">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={filters.rating === rating ? "active" : ""}
              onClick={() => setFilters({ ...filters, rating })}
              type="button"
            >
              {rating === 0 ? "Todas" : `${rating}+`}
            </button>
          ))}
        </div>
      </label>
      <button className="btn outlined full" onClick={applyFilters}>
        Aplicar filtros
      </button>
    </aside>
  );
}

function ResultsPage({ route, navigate, favorites, toggleFavorite }) {
  const [filters, setFilters] = useState({
    location: route.location || "Guatemala",
    eventType: "Todos",
    min: 1000,
    max: 50000,
    rating: 0,
  });
  const [sort, setSort] = useState("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    setAppliedFilters((current) => ({ ...current, location: route.location || current.location || "Guatemala" }));
  }, [route.location]);

  const listed = useMemo(() => {
    const base = providers
      .filter((provider) => provider.category === route.category)
      .filter(
        (provider) =>
          appliedFilters.location === "Todos" ||
          appliedFilters.location === "Guatemala" ||
          provider.department === appliedFilters.location ||
          provider.location.includes(appliedFilters.location),
      )
      .filter((provider) => appliedFilters.eventType === "Todos" || provider.tags.includes(appliedFilters.eventType))
      .filter((provider) => provider.price >= appliedFilters.min && provider.price <= appliedFilters.max)
      .filter((provider) => provider.rating >= appliedFilters.rating);

    return [...base].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      return Number(b.featured) - Number(a.featured) || b.reviews - a.reviews;
    });
  }, [appliedFilters, route.category, sort]);

  return (
    <main className="results-layout">
      <div className="breadcrumb">
        <Home size={15} /> Inicio <span>/</span> Resultados de búsqueda
      </div>
      <div className="results-grid">
        <div className={`filters-shell ${mobileFilters ? "open" : ""}`}>
          <FilterPanel filters={filters} setFilters={setFilters} applyFilters={() => setAppliedFilters(filters)} />
        </div>
        <section className="results-panel">
          <div className="results-title">
            <div>
              <span className="eyebrow">Catálogo de proveedores</span>
              <h1>Resultados para "{slugLabel(route.category)} en Guatemala"</h1>
              <p>{listed.length} proveedores encontrados de 20 disponibles en esta categoría.</p>
            </div>
            <div className="sort-row">
              <button className="btn secondary mobile-filter-btn" onClick={() => setMobileFilters((value) => !value)}>
                <Filter size={16} />
                Filtros
              </button>
              <label>
                Ordenar por
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="relevance">Relevancia</option>
                  <option value="price">Precio menor</option>
                  <option value="rating">Mejor calificación</option>
                </select>
              </label>
            </div>
          </div>
          <div className="result-list">
            {listed.map((provider) => (
              <article className="result-card" key={provider.id}>
                <img src={provider.image} alt={provider.name} loading="lazy" />
                <div className="result-copy">
                  <div className="provider-row">
                    {provider.featured && <span className="badge">Destacado</span>}
                    {provider.verified && <BadgeCheck className="verified" size={17} />}
                  </div>
                  <h2>{provider.name}</h2>
                  <p>
                    <MapPin size={15} />
                    {provider.address}
                  </p>
                  <p>
                    <Users size={15} />
                    Hasta {provider.capacity}
                    <span className="dot" />
                    <Star size={15} fill="currentColor" />
                    {provider.rating} ({provider.reviews} reseñas)
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
                  <span>por evento</span>
                  <button className="btn primary" onClick={() => navigate({ name: "detail", providerId: provider.id })}>
                    Ver detalles
                  </button>
                  <button className="btn secondary" onClick={() => toggleFavorite(provider.id)}>
                    <Heart size={16} fill={favorites.includes(provider.id) ? "currentColor" : "none"} />
                    Guardar
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
  const [quickQuote, setQuickQuote] = useState({
    date: "",
    eventType: "Boda",
    guests: "150",
  });
  const tabs = ["descripcion", "servicios", "paquetes", "reseñas", "ubicación"];

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
    <main className="detail-page">
      <div className="detail-topline">
        <button className="link-btn" onClick={() => navigate({ name: "results", category: provider.category })}>
          <ArrowLeft size={16} />
          Volver a explorar
        </button>
        <div>
          <button className="ghost icon-label">
            <Share2 size={17} />
            Compartir
          </button>
          <button className="ghost icon-label" onClick={() => toggleFavorite(provider.id)}>
            <Heart size={17} fill={favorites.includes(provider.id) ? "currentColor" : "none"} />
            Guardar
          </button>
        </div>
      </div>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="gallery">
            <div className="gallery-main">
              <img src={provider.gallery[0]} alt={provider.name} />
              <button>
                <ImageIcon size={16} />
                Ver todas las fotos ({provider.gallery.length * 7})
              </button>
            </div>
            <div className="gallery-stack">
              {provider.gallery.slice(1, 4).map((image, index) => (
                <div className="gallery-small" key={image}>
                  <img src={image} alt={`${provider.name} galería ${index + 2}`} />
                  {index === 2 && <span>+25</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="detail-heading">
            <div>
              <h1>
                {provider.name}
                {provider.verified && <BadgeCheck size={24} className="verified" />}
              </h1>
              <p className="rating-line">
                <Star size={17} fill="currentColor" />
                {provider.rating} ({provider.reviews} reseñas)
                <span />
                <MapPin size={17} />
                {provider.location}, Guatemala
              </p>
            </div>
            <button className="btn primary" onClick={() => navigate({ name: "booking", step: 2, providerId: provider.id })}>
              <Calendar size={17} />
              Solicitar cotización
            </button>
          </div>
          <div className="detail-highlights">
            <span>
              <Star size={16} />
              Más de 10 años de experiencia
            </span>
            <span>
              <ShieldCheck size={16} />
              Eventos al aire libre y bajo techo
            </span>
            <span>
              <Users size={16} />
              Capacidad: {provider.capacity}
            </span>
          </div>
          <div className="tabs" role="tablist">
            {tabs.map((item) => (
              <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                {item}
              </button>
            ))}
          </div>
          <DetailTab tab={tab} provider={provider} />
        </section>
        <aside className="quote-card">
          <h2>Solicita una cotización rápida</h2>
          <p>Cuéntanos los detalles de tu evento y recibe una propuesta personalizada.</p>
          <form onSubmit={submitQuickQuote}>
            <label>
              <span>Fecha del evento</span>
              <input
                type="date"
                min={minEventDate}
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
            Tu información está segura y protegida.
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

  if (tab === "reseñas") {
    return (
      <div className="tab-panel reviews">
        {["Excelente comunicación y montaje impecable.", "La propuesta fue clara y llegó rápido.", "Muy buen balance entre precio y calidad."].map((review, index) => (
          <article key={review}>
            <div>
              <strong>{["Andrea M.", "Carlos R.", "Sofía P."][index]}</strong>
              <span>
                <Star size={15} fill="currentColor" />
                4.{9 - index}
              </span>
            </div>
            <p>{review}</p>
          </article>
        ))}
      </div>
    );
  }

  if (tab === "ubicación") {
    return (
      <div className="tab-panel map-panel">
        <MapPin size={28} />
        <h3>{provider.address}</h3>
        <p>Zona de cobertura: {provider.department}, Guatemala. Los costos de transporte se confirman en la cotización.</p>
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
  const [step, setStep] = useState(route.step || 1);
  const [form, setForm] = useState({
    eventType: route.draft?.eventType || "Boda",
    date: route.draft?.date || "",
    guests: route.draft?.guests || "100",
    location: "Ciudad de Guatemala",
    budget: "15000",
    services: selectedProvider ? [selectedProvider.category] : ["salones"],
    providerId: selectedProvider?.id || "",
    payment: "reserva",
  });

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

  const next = () => setStep((value) => Math.min(value + 1, 4));
  const back = () => setStep((value) => Math.max(value - 1, 1));

  return (
    <main className="booking-page">
      <button className="link-btn" onClick={() => navigate({ name: "home" })}>
        <ArrowLeft size={16} />
        Volver a explorar
      </button>
      <div className="booking-title">
        <div>
          <h1>Nueva reserva</h1>
          <p>Cuéntanos los detalles de tu evento para encontrar los proveedores perfectos para ti.</p>
        </div>
        <ProgressSteps step={step} />
      </div>
      <div className="booking-grid">
        <section className="booking-card">
          {step === 1 && <EventDetails form={form} setForm={setForm} toggleService={toggleService} next={next} />}
          {step === 2 && <ProviderSelect form={form} setForm={setForm} providers={recommended} next={next} back={back} />}
          {step === 3 && <Confirmation form={form} provider={providers.find((provider) => provider.id === form.providerId)} next={next} back={back} />}
          {step === 4 && <Payment form={form} setForm={setForm} navigate={navigate} back={back} />}
        </section>
        <aside className="summary-card">
          <h2>Resumen</h2>
          <SummaryRow icon={Palette} label="Tipo de evento" value={form.eventType} />
          <SummaryRow icon={Calendar} label="Fecha del evento" value={form.date || "--"} />
          <SummaryRow icon={Users} label="Número de invitados" value={form.guests || "--"} />
          <SummaryRow icon={MapPin} label="Ubicación" value={form.location || "--"} />
          <SummaryRow icon={Wallet} label="Presupuesto aproximado" value={formatCurrency(Number(form.budget || 0))} />
          <SummaryRow icon={CheckCircle} label="Servicios necesarios" value={form.services.map(slugLabel).join(", ")} />
          <div className="secure-box">
            <LockKeyhole size={22} />
            <span>Información segura</span>
            <small>Tus datos se comparten solo con proveedores verificados.</small>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ProgressSteps({ step }) {
  const labels = ["Detalles del evento", "Seleccionar proveedor", "Confirmación", "Pago"];
  return (
    <div className="progress-steps">
      {labels.map((label, index) => (
        <div key={label} className={step >= index + 1 ? "active" : ""}>
          <span>{index + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function EventDetails({ form, setForm, toggleService, next }) {
  return (
    <div>
      <h2>Detalles del evento</h2>
      <p>Completa la información para ayudarte a encontrar las mejores opciones.</p>
      <div className="form-grid">
        <label>
          <span>Tipo de evento</span>
          <select value={form.eventType} onChange={(event) => setForm({ ...form, eventType: event.target.value })}>
            {eventTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Fecha del evento</span>
          <input type="date" min={minEventDate} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
        </label>
        <label>
          <span>Número de invitados</span>
          <input
            inputMode="numeric"
            value={form.guests}
            onChange={(event) => setForm({ ...form, guests: event.target.value.replace(/\D/g, "").slice(0, 4) })}
          />
        </label>
        <label>
          <span>Ubicación del evento</span>
          <select value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })}>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </label>
        <label className="wide">
          <span>Presupuesto aproximado</span>
          <input
            inputMode="numeric"
            value={form.budget}
            onChange={(event) => setForm({ ...form, budget: event.target.value.replace(/\D/g, "").slice(0, 7) })}
          />
        </label>
      </div>
      <h3>Servicios necesarios</h3>
      <div className="service-select">
        {categories.map((category) => (
          <button key={category.id} className={form.services.includes(category.id) ? "active" : ""} onClick={() => toggleService(category.id)} type="button">
            <span>{form.services.includes(category.id) && <CheckCircle size={15} />}</span>
            <CategoryIcon categoryId={category.id} />
            {category.label}
          </button>
        ))}
      </div>
      <div className="booking-actions">
        <button className="btn primary" onClick={next}>
          Siguiente
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ProviderSelect({ form, setForm, providers: suggestedProviders, next, back }) {
  return (
    <div>
      <h2>Seleccionar proveedor</h2>
      <p>Estas opciones coinciden con el servicio principal de tu solicitud.</p>
      <div className="select-provider-list">
        {suggestedProviders.map((provider) => (
          <button
            type="button"
            className={form.providerId === provider.id ? "provider-option active" : "provider-option"}
            key={provider.id}
            onClick={() => setForm({ ...form, providerId: provider.id })}
          >
            <img src={provider.image} alt={provider.name} />
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

function Confirmation({ form, provider, next, back }) {
  return (
    <div className="confirmation">
      <h2>Confirmación</h2>
      <p>Revisa tu solicitud antes de pasar al pago de reserva.</p>
      <div className="confirm-box">
        <SummaryRow icon={Palette} label="Evento" value={form.eventType} />
        <SummaryRow icon={Calendar} label="Fecha" value={form.date || "Por confirmar"} />
        <SummaryRow icon={Users} label="Invitados" value={form.guests} />
        <SummaryRow icon={Building2} label="Proveedor" value={provider?.name || "Sin proveedor"} />
        <SummaryRow icon={Wallet} label="Presupuesto" value={formatCurrency(Number(form.budget || 0))} />
      </div>
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

function Payment({ form, setForm, navigate, back }) {
  return (
    <div className="payment">
      <h2>Pago seguro</h2>
      <p>Demo de flujo: no se procesa ningún pago real.</p>
      <div className="payment-options">
        {["reserva", "total"].map((option) => (
          <button key={option} className={form.payment === option ? "active" : ""} onClick={() => setForm({ ...form, payment: option })}>
            <CreditCard size={20} />
            {option === "reserva" ? "Pagar reserva" : "Pagar total"}
          </button>
        ))}
      </div>
      <div className="security-notice">
        <LockKeyhole size={22} />
        <p>La interfaz valida campos, evita HTML inyectado y no guarda tarjetas. En producción se conectaría un proveedor PCI DSS.</p>
      </div>
      <div className="booking-actions split">
        <button className="btn secondary" onClick={back}>
          Atrás
        </button>
        <button className="btn primary" onClick={() => navigate({ name: "dashboard", tab: "reservas" })}>
          Finalizar reserva
          <CheckCircle size={16} />
        </button>
      </div>
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

function DashboardPage({ route, navigate, favorites, toggleFavorite, currentUser }) {
  const [tab, setTab] = useState(route.tab || "cotizaciones");
  const favoriteProviders = providers.filter((provider) => favorites.includes(provider.id));

  useEffect(() => {
    if (route.tab) setTab(route.tab);
  }, [route.tab]);

  const renderPanel = () => {
    if (tab === "reservas") return <ReservationPanel />;
    if (tab === "favoritos") return <FavoritesPanel providers={favoriteProviders} navigate={navigate} toggleFavorite={toggleFavorite} />;
    if (tab === "mensajes") return <MessagesPanel />;
    if (tab === "perfil") return <ProfilePanel />;
    if (tab === "configuracion") return <SettingsPanel />;
    if (tab === "buscar") return <SearchPanel navigate={navigate} />;
    if (tab === "inicio") return <DashboardHome navigate={navigate} />;
    return <QuotesPanel navigate={navigate} />;
  };

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <Logo />
        <nav>
          {dashboardItems.map((item) => (
            <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
              <item.icon size={19} />
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
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
          <div />
          <div className="dash-icons">
            <Bell size={20} />
            <Mail size={20} />
            <span className="avatar">{(currentUser?.name || "María López").slice(0, 2).toUpperCase()}</span>
            <strong>{currentUser?.name || "María López"}</strong>
            <ChevronDown size={16} />
          </div>
        </div>
        {renderPanel()}
      </section>
    </main>
  );
}

function QuotesPanel({ navigate }) {
  return (
    <div>
      <PanelTitle title="Mis cotizaciones" subtitle="Gestiona todas las cotizaciones que has recibido y enviado." />
      <div className="dash-tabs">
        {["Recibidas", "Enviadas", "Archivadas"].map((item, index) => (
          <button className={index === 0 ? "active" : ""} key={item}>
            {item}
          </button>
        ))}
      </div>
      <div className="quote-list">
        {quotes.slice(0, 8).map((quote) => (
          <article className="quote-row" key={quote.id}>
            <img src={quote.image} alt={quote.providerName} />
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
      <PanelTitle title="Mensajes" subtitle="Conversaciones de demo con proveedores y soporte." />
      <div className="messages">
        {["Jardín Botánico Eventos", "Soporte Vibe", "Catering Gourmet GT"].map((name, index) => (
          <article key={name}>
            <span className="avatar">{name.slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{name}</strong>
              <p>{index === 1 ? "Podemos ayudarte a comparar propuestas." : "Gracias por tu solicitud. Te enviamos disponibilidad hoy."}</p>
            </div>
            <button className="btn secondary">
              <Send size={15} />
              Responder
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfilePanel() {
  return (
    <div>
      <PanelTitle title="Perfil" subtitle="Datos de cuenta de ejemplo." />
      <div className="profile-card">
        <span className="avatar large">ML</span>
        <div>
          <h2>María López</h2>
          <p>Organizadora de eventos · Ciudad de Guatemala</p>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div>
      <PanelTitle title="Configuración" subtitle="Preferencias de privacidad y notificaciones." />
      <div className="settings-list">
        {["Solicitar confirmación antes de compartir datos", "Recibir alertas de cotizaciones", "Mostrar solo proveedores verificados"].map((setting) => (
          <label key={setting}>
            <span>{setting}</span>
            <input type="checkbox" defaultChecked />
          </label>
        ))}
      </div>
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
            <small>20 proveedores</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardHome({ navigate }) {
  return (
    <div>
      <PanelTitle title="Inicio" subtitle="Resumen rápido de tu actividad." />
      <div className="stats-grid">
        {[
          ["Cotizaciones", "12"],
          ["Reservas", "8"],
          ["Favoritos", "6"],
          ["Mensajes", "2"],
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
  const content = {
    "como-funciona": {
      title: "Cómo funciona",
      subtitle: "Un flujo simple para pedir propuestas, comparar y reservar con más confianza.",
      cards: [
        ["Explora", "Filtra proveedores por categoría, ubicación, presupuesto y calificación."],
        ["Cotiza", "Envía una solicitud con fecha, invitados y servicios necesarios."],
        ["Reserva", "Confirma el proveedor elegido desde un flujo seguro de demostración."],
      ],
    },
    blog: {
      title: "Blog",
      subtitle: "Ideas ficticias para planificar eventos memorables.",
      cards: [
        ["Checklist para bodas", "Los puntos clave para coordinar salón, catering, fotos y sonido."],
        ["Tendencias de decoración", "Texturas naturales, luz cálida y rincones lounge para fotos."],
        ["Presupuestos reales", "Cómo comparar paquetes sin perder calidad en la experiencia."],
      ],
    },
    contacto: {
      title: "Contacto",
      subtitle: "Canales de ejemplo para soporte y asesoría.",
      cards: [
        ["Correo", "hola@vibeevents.demo"],
        ["Teléfono", "+502 2222 0101"],
        ["Horario", "Lunes a viernes, 9:00 a. m. a 6:00 p. m."],
      ],
    },
  }[route.section || "como-funciona"];

  return (
    <main className="info-page">
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
        <button className="btn primary" onClick={() => navigate({ name: "booking", step: 1 })}>
          Crear reserva
          <ArrowRight size={16} />
        </button>
      </section>
    </main>
  );
}

function AuthModal({ mode, onClose, onSuccess }) {
  const [activeMode, setActiveMode] = useState(mode || "login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveMode(mode || "login");
    setError("");
  }, [mode]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        email: sanitize(form.email).toLowerCase(),
        password: form.password,
        ...(activeMode === "register" ? { name: sanitize(form.name) } : {}),
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
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
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
          </label>
          {error && <div className="form-error">{error}</div>}
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

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div>
        <Logo compact />
        <p>La plataforma ficticia para cotizar, comparar y reservar proveedores para eventos en Guatemala.</p>
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
        <strong>Guatemala</strong>
        <span>Servicio en todo el país</span>
        <span>Ciudad de Guatemala</span>
        <span>Antigua Guatemala</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState({ name: "home" });
  const [authModal, setAuthModal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vibe:favorites") || "[]");
      return Array.isArray(saved) ? saved.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  });

  const navigate = (nextRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDashboard = (tab = "cotizaciones") => {
    if (!currentUser && !localStorage.getItem("vibe:token")) {
      setAuthModal("login");
      return;
    }
    navigate({ name: "dashboard", tab });
  };

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

  useEffect(() => {
    localStorage.setItem("vibe:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (providerId) => {
    setFavorites((current) => (current.includes(providerId) ? current.filter((id) => id !== providerId) : [...current, providerId]));
  };

  const page = (() => {
    if (route.name === "results") return <ResultsPage route={{ category: "salones", ...route }} navigate={navigate} favorites={favorites} toggleFavorite={toggleFavorite} />;
    if (route.name === "detail") return <DetailPage route={route} navigate={navigate} favorites={favorites} toggleFavorite={toggleFavorite} />;
    if (route.name === "booking") return <BookingPage route={route} navigate={navigate} />;
    if (route.name === "dashboard") {
      return <DashboardPage route={route} navigate={navigate} favorites={favorites} toggleFavorite={toggleFavorite} currentUser={currentUser} />;
    }
    if (route.name === "info") return <InfoPage route={route} navigate={navigate} />;
    return <HomePage navigate={navigate} />;
  })();

  return (
    <div className="app">
      {route.name !== "dashboard" && (
        <Header
          navigate={navigate}
          currentView={route}
          openDashboard={() => openDashboard("cotizaciones")}
          openAuth={(mode) => setAuthModal(mode)}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${route.name}-${route.category || route.providerId || route.section || route.tab || route.step || "home"}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthModal(null);
            navigate({ name: "dashboard", tab: "cotizaciones" });
          }}
        />
      )}
      {route.name !== "dashboard" && <Footer navigate={navigate} />}
    </div>
  );
}
