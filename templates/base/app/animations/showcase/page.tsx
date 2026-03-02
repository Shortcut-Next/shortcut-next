'use client'

import { Container, Typography, Box, Stack, Paper, Chip } from '@mui/material'
import { useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import FadeIn from '@/components/animation/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/animation/StaggerGroup'
import MagneticButton from '@/components/animation/MagneticButton'
import ParallaxSection from '@/components/animation/ParallaxSection'
import TiltCard from '@/components/animation/TiltCard'
import SpotlightCard from '@/components/animation/SpotlightCard'
import TextReveal from '@/components/animation/TextReveal'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const staggerCards = [
  { icon: '⚡', title: 'Fast', body: 'GPU-composited transforms, zero layout thrash' },
  { icon: '🧩', title: 'Composable', body: 'Nest and combine any animation components' },
  { icon: '♿', title: 'Accessible', body: 'Respects prefers-reduced-motion automatically' },
  { icon: '🔷', title: 'Typed', body: 'Full TypeScript props with JSDoc examples' },
  { icon: '🎨', title: 'Themed', body: 'Reads MUI palette — light & dark mode ready' },
  { icon: '🔧', title: 'Flexible', body: 'All Framer Motion / GSAP props pass through' }
]

const tiltCards = [
  { title: 'Default Tilt', subtitle: 'maxRotation=8, no glare', maxRotation: 8, glare: false },
  { title: 'With Glare', subtitle: 'maxRotation=8, glare=true', maxRotation: 8, glare: true },
  { title: 'Aggressive', subtitle: 'maxRotation=18, glare=true', maxRotation: 18, glare: true }
]

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function DemoSection({
  badge,
  title,
  description,
  children
}: {
  badge: string
  title: string
  description: string
  children: React.ReactNode
}) {
  const theme = useTheme()

  return (
    <Box component='section' sx={{ py: 10 }}>
      <FadeIn once={false}>
        <Stack spacing={1} sx={{ mb: 6 }}>
          <Chip label={badge} size='small' color='primary' sx={{ width: 'fit-content', fontWeight: 600 }} />
          <Typography variant='h4' fontWeight={700}>
            {title}
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 560 }}>
            {description}
          </Typography>
        </Stack>
      </FadeIn>

      {children}

      <Box sx={{ mt: 10, borderBottom: `1px solid ${theme.palette.divider}` }} />
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnimationsShowcasePage() {
  const theme = useTheme()
  const primary = theme.palette.primary.main
  const secondary = theme.palette.secondary.main

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth='lg' sx={{ py: 10 }}>
        {/* ---------------------------------------------------------------- */}
        {/* Page header                                                       */}
        {/* ---------------------------------------------------------------- */}
        <FadeIn direction='down' once={false}>
          <Stack spacing={2} sx={{ mb: 4, textAlign: 'center', alignItems: 'center' }}>
            <Chip label='Animation Library' color='primary' />
            <Typography variant='h2' fontWeight={800} sx={{ lineHeight: 1.15 }}>
              Animation Components
            </Typography>
            <Typography variant='h6' color='text.secondary' sx={{ maxWidth: 600, fontWeight: 400 }}>
              A set of reusable, accessible animation wrappers built with Framer Motion and GSAP. Scroll down to see
              each component in action.
            </Typography>
          </Stack>
        </FadeIn>

        {/* ---------------------------------------------------------------- */}
        {/* 1 · FadeIn                                                        */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='01 · FadeIn'
          title='FadeIn'
          description='Wraps any element and fades + slides it into view when it enters the viewport. Control direction, distance, and timing via the transition prop.'
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            {(['up', 'left', 'right'] as const).map((dir, i) => (
              <FadeIn key={dir} direction={dir} once={false} transition={{ delay: i * 0.12 }} style={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    bgcolor: alpha(primary, 0.04)
                  }}
                >
                  <Typography variant='overline' color='primary'>
                    direction=&quot;{dir}&quot;
                  </Typography>
                  <Typography variant='h6' sx={{ mt: 0.5 }}>
                    Fade from {dir}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                    Scroll past, then back up to replay.
                  </Typography>
                </Paper>
              </FadeIn>
            ))}
          </Stack>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* 2 · StaggerGroup                                                  */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='02 · StaggerGroup'
          title='StaggerGroup & StaggerItem'
          description='Orchestrates a sequence of entrance animations. The parent controls stagger delay and direction; each child inherits via React Context.'
        >
          <StaggerGroup
            staggerDelay={0.1}
            direction='up'
            distance={24}
            once={false}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 16
            }}
          >
            {staggerCards.map(card => (
              <StaggerItem key={card.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: primary }
                  }}
                >
                  <Typography fontSize={28}>{card.icon}</Typography>
                  <Typography variant='subtitle1' fontWeight={700} sx={{ mt: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                    {card.body}
                  </Typography>
                </Paper>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* 3 · MagneticButton                                                */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='03 · MagneticButton'
          title='MagneticButton'
          description='A GSAP-powered button that subtly shifts toward the cursor on hover and springs back with elastic physics on mouse leave.'
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems='center' justifyContent='center'>
            <MagneticButton>Default (0.18)</MagneticButton>

            <MagneticButton strength={0.4} color='secondary'>
              Strong Pull (0.4)
            </MagneticButton>

            <MagneticButton as='a' href='#' returnEase='elastic.out(1.5, 0.3)' color='primary' variant='outlined'>
              Anchor + Elastic
            </MagneticButton>
          </Stack>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* 4 · ParallaxSection                                               */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='04 · ParallaxSection'
          title='ParallaxSection'
          description='Wraps content and offsets it relative to the page scroll, creating depth. Positive speed moves slower than scroll; negative moves in reverse.'
        >
          <Stack spacing={3}>
            {([0.4, -0.3] as const).map(speed => (
              <Box
                key={speed}
                sx={{
                  height: 200,
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'relative'
                }}
              >
                <ParallaxSection speed={speed}>
                  <Box
                    sx={{
                      height: 350,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${alpha(primary, 0.15)}, ${alpha(secondary, 0.15)})`
                    }}
                  >
                    <Stack alignItems='center' spacing={1}>
                      <Typography variant='overline' color='primary' fontWeight={700}>
                        speed={speed}
                      </Typography>
                      <Typography variant='h5' fontWeight={700}>
                        {speed > 0 ? 'Slower than scroll (depth)' : 'Reverse parallax'}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Scroll up and down to see the effect
                      </Typography>
                    </Stack>
                  </Box>
                </ParallaxSection>
              </Box>
            ))}
          </Stack>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* 5 · TiltCard                                                      */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='05 · TiltCard'
          title='TiltCard'
          description='3D perspective tilt driven by cursor position within the card. Spring physics smooth the rotation. Optional glare overlay reinforces the holographic feel.'
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent='center'>
            {tiltCards.map(({ title, subtitle, maxRotation, glare }) => (
              <TiltCard
                key={title}
                maxRotation={maxRotation}
                glare={glare}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: alpha(primary, 0.05),
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant='h6' fontWeight={700}>
                    {title}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {subtitle}
                  </Typography>
                </Box>
              </TiltCard>
            ))}
          </Stack>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* 6 · SpotlightCard                                                 */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='06 · SpotlightCard'
          title='SpotlightCard'
          description='A radial spotlight gradient follows the cursor within the card bounds. Move your mouse over each card to see the effect. Spotlight color is derived from the MUI theme by default.'
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <SpotlightCard
              spotlightSize={280}
              style={{
                flex: 1,
                borderRadius: 16,
                border: `1px solid ${theme.palette.divider}`,
                padding: 32,
                minHeight: 200
              }}
            >
              <Stack spacing={1}>
                <Typography variant='overline' color='primary'>
                  Default color
                </Typography>
                <Typography variant='h6' fontWeight={700}>
                  Theme-derived spotlight
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Uses alpha(primary.main, 0.12) from the active MUI theme. Switches automatically with dark mode.
                </Typography>
              </Stack>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor={`rgba(251, 191, 36, 0.18)`}
              spotlightSize={320}
              style={{
                flex: 1,
                borderRadius: 16,
                border: `1px solid ${theme.palette.divider}`,
                padding: 32,
                minHeight: 200,
                background: theme.palette.mode === 'dark' ? '#111' : '#1a1a2e',
                color: '#fff'
              }}
            >
              <Stack spacing={1}>
                <Typography variant='overline' sx={{ color: '#fbbf24' }}>
                  Custom amber
                </Typography>
                <Typography variant='h6' fontWeight={700}>
                  spotlightColor=&quot;amber&quot;
                </Typography>
                <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Pass any valid CSS color string — hex, rgba, hsl — as the spotlightColor prop.
                </Typography>
              </Stack>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor={alpha(secondary, 0.2)}
              spotlightSize={250}
              style={{
                flex: 1,
                borderRadius: 16,
                border: `1px solid ${alpha(secondary, 0.3)}`,
                padding: 32,
                minHeight: 200
              }}
            >
              <Stack spacing={1}>
                <Typography variant='overline' color='secondary'>
                  Secondary palette
                </Typography>
                <Typography variant='h6' fontWeight={700}>
                  Smaller spotlight
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  spotlightSize={250} creates a tighter, more focused glow effect.
                </Typography>
              </Stack>
            </SpotlightCard>
          </Stack>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* 7 · TextReveal                                                    */}
        {/* ---------------------------------------------------------------- */}
        <DemoSection
          badge='07 · TextReveal'
          title='TextReveal'
          description='Splits text into letters, words, or lines and reveals each unit from beneath an overflow clip with a staggered upward slide — the same technique used in the CTA heading.'
        >
          <Stack spacing={6}>
            {/* Word mode */}
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(primary, 0.04)
              }}
            >
              <Typography variant='overline' color='primary' sx={{ mb: 2, display: 'block' }}>
                splitBy=&quot;word&quot; (default)
              </Typography>
              <TextReveal
                text='Your next project starts here'
                as='h3'
                splitBy='word'
                staggerDelay={0.08}
                once={false}
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  margin: 0,
                  lineHeight: 1.2
                }}
              />
            </Box>

            {/* Letter mode */}
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(primary, 0.04)
              }}
            >
              <Typography variant='overline' color='primary' sx={{ mb: 2, display: 'block' }}>
                splitBy=&quot;letter&quot;
              </Typography>
              <TextReveal
                text='Scaffold.'
                as='h3'
                splitBy='letter'
                staggerDelay={0.04}
                duration={0.5}
                once={false}
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}
              />
            </Box>

            {/* Line mode */}
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(primary, 0.04)
              }}
            >
              <Typography variant='overline' color='primary' sx={{ mb: 2, display: 'block' }}>
                splitBy=&quot;line&quot;
              </Typography>
              <TextReveal
                text={'Build faster.\nShip with confidence.\nScale without limits.'}
                as='p'
                splitBy='line'
                staggerDelay={0.14}
                duration={0.7}
                once={false}
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  margin: 0,
                  lineHeight: 1.6
                }}
              />
            </Box>
          </Stack>
        </DemoSection>

        {/* ---------------------------------------------------------------- */}
        {/* Footer note                                                       */}
        {/* ---------------------------------------------------------------- */}
        <FadeIn once={false} direction='up'>
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 4,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              bgcolor: alpha(primary, 0.04)
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              All components respect{' '}
              <Typography component='span' variant='body2' color='primary' fontWeight={600}>
                prefers-reduced-motion
              </Typography>{' '}
              and render as plain wrappers when the user has disabled animations in their OS settings. Import from{' '}
              <Typography component='span' variant='body2' sx={{ fontFamily: 'monospace' }} color='primary'>
                @/components/animation
              </Typography>
              .
            </Typography>
          </Paper>
        </FadeIn>
      </Container>
    </Box>
  )
}
