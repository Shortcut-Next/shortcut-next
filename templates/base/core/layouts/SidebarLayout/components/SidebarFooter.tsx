'use client'

import type { ReactNode } from 'react'
import { Box, Divider } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useSidebar } from '../SidebarContext'
import ProfileButton from './ProfileButton'

interface SidebarFooterProps {
  footer?: ReactNode
}

export default function SidebarFooter({ footer }: SidebarFooterProps) {
  const { isCollapsed } = useSidebar()

  // Custom footer: only shown when expanded (original behavior)
  if (footer) {
    return (
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key='sidebar-footer'
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 180,
              opacity: 1,
              transition: { height: { duration: 0.25, delay: 0.3 }, opacity: { duration: 0.2, delay: 0.35 } }
            }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.2 }, opacity: { duration: 0.15 } } }}
            style={{ overflow: 'hidden', flexShrink: 0 }}
          >
            <Divider />
            <Box sx={{ pt: 1 }}>{footer}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Default: always visible, adapts to collapsed state
  return <ProfileButton />
}
