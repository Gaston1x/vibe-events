export const categories = [
  {
    id: "salones",
    label: "Salones",
    singular: "Salón",
    icon: "building",
    hint: "Encuentra el lugar ideal",
    accent: "#7c3aed",
  },
  {
    id: "catering",
    label: "Catering",
    singular: "Catering",
    icon: "utensils",
    hint: "Menús para cada ocasión",
    accent: "#f97316",
  },
  {
    id: "decoracion",
    label: "Decoración",
    singular: "Decoración",
    icon: "sparkles",
    hint: "Dale vida a tu evento",
    accent: "#ec4899",
  },
  {
    id: "fotografia",
    label: "Fotografía",
    singular: "Fotografía",
    icon: "camera",
    hint: "Captura cada momento",
    accent: "#0ea5e9",
  },
  {
    id: "sonido",
    label: "Sonido e iluminación",
    singular: "Producción",
    icon: "music",
    hint: "Ambiente perfecto",
    accent: "#06b6d4",
  },
  {
    id: "mobiliario",
    label: "Mobiliario",
    singular: "Mobiliario",
    icon: "sofa",
    hint: "Comodidad y estilo",
    accent: "#a16207",
  },
];

const locations = [
  "Ciudad de Guatemala",
  "Antigua Guatemala",
  "Mixco",
  "Villa Nueva",
  "Carretera a El Salvador",
  "Quetzaltenango",
  "San Lucas Sacatepéquez",
  "Amatitlán",
  "Fraijanes",
  "Escuintla",
  "Chimaltenango",
  "Cayalá",
  "Zona 10, Ciudad de Guatemala",
  "Zona 14, Ciudad de Guatemala",
  "Santa Catarina Pinula",
  "San Cristóbal",
  "San Pedro Las Huertas",
  "Panajachel",
  "Retalhuleu",
  "Huehuetenango",
];

const categoryImages = {
  salones: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
  ],
  catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  ],
  decoracion: [
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80",
  ],
  fotografia: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1480365501497-199581be0e66?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
  ],
  sonido: [
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80",
  ],
  mobiliario: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  ],
};

const categoryImageAlt = {
  salones: "Imagen de referencia: salón decorado para un evento",
  catering: "Imagen de referencia: mesa de catering con platillos servidos",
  decoracion: "Imagen de referencia: decoración floral para una celebración",
  fotografia: "Imagen de referencia: fotógrafo y equipo de cámara en un evento",
  sonido: "Imagen de referencia: escenario con luces y equipo de sonido",
  mobiliario: "Imagen de referencia: mobiliario y mesas montadas para un evento",
};

