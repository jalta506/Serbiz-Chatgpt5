// app/page.tsx
import Link from 'next/link'

type Cat = {
  title: string
  subtitle?: string
  examples?: string[]
  href: string
  emoji: string
}

const CATS: Cat[] = [
  // 🍽️ Food
  {
    title: 'Restaurantes & Comida',
    subtitle: 'Sodas, cafés, street food',
    examples: ['Soda típica', 'Restaurante', 'Café'],
    href: '/buscar?q=Restaurante',
    emoji: '🍽️',
  },
  // 🛠️ General Services
  {
    title: 'Servicios generales',
    subtitle: 'Para la casa y el carro',
    examples: ['Plomero', 'Electricista', 'Mecánico'],
    href: '/buscar?q=Plomería',
    emoji: '🛠️',
  },
  // 🌴 Tourism
  {
    title: 'Turismo & Experiencias',
    subtitle: 'Aventura, naturaleza y ciudad',
    examples: ['Guía turístico', 'Tours', 'Parques'],
    href: '/buscar?q=Tours',
    emoji: '🌴',
  },
  // 🧑‍⚕️ Health
  {
    title: 'Salud & Bienestar',
    subtitle: 'Médicos y clínicas',
    examples: ['Médico general', 'Dentista', 'Fisioterapia'],
    href: '/buscar?q=Medicina',
    emoji: '🧑‍⚕️',
  },
  // 💅 Beauty
  {
    title: 'Belleza & Estética',
    subtitle: 'Spas, uñas, estética',
    examples: ['Spa', 'Nail salon', 'Clínica estética'],
    href: '/buscar?q=Spa',
    emoji: '💅',
  },
  // 🛒 Shops (optional catch-all)
  {
    title: 'Tiendas & Especializados',
    subtitle: 'Locales y productos',
    examples: ['Tecnología', 'Muebles', 'Artesanías'],
    href: '/buscar?q=Tienda',
    emoji: '🛒',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="rounded-2xl p-6 md:p-8 bg-[#27D9CF]/90 text-black">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          ¡Todo lo que necesitas está en SERBIZ!
        </h1>
        <p className="text-sm mt-1 opacity-80">
          SERBIZ · Turquoise & Black · Mobile-first
        </p>

        {/* Search bar (kept simple – same UX as before, but inline here) */}
        <form
          action="/buscar"
          className="mt-4 flex flex-col md:flex-row gap-2 items-stretch"
        >
          <input
            className="input flex-1"
            name="q"
            placeholder="Barbería, Plomería…"
          />
          <input
            className="input flex-1"
            name="loc"
            placeholder="Provincia / Cantón / Distrito"
          />
          <button className="btn btn-primary md:self-stretch">Buscar</button>
        </form>
      </section>

      {/* CATEGORY GRID */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Explorar por categoría</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-2xl border hover:shadow-md transition bg-white p-4 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  {c.subtitle && (
                    <p className="text-sm text-black/60">{c.subtitle}</p>
                  )}
                </div>
              </div>

              {c.examples && (
                <div className="mt-3 text-sm text-black/70">
                  {c.examples.join(' · ')}
                </div>
              )}

              <div className="mt-4">
                <span className="inline-flex items-center gap-1 text-teal-700 group-hover:underline">
                  Ver opciones
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRAVEL CONSULTING PROMO */}
      <section className="rounded-2xl border p-4 md:p-6">
        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
          <div>
            <h2 className="text-xl font-bold">¿Planeando tu viaje a Costa Rica?</h2>
            <p className="text-black/70 mt-1">
              Reserva una llamada de 30 minutos con consultores locales (EN/ES) para
              tips, zonas, presupuestos y cómo moverte.
            </p>
          </div>
          <a
            className="btn btn-primary"
            href={
              'https://wa.me/50686045731?text=Hola%20SERBIZ%2C%20quiero%20agendar%20una%20consulta%20tur%C3%ADstica%20de%2030%20min.'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Reservar por WhatsApp
          </a>
        </div>
      </section>

      {/* OPTIONAL: keep a small “Nuevos” strip if you like later */}
      {/* We can add a small curated/featured row here in a next iteration */}
    </div>
  )
}
