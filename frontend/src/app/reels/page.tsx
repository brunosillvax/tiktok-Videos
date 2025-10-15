"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSpinner, FaExclamationTriangle, FaVideo, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa"
import { reelsApi, ApiError } from "@/lib/api"

interface Reel {
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
}

interface ReelStats {
  total_reels: number
  downloaded_reels: number
  posted_reels: number
  total_views: number
  total_likes: number
}

export default function ReelsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [reels, setReels] = useState<Reel[]>([])
  const [stats, setStats] = useState<ReelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [reelsData, statsData] = await Promise.all([
          reelsApi.getReels(filter === "all" ? undefined : filter),
          reelsApi.getStats()
        ])
        
        setReels(reelsData.reels)
        setStats(statsData)
        setError(null)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Erro ao carregar dados: ${err.message}`)
        } else {
          setError('Erro desconhecido ao carregar dados')
        }
        console.error('Error fetching reels data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filter])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return <FaCheckCircle className="text-green-400" />
      case 'pending': return <FaClock className="text-yellow-400" />
      case 'failed': return <FaExclamationCircle className="text-red-400" />
      default: return <FaVideo className="text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-blue-500/20 text-blue-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'posted': return 'Publicado'
      case 'pending': return 'Pendente'
      case 'failed': return 'Falhou'
      default: return 'Desconhecido'
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
            <p className="text-white/80">Carregando reels...</p>
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
          <h1 className="text-2xl font-bold text-white">Reels & Vídeos</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Início</a>
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">Dashboard</a>
            <a href="/profiles" className="text-white/80 hover:text-white transition-colors">Perfis</a>
            <a href="/reels" className="text-white font-medium">Reels</a>
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
          <h2 className="text-4xl font-bold text-white mb-2">Vídeos & Reels 📹</h2>
          <p className="text-white/80 text-lg">Acompanhe todos os seus vídeos baixados e publicados</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total</p>
                <p className="text-3xl font-bold text-white">{stats?.total_reels || 0}</p>
              </div>
              <div className="text-4xl">📹</div>
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
                <p className="text-white/70 text-sm">Baixados</p>
                <p className="text-3xl font-bold text-white">{stats?.downloaded_reels || 0}</p>
              </div>
              <div className="text-4xl">⬇️</div>
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
                <p className="text-white/70 text-sm">Publicados</p>
                <p className="text-3xl font-bold text-white">{stats?.posted_reels || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
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
                <p className="text-white/70 text-sm">Visualizações</p>
                <p className="text-3xl font-bold text-white">{(stats?.total_views || 0).toLocaleString('en-US')}</p>
              </div>
              <div className="text-4xl">👀</div>
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
                <p className="text-white/70 text-sm">Curtidas</p>
                <p className="text-3xl font-bold text-white">{(stats?.total_likes || 0).toLocaleString('en-US')}</p>
              </div>
              <div className="text-4xl">❤️</div>
            </div>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <motion.div 
          className="mb-8 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all" 
                ? "bg-purple-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("posted")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "posted" 
                ? "bg-green-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Publicados
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "pending" 
                ? "bg-yellow-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "failed" 
                ? "bg-red-500 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Falharam
          </button>
        </motion.div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reels.map((reel, index) => (
            <motion.div 
              key={reel.id}
              className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FaVideo className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {reel.caption ? (reel.caption.length > 30 ? reel.caption.substring(0, 30) + "..." : reel.caption) : "Sem título"}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {reel.profile?.username || "Perfil desconhecido"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(reel.status)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reel.status)}`}>
                    {getStatusText(reel.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Código:</span>
                  <span className="text-white font-mono text-xs">{reel.instagram_reel_code}</span>
                </div>

                {reel.analytics && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Views:</span>
                      <span className="text-white font-medium">{reel.analytics.views.toLocaleString('en-US')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Likes:</span>
                      <span className="text-white font-medium">{reel.analytics.likes.toLocaleString('en-US')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Engajamento:</span>
                      <span className="text-white font-medium">{reel.analytics.engagement}%</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Criado:</span>
                  <span className="text-white/80 text-xs">{formatTimeAgo(reel.created_at)}</span>
                </div>

                {reel.posted_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Publicado:</span>
                    <span className="text-white/80 text-xs">{formatTimeAgo(reel.posted_at)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors">
                    Ver Detalhes
                  </button>
                  {reel.tiktok_post_url && (
                    <button 
                      className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      onClick={() => window.open(reel.tiktok_post_url, '_blank')}
                    >
                      Ver no TikTok
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {reels.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum reel encontrado</h3>
            <p className="text-white/70 mb-6">
              {filter === "all" 
                ? "Nenhum reel foi baixado ainda. Configure perfis para monitorar!"
                : `Nenhum reel com status "${filter}" encontrado.`
              }
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="btn-primary-modern"
              >
                Ver Todos os Reels
              </button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}