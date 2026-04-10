import type { NextConfig } from 'next'

const basePath = process.env.NEXT_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  allowedDevOrigins: ['10.30.0.13'],
}

export default nextConfig
