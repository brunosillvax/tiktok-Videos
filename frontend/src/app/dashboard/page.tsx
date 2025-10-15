"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSpinner, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"
import { dashboardApi, ApiError } from "@/lib/api"

interface DashboardStats {
  total_videos: number
  active_profiles: number
  posts_today: number
  success_rate: number
  posts_yesterday: number
  monthly_growth: number
}

interface ActivityItem {
  id: number
  level: string
  message: string
  created_at: string
  context: any
}

interface TopReel {
  title: string
  views: number
  likes: number
  engagement: number
  posted_at?: string
}

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [topReels, setTopReels] = useState<TopReel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, activityData, topReelsData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivity(),
          dashboardApi.getTopPerformingReels()
        ])
        
        setStats(statsData)
        setRecentActivity(activityData.activity)
        setTopReels(topReelsData.top_reels)
        setError(null)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Erro ao carregar dados: ${err.message}`)
        } else {
          setError('Erro desconhecido ao carregar dados')
        }
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleAddProfile = () => {
    alert('Funcionalidade de adicionar perfil será implementada em breve!')
  }

  const handleConnectTikTok = () => {
    alert('Integração com TikTok será implementada em breve!')
  }

  const getActivityIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <FaExclamationTriangle className="text-red-400" />
      case 'WARNING': return <FaExclamationTriangle className="text-yellow-400" />
      case 'INFO': return <FaCheckCircle className="text-green-400" />
      default: return <FaCheckCircle className="text-blue-400" />
    }
  }

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'border-red-400/20 bg-red-400/5'
      case 'WARNING': return 'border-yellow-400/20 bg-yellow-400/5'
      case 'INFO': return 'border-green-400/20 bg-green-400/5'
      default: return 'border-blue-400/20 bg-blue-400/5'
    }
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
            <p className="text-white/80">Carregando dados...</p>
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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Início</a>
            <a href="/profiles" className="text-white/80 hover:text-white transition-colors">Perfis</a>
            <a href="/reels" className="text-white/80 hover:text-white transition-colors">Reels</a>
            <a href="/analytics" className="text-white/80 hover:text-white transition-colors">Analytics</a>
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
          <h2 className="text-4xl font-bold text-white mb-2">Bem-vindo de volta! 👋</h2>
          <p className="text-white/80 text-lg">Aqui está um resumo da sua atividade</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total de Vídeos</p>
                <p className="text-3xl font-bold text-white">{stats?.total_videos.toLocaleString('en-US') || 0}</p>
              </div>
              <div className="text-4xl">🎬</div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <span className="text-sm">+{stats?.monthly_growth.toFixed(1)}% este mês</span>
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Perfis Ativos</p>
                <p className="text-3xl font-bold text-white">{stats?.active_profiles || 0}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-4 flex items-center text-blue-400">
              <span className="text-sm">Monitorando</span>
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
                <p className="text-white/70 text-sm">Posts Hoje</p>
                <p className="text-3xl font-bold text-white">{stats?.posts_today || 0}</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="mt-4 flex items-center text-purple-400">
              <span className="text-sm">
                {stats && stats.posts_yesterday ? 
                  `+${stats.posts_today - stats.posts_yesterday} vs ontem` : 
                  'Novo hoje'
                }
              </span>
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
                <p className="text-white/70 text-sm">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-white">{stats?.success_rate.toFixed(1) || 0}%</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <span className="text-sm">
                {stats && stats.success_rate >= 95 ? 'Excelente!' : 
                 stats && stats.success_rate >= 80 ? 'Bom' : 'Pode melhorar'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Section */}
          <motion.div 
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">🚀 Configuração Rápida</h3>
            <div className="space-y-4">
              <button
                onClick={handleConnectTikTok}
                className="w-full btn-primary-modern text-left flex items-center justify-between"
              >
                <span>Conectar TikTok Account</span>
                <span>→</span>
              </button>
              <button
                onClick={handleAddProfile}
                className="w-full glass text-white px-6 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-left flex items-center justify-between"
              >
                <span>Adicionar Perfil Instagram</span>
                <span>+</span>
              </button>
              <button className="w-full glass text-white px-6 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-left flex items-center justify-between">
                <span>Configurar Proxies</span>
                <span>⚙️</span>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">📊 Atividade Recente</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  className={`flex items-center justify-between p-4 border rounded-xl ${getActivityColor(activity.level)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.level)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.message}</p>
                      <p className="text-white/70 text-sm">
                        {activity.context?.task_id || 'Sistema'}
                      </p>
                    </div>
                  </div>
                  <span className="text-white/70 text-sm">{formatTimeAgo(activity.created_at)}</span>
                </motion.div>
              )) : (
                <div className="text-center text-white/60 py-8">
                  <p>Nenhuma atividade recente</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Reels */}
        {topReels.length > 0 && (
          <motion.div 
            className="mt-8 glass rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">🏆 Top Reels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topReels.slice(0, 3).map((reel, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <h4 className="text-white font-semibold mb-2">{reel.title}</h4>
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span className="font-medium">{reel.views.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Likes:</span>
                      <span className="font-medium">{reel.likes.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engajamento:</span>
                      <span className="font-medium">{reel.engagement}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}