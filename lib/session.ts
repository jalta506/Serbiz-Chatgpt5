// lib/session.ts
import type { SessionOptions } from 'iron-session'

export type SessionData = {
  user?: {
    id: string
    username: string
    role: 'user' | 'vendor' | 'admin'
    locale: 'es' | 'en'
  }
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'complex_password_at_least_32_chars_long',
  cookieName: 'serbiz_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
