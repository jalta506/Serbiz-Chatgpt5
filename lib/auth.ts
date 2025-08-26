'use server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.user) session.user = undefined
  return session
}

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } })
  if (!user) return { ok: false, error: 'Invalid credentials' }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return { ok: false, error: 'Invalid credentials' }

  const session = await getSession()
  const role = user.role.toLowerCase() as 'user' | 'vendor' | 'admin'
  session.user = {
    id: user.id,
    username: user.username,
    role,
    locale: (user.locale as any) || 'es',
  }
  await session.save()
  return { ok: true, role }
}

export async function register(username: string, password: string, role: 'user'|'vendor') {
  const exists = await db.user.findUnique({ where: { username } })
  if (exists) return { ok:false, error:'Username taken' }
  const hash = await bcrypt.hash(password, 10)
  const user = await db.user.create({ data: { username, password: hash, role: role.toUpperCase() as any, locale: 'es' } })
  const session = await getSession()
  session.user = { id: user.id, username: user.username, role: role, locale: 'es' }
  await session.save()
  return { ok:true }
}

export async function logout() {
  const session = await getSession()
  session.destroy()
}
