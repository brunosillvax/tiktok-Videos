const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`)
  }

  return response.json()
}

// Dashboard API
export const dashboardApi = {
  getStats: () => apiRequest<{
    total_videos: number
    active_profiles: number
    posts_today: number
    success_rate: number
    posts_yesterday: number
    monthly_growth: number
  }>('/dashboard/stats'),

  getRecentActivity: () => apiRequest<{
    activity: Array<{
      id: number
      level: string
      message: string
      created_at: string
      context: any
    }>
  }>('/dashboard/recent-activity'),

  getTopPerformingReels: () => apiRequest<{
    top_reels: Array<{
      title: string
      views: number
      likes: number
      engagement: number
      posted_at?: string
    }>
  }>('/dashboard/top-performing-reels')
}

// Profiles API
export const profilesApi = {
  getProfiles: () => apiRequest<{
    profiles: Array<{
      id: number
      username: string
      display_name: string
      profile_picture_url?: string
      is_active: boolean
      last_checked_at?: string
      last_posted_at?: string
      check_interval_minutes: number
      posts_count: number
      created_at: string
    }>
  }>('/profiles'),

  getStats: () => apiRequest<{
    total_profiles: number
    active_profiles: number
    total_posts: number
  }>('/profiles/stats')
}

// Reels API
export const reelsApi = {
  getReels: (status?: string) => {
    const params = status ? `?status=${status}` : ''
    return apiRequest<{
      reels: Array<{
        id: number
        instagram_reel_code: string
        instagram_reel_url: string
        caption: string
        status: string
        video_file_path?: string
        tiktok_post_id?: string
        tiktok_post_url?: string
        posted_at?: string
        created_at: string
        profile?: {
          username: string
          display_name: string
        }
        analytics?: {
          views: number
          likes: number
          engagement: number
        }
      }>
    }>(`/reels${params}`)
  },

  getStats: () => apiRequest<{
    total_reels: number
    downloaded_reels: number
    posted_reels: number
    total_views: number
    total_likes: number
  }>('/reels/stats'),

  getTopPerforming: () => apiRequest<{
    top_reels: Array<{
      title: string
      views: number
      likes: number
      engagement: number
      posted_at?: string
    }>
  }>('/reels/top-performing')
}

// Analytics API
export const analyticsApi = {
  getMetrics: (timeRange: string = '7d') => apiRequest<{
    total_views: number
    total_likes: number
    total_shares: number
    avg_engagement: number
    growth_percentage: number
    time_range: string
  }>(`/analytics/metrics?time_range=${timeRange}`),

  getTopReels: () => apiRequest<{
    top_reels: Array<{
      title: string
      views: number
      likes: number
      engagement: number
      posted_at?: string
    }>
  }>('/analytics/top-reels'),

  getAudienceInsights: () => apiRequest<{
    demographics: {
      top_country: string
      country_percentage: number
      age_range: string
      age_percentage: number
      device: string
      device_percentage: number
    }
    engagement_patterns: {
      best_posting_time: string
      best_day: string
      avg_watch_time: string
      completion_rate: number
    }
    content_performance: {
      most_engaging_type: string
      avg_engagement_rate: number
      viral_threshold: number
      top_hashtags: string[]
    }
  }>('/analytics/audience-insights'),

  getPerformanceChart: (timeRange: string = '7d') => apiRequest<{
    chart_data: Array<{
      date: string
      views: number
      likes: number
      posts: number
      engagement: number
    }>
  }>(`/analytics/performance-chart?time_range=${timeRange}`)
}

export { ApiError }
