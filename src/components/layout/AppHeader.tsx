'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { History, Settings } from 'lucide-react'
import { DachshundIcon } from '@/components/icons/DachshundIcon'
import { EnergyBadge } from '@/components/energy/EnergyBadge'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/history', label: t.nav.history, icon: History },
  { href: '/settings', label: t.nav.settings, icon: Settings },
]

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo → Link zur Startseite */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <DachshundIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-base">{t.app.name}</span>
          </Link>

          {/* Nav + Energy Badge */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                )
              })}
            </nav>

            <EnergyBadge />
          </div>
        </div>
      </div>
    </header>
  )
}
