export type ActivityType = 'task' | 'review' | 'comment' | 'commit'

export interface ProfileActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
}

export interface ProfileData {
  name: string
  email: string
  title: string
  bio: string
  location: string
  joinedDate: string
  social: {
    github: string
    linkedin: string
    twitter: string
    website: string
  }
  skills: string[]
  recentActivity: ProfileActivity[]
  preferences: {
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
  }
}

export const profileDummyData: ProfileData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  title: 'Senior Product Designer',
  bio: 'Passionate about building great user experiences that are both beautiful and functional. I focus on simplicity, usability, and accessibility in everything I create.',
  location: 'San Francisco, CA',
  joinedDate: 'January 2023',
  social: {
    github: 'alexjohnson',
    linkedin: 'alexjohnson',
    twitter: 'alexjohnson',
    website: 'alexjohnson.design'
  },
  skills: ['UI/UX Design', 'React', 'TypeScript', 'Figma', 'Node.js', 'GraphQL'],
  recentActivity: [
    {
      id: '1',
      type: 'task',
      title: 'Completed onboarding flow redesign',
      description: 'Redesigned the user onboarding to reduce drop-off rate by 40%.',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'review',
      title: 'Reviewed PR: Dashboard v2',
      description: 'Left 8 comments and approved the new dashboard layout.',
      time: 'Yesterday'
    },
    {
      id: '3',
      type: 'comment',
      title: 'Commented on Issue #1023',
      description: 'Added context about the accessibility requirements for the new modal.',
      time: '2 days ago'
    },
    {
      id: '4',
      type: 'commit',
      title: 'Pushed to main: profile-page',
      description: 'Added profile page with tabs, activity feed, and preferences.',
      time: '3 days ago'
    },
    {
      id: '5',
      type: 'task',
      title: 'Created design system tokens',
      description: 'Established color, spacing, and typography tokens used across the app.',
      time: '1 week ago'
    }
  ],
  preferences: {
    language: 'English',
    timezone: 'America/Los_Angeles',
    emailNotifications: true,
    pushNotifications: false
  }
}
