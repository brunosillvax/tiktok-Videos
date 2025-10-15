"use client"

import React, { useState, useEffect } from "react"

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleGetStarted = () => {
    // Navegar para dashboard ou página de login
    window.location.href = '/dashboard'
  }

  const handleViewDemo = () => {
    // Abrir modal de demo ou navegar para página de demonstração
    alert('Demo em desenvolvimento! Em breve você poderá ver uma demonstração completa da aplicação.')
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isDarkMode ? 'bg-gradient-hero-dark' : 'bg-gradient-hero'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-2xl font-bold text-white">AutoReel</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="glass text-white px-6 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Hero Section */}
        <div className={`text-center max-w-4xl transition-all duration-1000 delay-300 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-gradient-accent">AutoReel</span>
            <br />
            TikTok Publisher
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Automatize a publicação de seus Reels do Instagram para o TikTok com tecnologia de ponta e segurança máxima.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="btn-primary-modern text-lg animate-pulse-glow"
            >
              🚀 Começar Agora
            </button>
            <button 
              onClick={handleViewDemo}
              className="glass text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              📖 Ver Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full transition-all duration-1000 delay-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Feature 1 */}
          <div className="glass rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-4">Automatize seus Reels</h3>
            <p className="text-white/80 leading-relaxed">
              Monitore perfis do Instagram automaticamente e publique seus Reels no TikTok sem intervenção manual.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-2xl font-bold text-white mb-4">Analytics Detalhados</h3>
            <p className="text-white/80 leading-relaxed">
              Acompanhe o desempenho dos seus vídeos em tempo real com métricas avançadas e relatórios detalhados.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
            <h3 className="text-2xl font-bold text-white mb-4">Seguro e Confiável</h3>
            <p className="text-white/80 leading-relaxed">
              Use APIs oficiais e proxies residenciais para máxima segurança e conformidade com as plataformas.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full transition-all duration-1000 delay-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-white/70">Vídeos Publicados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/70">Monitoramento</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">API</div>
            <div className="text-white/70">Oficial TikTok</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/60">
        <p>&copy; 2024 AutoReel TikTok Publisher. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}