const providerNames = {
  salones: [
    "Jardín Botánico Eventos",
    "Casa Vista Hermosa",
    "Finca San Rafael",
    "Salón Los Olivos",
    "Terrazas de Antigua",
    "Hacienda Luna Clara",
    "Casa Aurora",
    "Villa Encanto",
    "Salón Gran Vía",
    "Quinta Primavera",
    "El Mirador Eventos",
    "Palacio Roble",
    "Jardines de San Lucas",
    "Casa Nube",
    "Finca Las Orquídeas",
    "Terraza Cobalto",
    "Salón Alameda",
    "Hacienda El Ciprés",
    "Casa de Cristal",
    "Patio Esmeralda",
  ],
  catering: [
    "Catering Gourmet GT",
    "Mesa Nativa",
    "Banquetes El Chef",
    "Sazón Antigua",
    "Fuego Lento Eventos",
    "Alta Cocina Maya",
    "Canela y Laurel",
    "Bocados de Gala",
    "Cocina Ambar",
    "Sabores del Valle",
    "Dulce Banquete",
    "La Mesa Verde",
    "Catering Cacao",
    "Brasa Fina",
    "Atelier de Bocadillos",
    "Cocina de Autor GT",
    "Festín Urbano",
    "Entre Copas y Platos",
    "Chef de Jardín",
    "Banquetes Horizonte",
  ],
  decoracion: [
    "Deco Events",
    "Flores y Luz",
    "Concepto Magnolia",
    "Atelier Coral",
    "Nube Floral",
    "Brillo Ceremonial",
    "Diseño Aura",
    "Ramas y Rosas",
    "Escenografía Violeta",
    "Lirio Studio",
    "Detalles del Valle",
    "Momentos de Seda",
    "Arco Vivo",
    "Jardín de Papel",
    "Deco Índigo",
    "Luz de Mesa",
    "Floristería Gala",
    "Ambiental Prisma",
    "Guirnalda Studio",
    "Arte Floral Cielo",
  ],
  fotografia: [
    "Lente Vivo Studio",
    "Cámara Clara",
    "Fotografía Horizonte",
    "Instante Real",
    "Focus Antigua",
    "Retrato Nativo",
    "Luz y Memoria",
    "Pixel de Gala",
    "CineBoda GT",
    "Ojo de Evento",
    "Cromo Studio",
    "Votos en Foto",
    "Frame Azul",
    "Archivo Feliz",
    "Golden Hour GT",
    "Nítido Films",
    "Click Ceremonial",
    "Mirada Urbana",
    "Foco Mágico",
    "Aura Visual",
  ],
  sonido: [
    "Sonido e Iluminación Pro",
    "Beat Maya",
    "Lumen Stage",
    "Audio Cobalto",
    "Escena Viva",
    "Luces del Valle",
    "Ritmo Central",
    "StageLab GT",
    "Neón Eventos",
    "Sonar Antigua",
    "Pulse Producciones",
    "Control DMX",
    "Altavoz Premium",
    "Prisma Live",
    "Cabina Futura",
    "Groove Lighting",
    "Vibra Sonora",
    "Luz Total",
    "Ambiente 360",
    "Setlist Eventos",
  ],
  mobiliario: [
    "Mobiliario Elegante",
    "Silla y Mesa GT",
    "Lounge Central",
    "Renta Roble",
    "Texturas de Gala",
    "Muebles Nube",
    "Bambú Eventos",
    "Mobiliario Versátil",
    "Casa Lounge",
    "Mesa Larga",
    "Sillas Aurora",
    "Ambient Furniture",
    "Madera y Tela",
    "Terraza Rentals",
    "Estilo Modular",
    "Banco y Jardín",
    "Gala Comfort",
    "Set de Ensueño",
    "Rincón VIP",
    "Muebles Prisma",
  ],
};

const categoryDescriptions = {
  salones:
    "espacios versátiles con áreas verdes, terrazas, parqueo y coordinación para bodas, eventos corporativos y celebraciones sociales.",
  catering:
    "menús personalizados, estaciones en vivo, degustación previa y montaje impecable para diferentes estilos de evento.",
  decoracion:
    "diseño floral, mobiliario escénico, iluminación cálida y conceptos visuales adaptados al mood de cada celebración.",
  fotografia:
    "cobertura documental, retratos dirigidos, edición profesional y entrega digital lista para compartir.",
  sonido:
    "audio profesional, iluminación inteligente, cabina DJ y soporte técnico durante toda la experiencia.",
  mobiliario:
    "sets lounge, mesas, sillas, barras, textiles y piezas decorativas para transformar cualquier espacio.",
};

const baseTags = {
  salones: ["Jardín", "Bodas", "Corporativo", "Parqueo amplio"],
  catering: ["Buffet", "Cóctel", "Chef privado", "Postres"],
  decoracion: ["Flores", "Arcos", "Ambientación", "Centros de mesa"],
  fotografia: ["Foto", "Video", "Drone", "Entrega digital"],
  sonido: ["Audio", "Luces", "DJ", "Tarima"],
  mobiliario: ["Sillas", "Mesas", "Lounge", "Textiles"],
};

