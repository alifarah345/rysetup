import {createClient} from '@sanity/client'
import {isLive, type Locale} from './content'

export interface EditorialPage {
  slug: string
  title: string
  intro: string
  body?: string
  seoTitle?: string
  seoDescription?: string
  serviceApproved?: boolean
}

interface EditorialContent {
  pages: EditorialPage[]
  faqs: {title:string; intro:string}[]
  settings: {whatsapp?:string; email?:string} | null
}

const requests = new Map<Locale, Promise<EditorialContent>>()

function fetchContent(locale: Locale): Promise<EditorialContent> {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  if (!projectId || !dataset) {
    if (isLive()) throw new Error('Release requires a configured CMS and approved content.')
    return Promise.resolve({pages:[], faqs:[], settings:null})
  }
  const drafts = import.meta.env.DEV && process.env.RY_CMS_DRAFTS === 'true'
  if (drafts && !process.env.SANITY_READ_TOKEN) throw new Error('Draft preview requires a server-side CMS token.')
  const client = createClient({
    projectId, dataset, apiVersion:'2025-02-19', useCdn:false,
    perspective:drafts ? 'drafts' : 'published', token:process.env.SANITY_READ_TOKEN,
  })
  return client.fetch<EditorialContent>(`{
    "pages": *[_type == "page" && (approved == true || $drafts) && defined(slug.current)] | order(slug.current asc){
      "slug": slug.current,
      "title": select($locale == "ar" => ar.title, en.title),
"intro": select($locale == "ar" => ar.intro, en.intro),
"body": select($locale == "ar" => ar.body, en.body),
"seoTitle": select($locale == "ar" => ar.seoTitle, en.seoTitle),
"seoDescription": select($locale == "ar" => ar.seoDescription, en.seoDescription),
      serviceApproved
    },
    "faqs": *[_type == "faq" && (approved == true || $drafts)] | order(_createdAt asc){
      "title": select($locale == "ar" => ar.title, en.title),
      "intro": select($locale == "ar" => ar.intro, en.intro)
    },
    "settings": *[_type == "siteSettings" && approved == true] | order(_updatedAt desc)[0]{whatsapp,email}
  }`, {locale,drafts})
}

export function editorial(locale: Locale) {
  if (import.meta.env.DEV) return fetchContent(locale)
  let request = requests.get(locale)
  if (!request) {
    request = fetchContent(locale)
    requests.set(locale, request)
  }
  return request
}

export const isArticle = (slug: string) => /^resources\/[a-z0-9-]+$/.test(slug)

export async function articleRoutes() {
  const [en, ar] = await Promise.all([editorial('en'), editorial('ar')])
  const arabic = new Set(ar.pages.filter(page => page.title && page.intro).map(page => page.slug))
  return [...new Set(en.pages
    .filter(page => isArticle(page.slug) && page.title && page.intro && arabic.has(page.slug))
    .map(page => page.slug))]
}
