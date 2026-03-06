'use client'

import { useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { Calendar, CheckSquare, GitCommit, MapPin, MessageSquare, Eye } from 'lucide-react'
import { Icon } from '@iconify/react'
import { FadeIn, StaggerGroup, StaggerItem, TextReveal, SpotlightCard } from '@/components/animation'
import { profileDummyData, type ActivityType } from '@/lib/profileDummyData'

const activityConfig: Record<ActivityType, { icon: React.ReactNode; color: string }> = {
  task: { icon: <CheckSquare size={15} />, color: 'success.main' },
  review: { icon: <Eye size={15} />, color: 'info.main' },
  comment: { icon: <MessageSquare size={15} />, color: 'warning.main' },
  commit: { icon: <GitCommit size={15} />, color: 'primary.main' }
}

// Each tab panel fades in fresh on every switch
function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? (
    <FadeIn direction='up' distance={12} transition={{ duration: 0.2 }}>
      <Box sx={{ pt: 3 }}>{children}</Box>
    </FadeIn>
  ) : null
}

export default function ProfilePage() {
  const [tab, setTab] = useState(0)
  const theme = useTheme()
  const data = profileDummyData
  const initials = data.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const cardStyle = {
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* ── Hero Card ── */}
      <FadeIn direction='up' distance={16} transition={{ duration: 0.3 }}>
        <Card sx={{ mb: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Cover gradient */}
          <Box
            sx={{
              height: 140,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}45 0%, ${theme.palette.secondary.main}45 100%)`
            }}
          />

          {/* Avatar + info */}
          <Box sx={{ px: 3, pb: 3 }}>
            <FadeIn direction='up' distance={14} transition={{ delay: 0.08, duration: 0.22 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: 'primary.main',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  border: `4px solid ${theme.palette.background.paper}`,
                  mt: -6,
                  mb: 1.5
                }}
              >
                {initials}
              </Avatar>
            </FadeIn>

            {/* Name — word reveal */}
            <TextReveal
              text={data.name}
              as='h5'
              splitBy='word'
              staggerDelay={0.06}
              delayChildren={0.18}
              duration={0.28}
              style={{ fontWeight: 700, fontSize: '1.5rem', margin: '0 0 2px' }}
            />

            {/* Title */}
            <FadeIn direction='up' distance={8} transition={{ delay: 0.28, duration: 0.18 }}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                {data.title}
              </Typography>
            </FadeIn>

            {/* Bio — staggered by sentence */}
            <TextReveal
              text='Passionate about building great user experiences that are both beautiful and functional.\nI focus on simplicity, usability, and accessibility in everything I create.'
              as='p'
              splitBy='word'
              staggerDelay={0.02}
              delayChildren={0.25}
              duration={0.42}
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.75,
                color: theme.palette.text.secondary,
                maxWidth: 540,
                margin: '6px 0 0'
              }}
            />

            {/* Meta row */}
            <FadeIn direction='up' distance={8} transition={{ delay: 0.54, duration: 0.18 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                  <MapPin size={14} />
                  <Typography variant='caption'>{data.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                  <Calendar size={14} />
                  <Typography variant='caption'>Joined {data.joinedDate}</Typography>
                </Box>
              </Box>
            </FadeIn>

            {/* Social icons — staggered */}
            <StaggerGroup
              staggerDelay={0.06}
              delayChildren={0.32}
              direction='up'
              distance={10}
              duration={0.28}
              style={{ display: 'flex', gap: '4px', marginTop: '12px' }}
            >
              <StaggerItem style={{ display: 'inline-flex' }}>
                <Tooltip title={`github.com/${data.social.github}`}>
                  <IconButton size='small'>
                    <Icon icon='mdi:github' width={16} />
                  </IconButton>
                </Tooltip>
              </StaggerItem>
              <StaggerItem style={{ display: 'inline-flex' }}>
                <Tooltip title={`linkedin.com/in/${data.social.linkedin}`}>
                  <IconButton size='small'>
                    <Icon icon='mdi:linkedin' width={16} />
                  </IconButton>
                </Tooltip>
              </StaggerItem>
              <StaggerItem style={{ display: 'inline-flex' }}>
                <Tooltip title={`@${data.social.twitter}`}>
                  <IconButton size='small'>
                    <Icon icon='mdi:twitter' width={16} />
                  </IconButton>
                </Tooltip>
              </StaggerItem>
              <StaggerItem style={{ display: 'inline-flex' }}>
                <Tooltip title={data.social.website}>
                  <IconButton size='small'>
                    <Icon icon='mdi:web' width={16} />
                  </IconButton>
                </Tooltip>
              </StaggerItem>
            </StaggerGroup>
          </Box>
        </Card>
      </FadeIn>

      {/* ── Tabs ── */}
      <FadeIn direction='up' distance={12} transition={{ delay: 0.15, duration: 0.22 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label='Overview' />
          <Tab label='Activity' />
          <Tab label='Preferences' />
        </Tabs>
      </FadeIn>

      {/* ── Overview ── */}
      <TabPanel value={tab} index={0}>
        <Grid container spacing={3}>
          {/* Skills — SpotlightCard with staggered chips */}
          <Grid size={{ xs: 12, md: 7 }}>
            <SpotlightCard spotlightSize={280} style={{ ...cardStyle }}>
              <Box sx={{ p: 2.5 }}>
                <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                  Skills
                </Typography>
                <StaggerGroup
                  staggerDelay={0.04}
                  delayChildren={0.08}
                  direction='up'
                  distance={8}
                  duration={0.2}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}
                >
                  {data.skills.map(skill => (
                    <StaggerItem key={skill} style={{ display: 'inline-flex' }}>
                      <Chip label={skill} size='small' variant='outlined' />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </Box>
            </SpotlightCard>
          </Grid>

          {/* Contact — SpotlightCard with staggered rows */}
          <Grid size={{ xs: 12, md: 5 }}>
            <SpotlightCard spotlightSize={220} style={{ ...cardStyle, height: '100%' }}>
              <Box sx={{ p: 2.5 }}>
                <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                  Contact & Links
                </Typography>
                <StaggerGroup staggerDelay={0.06} delayChildren={0.08} duration={0.3} direction='left' distance={12}>
                  {[
                    { label: 'Email', value: data.email },
                    { label: 'Location', value: data.location },
                    { label: 'Website', value: data.social.website },
                    { label: 'GitHub', value: `github.com/${data.social.github}` }
                  ].map(({ label, value }) => (
                    <StaggerItem key={label}>
                      <Box sx={{ mt: 1.25 }}>
                        <Typography variant='caption' color='text.disabled' display='block'>
                          {label}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {value}
                        </Typography>
                      </Box>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </Box>
            </SpotlightCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ── Activity ── */}
      <TabPanel value={tab} index={1}>
        <Card>
          <CardContent sx={{ p: '0 !important' }}>
            <StaggerGroup staggerDelay={0.05} delayChildren={0.04} direction='left' distance={16}>
              {data.recentActivity.map((item, index) => {
                const config = activityConfig[item.type]
                return (
                  <StaggerItem key={item.id}>
                    <Box sx={{ display: 'flex', gap: 2, px: 2.5, py: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: `${config.color}18`,
                          color: config.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: 0.25
                        }}
                      >
                        {config.icon}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant='body2' fontWeight={600} noWrap>
                            {item.title}
                          </Typography>
                          <Typography variant='caption' color='text.disabled' sx={{ flexShrink: 0 }}>
                            {item.time}
                          </Typography>
                        </Box>
                        <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 0.25 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                    {index < data.recentActivity.length - 1 && <Divider />}
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          </CardContent>
        </Card>
      </TabPanel>

      {/* ── Preferences ── */}
      <TabPanel value={tab} index={2}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FadeIn direction='up' distance={12}>
              <Card>
                <CardContent>
                  <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                    Localization
                  </Typography>
                  <StaggerGroup staggerDelay={0.07} delayChildren={0.08} direction='up' distance={8}>
                    {[
                      { label: 'Language', value: data.preferences.language },
                      { label: 'Timezone', value: data.preferences.timezone }
                    ].map(({ label, value }, index) => (
                      <StaggerItem key={label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                          <Typography variant='body2' color='text.secondary'>
                            {label}
                          </Typography>
                          <Typography variant='body2' fontWeight={500}>
                            {value}
                          </Typography>
                        </Box>
                        {index === 0 && <Divider />}
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </CardContent>
              </Card>
            </FadeIn>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FadeIn direction='up' distance={12} transition={{ delay: 0.07 }}>
              <Card>
                <CardContent>
                  <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                    Notifications
                  </Typography>
                  <StaggerGroup staggerDelay={0.07} delayChildren={0.08} direction='up' distance={8}>
                    {[
                      {
                        label: 'Email Notifications',
                        sub: 'Receive updates via email',
                        key: 'emailNotifications' as const
                      },
                      { label: 'Push Notifications', sub: 'Browser push alerts', key: 'pushNotifications' as const }
                    ].map(({ label, sub, key }, index) => (
                      <StaggerItem key={key}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                          <Box>
                            <Typography variant='body2'>{label}</Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {sub}
                            </Typography>
                          </Box>
                          <Switch defaultChecked={data.preferences[key]} size='small' />
                        </Box>
                        {index === 0 && <Divider />}
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </CardContent>
              </Card>
            </FadeIn>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  )
}
