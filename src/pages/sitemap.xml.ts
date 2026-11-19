import {isLive, locales, pages, url} from '../lib/content'
import {articleRoutes} from '../lib/cms'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({site}) => {
  const articles = isLive() ? await articleRoutes() : []
  const urls = ['', ...pages.filter(page => !page.slug.startsWith('resources/')).map(page => page.slug), ...articles].flatMap(slug =>
    locales.map(locale => '<url><loc>' + new URL(url(locale,slug),site).href + '</loc></url>'),
  )
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    (isLive() ? urls.join('') : '') + '</urlset>', {headers:{'Content-Type':'application/xml; charset=utf-8'}})
}
