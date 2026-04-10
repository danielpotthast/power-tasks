import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/components/layout/AppProvider'
import { AppHeader } from '@/components/layout/AppHeader'
import { Toaster } from '@/components/ui/sonner'
import {ReactNode} from "react";

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const basePath = process.env.NEXT_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: 'WauFlow',
  description: 'Aufgaben passend zu deiner Power.',
  // manifest is auto-linked via src/app/manifest.ts
  icons: { icon: `${basePath}/favicon.svg` },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background">
        <AppProvider>
          <AppHeader />
          <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
            {children}
          </main>
        </AppProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