const services = {
  salones: ["Iluminación", "Seguridad", "Baños", "Cocina", "Área de catering", "Plan B por lluvia"],
  catering: ["Degustación", "Personal de servicio", "Cristalería", "Menú infantil", "Barra de bebidas", "Chef en sitio"],
  decoracion: ["Moodboard", "Montaje", "Desmontaje", "Flores frescas", "Velas LED", "Asesoría visual"],
  fotografia: ["Sesión previa", "Video resumen", "Galería privada", "Segundo fotógrafo", "Drone", "Álbum premium"],
  sonido: ["DJ", "Microfonía", "Luces robóticas", "Pantallas LED", "Técnico en sitio", "Planta eléctrica"],
  mobiliario: ["Entrega", "Instalación", "Mantelería", "Sillas premium", "Barras móviles", "Lounge VIP"],
};

export const departments = [
  "Guatemala",
  "Sacatepéquez",
  "Quetzaltenango",
  "Escuintla",
  "Chimaltenango",
  "Sololá",
  "Retalhuleu",
];

export const eventTypes = ["Boda", "Corporativo", "Cumpleaños", "Graduación", "Baby shower", "Aniversario"];

export const providers = categories.flatMap((category, categoryIndex) =>
  providerNames[category.id].map((name, index) => {
    const providerNumber = categoryIndex * 20 + index + 1;
    const price = 4800 + categoryIndex * 1450 + index * 530;
    const capacityMin = category.id === "fotografia" || category.id === "sonido" ? 25 : 50;
    const capacityMax = category.id === "salones" ? 120 + index * 35 : 80 + index * 18;
    const location = locations[index % locations.length];
    const gallery = [
      categoryImages[category.id][index % 4],
      categoryImages[category.id][(index + 1) % 4],
      categoryImages[category.id][(index + 2) % 4],
      categoryImages[category.id][(index + 3) % 4],
    ];

    return {
      id: `${category.id}-${index + 1}`,
      providerNumber,
      name,
      category: category.id,
      categoryLabel: category.label,
      location,
      department: departments[index % departments.length],
      address: `${index + 3} avenida ${index + 8}-${(index % 9) + 10}, ${location}`,
      price,
      capacity: `${capacityMin} - ${capacityMax} personas`,
      image: gallery[0],
      imageAlt: categoryImageAlt[category.id],
      gallery,
      tags: [...baseTags[category.id], eventTypes[index % eventTypes.length]].slice(0, 5),
      services: services[category.id],
      responseTime: `${2 + (index % 5)} h`,
      verified: index % 3 !== 1,
      featured: index < 4,
      description: `${name} ofrece ${categoryDescriptions[category.id]}`,
      package: {
        name: index % 2 === 0 ? "Paquete Esencial" : "Paquete Premium",
        includes: ["Asesoría inicial", "Coordinación de logística", "Checklist de montaje", "Soporte por WhatsApp"],
      },
    };
  }),
);

export const quotes = providers.slice(0, 12).map((provider, index) => ({
  id: `QS-${4587 + index * 347}`,
  providerId: provider.id,
  providerName: provider.name,
  category: provider.categoryLabel,
  location: provider.location,
  image: provider.image,
  sentAt: `${12 - (index % 7)} de mayo, 2026`,
  time: `${9 + (index % 9)}:${index % 2 === 0 ? "30" : "45"} a. m.`,
  total: provider.price + 2800 + index * 375,
  status: index % 3 === 0 ? "Pendiente" : "Respondida",
}));

export const reservations = providers.slice(4, 12).map((provider, index) => ({
  id: `RS-${2300 + index * 63}`,
  providerName: provider.name,
  date: `${4 + index} de junio, 2026`,
  type: eventTypes[index % eventTypes.length],
  total: provider.price + 3500,
  status: index % 2 === 0 ? "Confirmada" : "En revisión",
}));

export const imageCredits = Object.entries(categoryImages).flatMap(([category, urls]) =>
  urls.map((url) => ({ category, url: url.split("?")[0] })),
);

export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 0,
  }).format(value);
