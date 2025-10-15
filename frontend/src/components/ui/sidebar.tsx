"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  Activity,
  Instagram,
  Video,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "./button"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Instagram, label: "Perfis", href: "/profiles" },
  { icon: Video, label: "Reels", href: "/reels" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Activity, label: "Logs", href: "/logs" },
  { icon: Settings, label: "Configurações", href: "/settings" },
]

export function Sidebar({ isOpen, onToggle, className }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-80 glass border-r border-white/20",
              "flex flex-col",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AutoReel
                </span>
              </motion.div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-white/10 hover:scale-105 active:scale-95",
                    item.active && "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-white/20"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.a>
              ))}
            </nav>
            
            {/* Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 border-t border-white/10"
            >
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </Button>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
