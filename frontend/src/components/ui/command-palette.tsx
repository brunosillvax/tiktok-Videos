"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Home, Users, Settings, BarChart3, Activity, Instagram, Video, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  category: string
}

const commands: CommandItem[] = [
  { id: "dashboard", title: "Dashboard", description: "Visão geral do sistema", icon: Home, href: "/dashboard", category: "Navegação" },
  { id: "profiles", title: "Perfis", description: "Gerenciar perfis do Instagram", icon: Instagram, href: "/profiles", category: "Navegação" },
  { id: "reels", title: "Reels", description: "Ver reels postados", icon: Video, href: "/reels", category: "Navegação" },
  { id: "analytics", title: "Analytics", description: "Estatísticas e métricas", icon: BarChart3, href: "/analytics", category: "Navegação" },
  { id: "logs", title: "Logs", description: "Logs do sistema", icon: Activity, href: "/logs", category: "Navegação" },
  { id: "settings", title: "Configurações", description: "Configurações do sistema", icon: Settings, href: "/settings", category: "Navegação" },
]

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
          break
        case "Enter":
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            window.location.href = filteredCommands[selectedIndex].href
            onClose()
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 command-palette"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="mx-auto mt-20 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center px-6 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Digite um comando ou pesquise..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="ml-3 p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  <div className="py-2">
                    {filteredCommands.map((command, index) => (
                      <motion.a
                        key={command.id}
                        href={command.href}
                        onClick={onClose}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "flex items-center px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer",
                          index === selectedIndex && "bg-white/10"
                        )}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center mr-4">
                          <command.icon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground">{command.title}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {command.description}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
                          {command.category}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum comando encontrado</p>
                    <p className="text-sm">Tente uma palavra-chave diferente</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">↑↓</kbd>
                      navegar
                    </span>
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">↵</kbd>
                      selecionar
                    </span>
                  </div>
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">esc</kbd>
                    fechar
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
