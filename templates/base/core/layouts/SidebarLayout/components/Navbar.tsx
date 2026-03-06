'use client'

import { useState, useEffect } from 'react'
import { alpha, Box, IconButton, Menu, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { Languages, Menu as MenuIcon } from 'lucide-react'
import ThemeToggle from '@/components/common/ThemeToggle'
import useLanguage from '@/core/hooks/useLanguage'
import type { Locale } from '@/core/configs/i18n'
import { useSidebar } from '../SidebarContext'
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../Sidebar'

export const NAVBAR_HEIGHT = 52

interface NavbarProps {
  appBarRight?: React.ReactNode
}

export default function Navbar({ appBarRight }: NavbarProps) {
  const theme = useTheme()
  const { isCollapsed, toggleMobileOpen } = useSidebar()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { language, handleLanguageChange } = useLanguage()
  const isRtl = language === 'ar'
  const [scrolled, setScrolled] = useState(false)
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sidebarOffset = isMobile ? 0 : isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <Box
      component='header'
      // left/right use style (not sx) to bypass MUI's RTL auto-swap,
      // matching the same pattern used in Sidebar.tsx's Framer Motion style prop.
      style={{
        left: isRtl ? 0 : sidebarOffset,
        right: isRtl ? sidebarOffset : 0,
        // All transitions here because inline style takes precedence over sx transition
        transition: [
          'left 0.3s cubic-bezier(0.4,0,0.2,1)',
          'right 0.3s cubic-bezier(0.4,0,0.2,1)',
          'background-color 0.25s ease',
          'border-color 0.25s ease'
        ].join(', ')
      }}
      sx={{
        position: 'fixed',
        top: 0,
        height: NAVBAR_HEIGHT,
        zIndex: theme.zIndex.appBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Force LTR internally so icons always sit at the physical right edge
        // regardless of document direction (mirrors sidebar-on-right in RTL).
        direction: 'ltr',
        px: 2,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        bgcolor: scrolled ? alpha(theme.palette.background.paper, 0.75) : 'transparent',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'divider' : 'transparent'
      }}
    >
      {/* Left — hamburger on mobile, empty spacer on desktop */}
      {isMobile ? (
        <IconButton onClick={toggleMobileOpen} size='small' sx={{ color: 'text.secondary' }}>
          <MenuIcon size={18} />
        </IconButton>
      ) : (
        <Box />
      )}

      {/* Right — custom slot + theme toggle + language picker */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {appBarRight}

        <ThemeToggle />

        <Tooltip title='Language'>
          <IconButton
            size='small'
            onClick={e => setLangAnchor(e.currentTarget)}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'action.hover' } }}
          >
            <Languages size={18} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { elevation: 3, sx: { minWidth: 130, mt: 0.5, borderRadius: 2 } } }}
        >
          <MenuItem
            selected={language === 'en'}
            onClick={() => {
              handleLanguageChange('en' as Locale)
              setLangAnchor(null)
            }}
          >
            English
          </MenuItem>
          <MenuItem
            selected={language === 'ar'}
            onClick={() => {
              handleLanguageChange('ar' as Locale)
              setLangAnchor(null)
            }}
          >
            العربية
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
