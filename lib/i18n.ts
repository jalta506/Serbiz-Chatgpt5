import es from '@/i18n/es.json'
import en from '@/i18n/en.json'

export type Locale = 'es' | 'en'
export const dict: Record<Locale, Record<string, string>> = { es, en }

export function t(locale: Locale, key: string) {
  return (dict[locale] && dict[locale][key]) || key
}
