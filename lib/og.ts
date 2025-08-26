// lib/og.ts
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SerbizBot/1.0' } });
    if (!res.ok) return null;
    const html = await res.text();

    // Find common OG tags
    const m1 = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (m1?.[1]) return m1[1];

    const m2 = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    if (m2?.[1]) return m2[1];

    return null;
  } catch {
    return null;
  }
}

// quick handle prettifier
export function prettyFromHandle(instaUrl: string): { handle: string | null; pretty: string | null } {
  try {
    const u = new URL(instaUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    const handle = parts?.[0] || null;
    if (!handle) return { handle: null, pretty: null };
    const pretty = handle
      .replace(/^@/, '')
      .replace(/[-_.]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { handle, pretty };
  } catch {
    return { handle: null, pretty: null };
  }
}
