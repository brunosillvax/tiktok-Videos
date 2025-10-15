"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSpinner, FaExclamationTriangle, FaPlus, FaPlay, FaPause, FaInstagram } from "react-icons/fa"
import { profilesApi, ApiError } from "@/lib/api"

interface Profile {
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
}

interface ProfileStats {
  total_profiles: number
  active_profiles: number
  total_posts: number
}

export default function ProfilesPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [profilesData, statsData] = await Promise.all([
          profilesApi.getProfiles(),
          profilesApi.getStats()
        ])
        
        setProfiles(profilesData.profiles)
        setStats(statsData)
        setError(null)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Erro ao carregar dados: ${err.message}`)
        } else {
          setError('Erro desconhecido ao carregar dados')
        }
        console.error('Error fetching profiles data:', err)
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

  const handleToggleProfile = (profileId: number) => {
    alert(`Funcionalidade de ativar/desativar perfil ${profileId} será implementada em breve!`)
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
            <p className="text-white/80">Carregando perfis...</p>
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
          <h1 className="text-2xl font-bold text-white">Perfis Monitorados</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Início</a>
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">Dashboard</a>
            <a href="/profiles" className="text-white font-medium">Perfis</a>
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
          <h2 className="text-4xl font-bold text-white mb-2">Perfis do Instagram 📸</h2>
          <p className="text-white/80 text-lg">Gerencie os perfis que você está monitorando</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total de Perfis</p>
                <p className="text-3xl font-bold text-white">{stats?.total_profiles || 0}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-4 flex items-center text-blue-400">
              <span className="text-sm">Monitorados</span>
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
              <div className="text-4xl">✅</div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <span className="text-sm">Funcionando</span>
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
                <p className="text-white/70 text-sm">Total de Posts</p>
                <p className="text-3xl font-bold text-white">{stats?.total_posts || 0}</p>
              </div>
              <div className="text-4xl">📸</div>
            </div>
            <div className="mt-4 flex items-center text-purple-400">
              <span className="text-sm">Publicados</span>
            </div>
          </motion.div>
        </div>

        {/* Add Profile Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleAddProfile}
            className="btn-primary-modern flex items-center space-x-2"
          >
            <FaPlus />
            <span>Adicionar Novo Perfil</span>
          </button>
        </motion.div>

        {/* Profiles List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <motion.div 
              key={profile.id}
              className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FaInstagram className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{profile.display_name}</h3>
                    <p className="text-white/70 text-sm">{profile.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleProfile(profile.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    profile.is_active 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {profile.is_active ? <FaPlay /> : <FaPause />}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.is_active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {profile.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Posts:</span>
                  <span className="text-white font-medium">{profile.posts_count}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Intervalo:</span>
                  <span className="text-white font-medium">{profile.check_interval_minutes} min</span>
                </div>

                {profile.last_checked_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Última verificação:</span>
                    <span className="text-white/80 text-xs">{formatTimeAgo(profile.last_checked_at)}</span>
                  </div>
                )}

                {profile.last_posted_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Último post:</span>
                    <span className="text-white/80 text-xs">{formatTimeAgo(profile.last_posted_at)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors">
                    Ver Posts
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {profiles.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum perfil encontrado</h3>
            <p className="text-white/70 mb-6">Adicione perfis do Instagram para começar a monitorar</p>
            <button
              onClick={handleAddProfile}
              className="btn-primary-modern"
            >
              Adicionar Primeiro Perfil
            </button>
          </motion.div>
        )}
      </main>
    </div>
  )
}