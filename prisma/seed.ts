// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

type Cat = { name_es: string; name_en?: string; synonyms?: string[] }

const CATEGORIES: Cat[] = [
  // Hogar y Mantenimiento
  { name_es: 'Plomería', name_en: 'Plumbing', synonyms: ['plomero','plomeria'] },
  { name_es: 'Electricidad', name_en: 'Electrical', synonyms: ['electricista'] },
  { name_es: 'Carpintería', name_en: 'Carpentry' },
  { name_es: 'Soldadura', name_en: 'Welding' },
  { name_es: 'Gypsum y Cielorrasos', name_en: 'Drywall & Ceilings', synonyms: ['gypsum'] },
  { name_es: 'Pintura', name_en: 'Painting' },
  { name_es: 'Techos y Canaletas', name_en: 'Roofs & Gutters' },
  { name_es: 'Construcción y Remodelación', name_en: 'Construction & Remodeling' },
  { name_es: 'Jardinería y Paisajismo', name_en: 'Gardening & Landscaping', synonyms: ['jardineria','paisajismo'] },
  { name_es: 'Fumigación (hogar)', name_en: 'Pest Control (home)', synonyms: ['fumigacion'] },
  { name_es: 'Piscinas (mantenimiento)', name_en: 'Pool Maintenance' },
  { name_es: 'A/C y Refrigeración', name_en: 'A/C & Refrigeration' },
  { name_es: 'Cerrajería', name_en: 'Locksmith' },
  { name_es: 'Limpieza residencial', name_en: 'Residential Cleaning' },
  { name_es: 'Limpieza profunda', name_en: 'Deep Cleaning' },
  { name_es: 'Limpieza de vidrios', name_en: 'Window Cleaning' },
  { name_es: 'Lavandería', name_en: 'Laundry' },
  { name_es: 'Mudanzas y Fletes', name_en: 'Moving & Hauling' },
  { name_es: 'Desechos/Reciclaje', name_en: 'Junk Removal & Recycling' },
  { name_es: 'Persianas y Cortinas', name_en: 'Blinds & Curtains' },

  // Vehículos
  { name_es: 'Mecánica general', name_en: 'Auto Mechanic' },
  { name_es: 'Eléctrica automotriz', name_en: 'Auto Electrical' },
  { name_es: 'Enderezado y Pintura (autos)', name_en: 'Bodywork & Paint' },
  { name_es: 'Llantas y Alineado', name_en: 'Tires & Alignment' },
  { name_es: 'Lavado/Detailing', name_en: 'Car Wash & Detailing' },
  { name_es: 'Grúa/Remolque', name_en: 'Towing' },

  // Belleza y Bienestar
  { name_es: 'Barbería', name_en: 'Barbershop', synonyms: ['barbero','barberia'] },
  { name_es: 'Peluquería', name_en: 'Hair Salon' },
  { name_es: 'Manicure/Pedicure', name_en: 'Manicure/Pedicure' },
  { name_es: 'Spa y Masajes', name_en: 'Spa & Massage' },
  { name_es: 'Maquillaje', name_en: 'Makeup' },
  { name_es: 'Depilación', name_en: 'Waxing' },

  // Tecnología
  { name_es: 'Reparación de computadoras', name_en: 'Computer Repair' },
  { name_es: 'Reparación de celulares', name_en: 'Phone Repair' },
  { name_es: 'Redes e Internet (hogar/pyme)', name_en: 'Networking & Internet' },
  { name_es: 'Cámaras y CCTV', name_en: 'Cameras & CCTV' },
  { name_es: 'Diseño web / Desarrollo', name_en: 'Web Design / Development', synonyms: ['desarrollo web'] },
  { name_es: 'Soporte IT', name_en: 'IT Support' },

  // Profesionales
  { name_es: 'Contabilidad/Tributario', name_en: 'Accounting/Tax' },
  { name_es: 'Abogados/Notaría', name_en: 'Lawyers/Notary' },
  { name_es: 'Arquitectura', name_en: 'Architecture' },
  { name_es: 'Ingeniería', name_en: 'Engineering' },
  { name_es: 'Topografía', name_en: 'Surveying' },
  { name_es: 'Consultoría de negocios', name_en: 'Business Consulting' },
  { name_es: 'Traducción/Interpretación', name_en: 'Translation/Interpretation' },

  // Educación
  { name_es: 'Tutorías (matemática/inglés)', name_en: 'Tutoring (Math/English)' },
  { name_es: 'Clases de música', name_en: 'Music Lessons' },
  { name_es: 'Clases de baile', name_en: 'Dance Lessons' },
  { name_es: 'Programación para niños/jóvenes', name_en: 'Coding for Kids/Teens' },

  // Salud y Cuidado Personal *
  { name_es: 'Nutrición', name_en: 'Nutrition' },
  { name_es: 'Psicología', name_en: 'Psychology' },
  { name_es: 'Fisioterapia', name_en: 'Physical Therapy' },
  { name_es: 'Odontología', name_en: 'Dentistry' },
  { name_es: 'Optometría', name_en: 'Optometry' },
  { name_es: 'Medicina General', name_en: 'General Medicine' },

  // Niñez/Adulto mayor/Mascotas
  { name_es: 'Cuido de niños', name_en: 'Child Care' },
  { name_es: 'Cuido de adulto mayor', name_en: 'Elder Care' },
  { name_es: 'Paseo y entrenamiento canino', name_en: 'Dog Walking/Training' },
  { name_es: 'Veterinaria', name_en: 'Veterinary' },
  { name_es: 'Grooming', name_en: 'Pet Grooming' },

  // Seguridad
  { name_es: 'Seguridad privada', name_en: 'Private Security' },
  { name_es: 'Alarmas y monitoreo', name_en: 'Alarms & Monitoring' },
  { name_es: 'Control de acceso', name_en: 'Access Control' },

  // Eventos
  { name_es: 'Fotografía', name_en: 'Photography' },
  { name_es: 'Video', name_en: 'Video' },
  { name_es: 'DJ/Audio', name_en: 'DJ/Audio' },
  { name_es: 'Iluminación de eventos', name_en: 'Event Lighting' },
  { name_es: 'Alquiler de mobiliario', name_en: 'Furniture Rental' },
  { name_es: 'Organización de eventos', name_en: 'Event Planning' },
  { name_es: 'Catering', name_en: 'Catering' },
  { name_es: 'Pastelería', name_en: 'Bakery/Cakes' },

  // Turismo / Transporte / Comida
  { name_es: 'Transporte privado', name_en: 'Private Transport' },
  { name_es: 'Tours/Guías', name_en: 'Tours/Guides' },
  { name_es: 'Chofer designado', name_en: 'Designated Driver' },
  { name_es: 'Chef privado', name_en: 'Private Chef' },
  { name_es: 'Comida a domicilio', name_en: 'Food Delivery' },

  // Inmobiliario / Limpieza comercial
  { name_es: 'Mantenimiento de condominios', name_en: 'Condo Maintenance' },
  { name_es: 'Limpieza industrial', name_en: 'Industrial Cleaning' },
  { name_es: 'Administración de propiedades', name_en: 'Property Management' },
  { name_es: 'Jardinería condominios', name_en: 'Condo Landscaping' },

  // Agro y campo
  { name_es: 'Riego', name_en: 'Irrigation' },
  { name_es: 'Agropecuarios', name_en: 'Agriculture' },
  { name_es: 'Control de plagas agrícola', name_en: 'Agricultural Pest Control' },

  // Financiero / Seguros
  { name_es: 'Seguros', name_en: 'Insurance' },
  { name_es: 'Asesoría financiera', name_en: 'Financial Advisory' },
]

async function main() {
  for (const c of CATEGORIES) {
    const slug = slugify(c.name_es)
    await prisma.category.upsert({
      where: { slug },
      update: {
        name_es: c.name_es,
        name_en: c.name_en ?? c.name_es,
        synonyms: c.synonyms ?? [],
      },
      create: {
        slug,
        name_es: c.name_es,
        name_en: c.name_en ?? c.name_es,
        iconKey: null,
        parentId: null,
        synonyms: c.synonyms ?? [],
      },
    })
  }
  console.log(`Seeded ${CATEGORIES.length} categories ✔`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
