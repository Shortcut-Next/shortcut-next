'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import { SidebarProvider, useSidebar } from './SidebarContext'
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar'
import { ActiveRouteProvider } from './ActiveRouteContext'
import { FavoritesProvider } from './FavoritesContext'
import type { SidebarNavItems } from '@/core/layouts/types'
import useLanguage from '@/core/hooks/useLanguage'
import CommandPalette from './components/CommandPalette'
import Navbar, { NAVBAR_HEIGHT } from './components/Navbar'

interface SidebarLayoutProps {
  children: ReactNode
  navItems: SidebarNavItems
  dynamicNavItems?: SidebarNavItems
  logo?: ReactNode
  appName?: string
  footer?: ReactNode
  appBarRight?: ReactNode
}

function SidebarLayoutInner({
  children,
  navItems,
  dynamicNavItems,
  logo,
  appName,
  footer,
  appBarRight
}: SidebarLayoutProps) {
  const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { language } = useLanguage()
  const isRtl = language === 'ar'
  const mergedNavItems = [...navItems, ...(dynamicNavItems ?? [])]

  const [paletteOpen, setPaletteOpen] = useState(false)

  // Reset sidebar states when switching between mobile and desktop
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false)
    } else {
      setIsMobileOpen(false)
    }
  }, [isMobile, setIsCollapsed, setIsMobileOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <ActiveRouteProvider navItems={mergedNavItems}>
      <Stack
        direction='row'
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <FavoritesProvider>
          <Sidebar navItems={mergedNavItems} logo={logo} appName={appName} footer={footer} />
        </FavoritesProvider>

        <Navbar appBarRight={appBarRight} />

        <Box
          component='main'
          // Margins use style (not sx) to bypass MUI's RTL auto-swap,
          // same reason as Navbar's left/right.
          style={{
            marginLeft: isMobile || isRtl ? 0 : sidebarWidth,
            marginRight: isMobile || !isRtl ? 0 : sidebarWidth,
            transition: `${isRtl ? 'margin-right' : 'margin-left'} 300ms cubic-bezier(0.4, 0, 0.2, 1)`
          }}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            pt: `${NAVBAR_HEIGHT + 16}px`,
            px: 3
          }}
        >
          {children}
        </Box>
      </Stack>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} navItems={mergedNavItems} />
    </ActiveRouteProvider>
  )
}

export default function SidebarLayout(props: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <SidebarLayoutInner {...props} />
    </SidebarProvider>
  )
}
