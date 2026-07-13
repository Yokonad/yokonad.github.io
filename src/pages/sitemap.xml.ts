import { getCollection } from 'astro:content';

// Sitemap generado en build: siempre incluye la portada, el índice de write-ups
// y una entrada por cada write-up (se mantiene solo, sin editar a mano).
const SITE = 'https://yokonad.online';

export async function GET() {
  const writeups = await getCollection('writeups');

  const urls = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    { loc: `${SITE}/writeups/`, changefreq: 'weekly', priority: '0.8' },
    ...writeups.map((w) => ({
      loc: `${SITE}/writeups/${w.id}/`,
      lastmod: w.data.date,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${'lastmod' in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
