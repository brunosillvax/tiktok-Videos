"use client"

import React, { useState } from "react"

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [settings, setSettings] = useState({
    autoPost: true,
    checkInterval: 30,
    proxyEnabled: true,
    notifications: true,
    analyticsEnabled: true
  })

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    alert('Configurações salvas com sucesso!')
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
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Início</a>
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">Dashboard</a>
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
      <main className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Configurações do Sistema ⚙️</h2>
          <p className="text-white/80 text-lg">Personalize sua experiência e configure o comportamento da aplicação</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Automation Settings */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🤖 Configurações de Automação</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-2">Publicação Automática</h4>
                  <p className="text-white/70 text-sm">Publicar automaticamente os Reels no TikTok</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoPost}
                    onChange={(e) => handleSettingChange('autoPost', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-2">Intervalo de Verificação</h4>
                  <p className="text-white/70 text-sm">Frequência de verificação de novos Reels (minutos)</p>
                </div>
                <select
                  value={settings.checkInterval}
                  onChange={(e) => handleSettingChange('checkInterval', parseInt(e.target.value))}
                  className="glass text-white px-4 py-2 rounded-xl bg-white/10 border border-white/20"
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🔒 Configurações de Segurança</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-2">Proxies Residenciais</h4>
                  <p className="text-white/70 text-sm">Usar proxies para maior segurança e anonimato</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.proxyEnabled}
                    onChange={(e) => handleSettingChange('proxyEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2">Configuração de Proxies</h4>
                <p className="text-white/70 text-sm mb-4">Configure seus proxies residenciais para máxima segurança</p>
                <button className="glass text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300">
                  ➕ Adicionar Proxy
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🔔 Configurações de Notificações</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-2">Notificações do Sistema</h4>
                  <p className="text-white/70 text-sm">Receber notificações sobre atividades importantes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-2">Analytics Avançados</h4>
                  <p className="text-white/70 text-sm">Habilitar coleta de dados para analytics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analyticsEnabled}
                    onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🔑 Configurações de API</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">TikTok API Keys</h4>
                <p className="text-white/70 text-sm mb-4">Configure suas chaves da API oficial do TikTok</p>
                <button className="glass text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300">
                  ⚙️ Configurar TikTok API
                </button>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Instagram Integration</h4>
                <p className="text-white/70 text-sm mb-4">Configure a integração com Instagram</p>
                <button className="glass text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300">
                  📱 Configurar Instagram
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSaveSettings}
              className="btn-primary-modern text-lg px-12"
            >
              💾 Salvar Configurações
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}