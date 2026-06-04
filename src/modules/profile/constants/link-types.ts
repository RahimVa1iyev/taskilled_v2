export const LINK_TYPES = {
  LINKEDIN:   'linkedin',
  GITHUB:     'github',
  X:          'x',
  YOUTUBE:    'youtube',
  FACEBOOK:   'facebook',
  INSTAGRAM:  'instagram',
  TIKTOK:     'tiktok',
  PINTEREST:  'pinterest',
  REDDIT:     'reddit',
  SHORT_LINK: 'short_link',
  BLOG:       'blog',
} as const

export type LinkType = typeof LINK_TYPES[keyof typeof LINK_TYPES]
