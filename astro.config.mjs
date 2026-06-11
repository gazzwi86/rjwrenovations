import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://rjwrenovations.co.uk',
  integrations: [react(), sitemap()],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
})
