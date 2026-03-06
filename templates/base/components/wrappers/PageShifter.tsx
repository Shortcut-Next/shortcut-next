'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useTheme } from '@mui/material'
import { usePathname } from 'next/navigation'

const variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
}

const PageShifter = ({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  const pathname = usePathname()

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={pathname}
        initial='initial'
        animate='enter'
        exit='exit'
        variants={variants}
        style={{ backgroundColor: theme.palette.background.default }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageShifter
