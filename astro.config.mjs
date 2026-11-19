import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'

import {leadPreview} from './server/lead-preview.mjs'

const previewApi = {
  name:'ry-preview-leads',
  configureServer(server) {
    if (process.env.RY_PUBLIC_RELEASE !== 'true') server.middlewares.use(leadPreview)
  },
}

export default defineConfig({
  site: process.env.SITE_URL || 'https://rysetup.com',
  trailingSlash: 'always',
  vite: { plugins: [tailwind(), previewApi] },
})
