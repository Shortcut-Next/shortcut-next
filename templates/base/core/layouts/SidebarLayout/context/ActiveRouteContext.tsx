'use client'

import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { SidebarNavItems } from '@/core/layouts/types'
import { SidebarUtils } from '../utils/SidebarUtils'

const ActiveRouteContext = createContext<string | null>(null)

interface ActiveRouteProviderProps {
  children: ReactNode
  navItems: SidebarNavItems
}

export function ActiveRouteProvider({ children, navItems }: ActiveRouteProviderProps) {
  const pathname = usePathname()
  const activePath = useMemo(() => SidebarUtils.findActivePath(navItems, pathname), [navItems, pathname])

  return <ActiveRouteContext.Provider value={activePath}>{children}</ActiveRouteContext.Provider>
}

export const useActiveRoute = () => useContext(ActiveRouteContext)

export default ActiveRouteContext
