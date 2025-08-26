'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const router = useRouter()
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <input className="input" placeholder="Barbería, Plomería..." value={q} onChange={e=>setQ(e.target.value)} />
      <input className="input" placeholder="Provincia / Cantón / Distrito" value={loc} onChange={e=>setLoc(e.target.value)} />
      <button className="btn btn-primary" onClick={()=>router.push(`/buscar?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`)}>
        Buscar
      </button>
    </div>
  )
}
