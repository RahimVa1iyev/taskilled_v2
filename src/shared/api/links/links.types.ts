export type LinkType =
  | 'linkedin'
  | 'github'
  | 'x'
  | 'youtube'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'pinterest'
  | 'reddit'
  | 'short_link'
  | 'blog'

export interface LinkResponse {
  id: number
  url: string
  linkType: string
  createdAt: string
  updatedAt: string | null
}

export interface LinkCreateRequest {
  url: string
  linkType?: LinkType
}
