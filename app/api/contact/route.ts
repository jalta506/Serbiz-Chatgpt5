import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const vendorId = searchParams.get('vendorId')
  if (!vendorId) return NextResponse.redirect(new URL('/', req.url))
  // Count contact this week
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // simple week start (Sunday)
  const count = await db.contactEvent.count({ where: { vendorId, createdAt: { gte: startOfWeek } } })
  const limit = 3
  if (count >= limit) {
    // redirect to sales WhatsApp with message
    const sales = (process.env.SALES_WHATSAPP || '').toString()
    const msg = encodeURIComponent('Hola, vengo de SERBIZ. Quiero incrementar mi límite de contactos por semana.')
    const url = sales ? `${sales}?text=${msg}` : '/'
    return NextResponse.redirect(url)
  }
  await db.contactEvent.create({ data: { vendorId } })
  // redirect to vendor whatsapp
  const v = await db.vendor.findUnique({ where: { id: vendorId } })
  const wa = v?.whatsapp?.replace(/[^0-9]/g,'') || ''
  const url = wa ? `https://wa.me/${wa}` : '/'
  return NextResponse.redirect(url)
}
