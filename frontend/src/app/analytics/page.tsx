"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSpinner, FaExclamationTriangle, FaChartLine, FaUsers, FaGlobe, FaHeart, FaShare, FaEye } from "react-icons/fa"
import { analyticsApi, ApiError } from "@/lib/api"

interface AnalyticsMetrics {
  total_views: number
  total_likes: number
  total_shares: number
  avg_engagement: number
  growth_percentage: number
  time_range: string
}

interface TopReel {
  title: string
  views: number
  likes: number
  engagement: number
  posted_at?: string
}

interface AudienceInsights {
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
}

interface ChartData {
  date: string
  views: number
  likes: number
  posts: number
  engagement: number
}

export default function AnalyticsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [topReels, setTopReels] = useState<TopReel[]>([])
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsights | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [metricsData, topReelsData, audienceData, chartDataResponse] = await Promise.all([
          analyticsApi.getMetrics(timeRange),
          analyticsApi.getTopReels(),
          analyticsApi.getAudienceInsights(),
          analyticsApi.getPerformanceChart(timeRange)
        ])
        
        setMetrics(metricsData)
        setTopReels(topReelsData.top_reels)
        setAudienceInsights(audienceData)
        setChartData(chartDataResponse.chart_data)
        setError(null)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Erro ao carregar dados: ${err.message}`)
        } else {
          setError('Erro desconhecido ao carregar dados')
        }
        console.error('Error fetching analytics data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-all duration-1000 ${
        isDarkMode ? 'bg-gradient-hero-dark' : 'bg-gradient-hero'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-white mx-auto mb-4" />
            <p className="text-white/80">Carregando analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-all duration-1000 ${
        isDarkMode ? 'bg-gradient-hero-dark' : 'bg-gradient-hero'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isDarkMode ? 'bg-gradient-hero-dark' : 'bg-gradient-hero'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Início</a>
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">Dashboard</a>
            <a href="/profiles" className="text-white/80 hover:text-white transition-colors">Perfis</a>
            <a href="/reels" className="text-white/80 hover:text-white transition-colors">Reels</a>
            <a href="/analytics" className="text-white font-medium">Analytics</a>
          </nav>
        </div>
        <button
          onClick={toggleDarkMode}
          className="glass text-white px-6 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Analytics & Insights 📊</h2>
          <p className="text-white/80 text-lg">Acompanhe o desempenho dos seus vídeos</p>
        </div>

        {/* Time Range Selector */}
        <motion.div 
          className="mb-8 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === "7d" 
                ? "bg-purple-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            7 Dias
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === "30d" 
                ? "bg-purple-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            30 Dias
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === "90d" 
                ? "bg-purple-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            90 Dias
          </button>
          <button
            onClick={() => setTimeRange("1y")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === "1y" 
                ? "bg-purple-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            1 Ano
          </button>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Visualizações</p>
                <p className="text-3xl font-bold text-white">{(metrics?.total_views || 0).toLocaleString('en-US')}</p>
              </div>
              <FaEye className="text-4xl text-blue-400" />
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <span className="text-sm">+{metrics?.growth_percentage.toFixed(1)}% crescimento</span>
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Curtidas</p>
                <p className="text-3xl font-bold text-white">{(metrics?.total_likes || 0).toLocaleString('en-US')}</p>
              </div>
              <FaHeart className="text-4xl text-red-400" />
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Compartilhamentos</p>
                <p className="text-3xl font-bold text-white">{(metrics?.total_shares || 0).toLocaleString('en-US')}</p>
              </div>
              <FaShare className="text-4xl text-green-400" />
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Engajamento Médio</p>
                <p className="text-3xl font-bold text-white">{metrics?.avg_engagement.toFixed(1) || 0}%</p>
              </div>
              <FaChartLine className="text-4xl text-purple-400" />
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Período</p>
                <p className="text-lg font-bold text-white">{timeRange.toUpperCase()}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </motion.div>
        </div>

        {/* Top Reels */}
        {topReels.length > 0 && (
          <motion.div 
            className="mb-8 glass rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">🏆 Top Reels</h3>
            <div className="space-y-4">
              {topReels.slice(0, 5).map((reel, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{reel.title}</h4>
                      <p className="text-white/70 text-sm">
                        {reel.posted_at ? formatTimeAgo(reel.posted_at) : 'Data não disponível'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="text-white/70">Views</p>
                      <p className="text-white font-semibold">{reel.views.toLocaleString('en-US')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70">Likes</p>
                      <p className="text-white font-semibold">{reel.likes.toLocaleString('en-US')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70">Engajamento</p>
                      <p className="text-white font-semibold">{reel.engagement}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Audience Insights */}
        {audienceInsights && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaGlobe className="mr-3 text-blue-400" />
                Demografia
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">País Principal</p>
                  <p className="text-white font-semibold">{audienceInsights.demographics.top_country}</p>
                  <p className="text-white/60 text-sm">{audienceInsights.demographics.country_percentage}% da audiência</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Faixa Etária</p>
                  <p className="text-white font-semibold">{audienceInsights.demographics.age_range}</p>
                  <p className="text-white/60 text-sm">{audienceInsights.demographics.age_percentage}% da audiência</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Dispositivo</p>
                  <p className="text-white font-semibold">{audienceInsights.demographics.device}</p>
                  <p className="text-white/60 text-sm">{audienceInsights.demographics.device_percentage}% da audiência</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaChartLine className="mr-3 text-green-400" />
                Padrões de Engajamento
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">Melhor Horário</p>
                  <p className="text-white font-semibold">{audienceInsights.engagement_patterns.best_posting_time}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Melhor Dia</p>
                  <p className="text-white font-semibold">{audienceInsights.engagement_patterns.best_day}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Tempo Médio de Visualização</p>
                  <p className="text-white font-semibold">{audienceInsights.engagement_patterns.avg_watch_time}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Taxa de Conclusão</p>
                  <p className="text-white font-semibold">{audienceInsights.engagement_patterns.completion_rate}%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaUsers className="mr-3 text-purple-400" />
                Performance de Conteúdo
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">Tipo Mais Engajante</p>
                  <p className="text-white font-semibold">{audienceInsights.content_performance.most_engaging_type}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Taxa Média de Engajamento</p>
                  <p className="text-white font-semibold">{audienceInsights.content_performance.avg_engagement_rate}%</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Limite Viral</p>
                  <p className="text-white font-semibold">{audienceInsights.content_performance.viral_threshold.toLocaleString('en-US')} views</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Hashtags Populares</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {audienceInsights.content_performance.top_hashtags.map((hashtag, index) => (
                      <span key={index} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}