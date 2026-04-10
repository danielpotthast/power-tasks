import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_BASE_PATH ?? ''

  return {
    name: 'WauFlow',
    short_name: 'WauFlow',
    description: 'Aufgaben passend zu deiner Power.',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: `${basePath}/favicon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
