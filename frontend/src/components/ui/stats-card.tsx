"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  color?: "blue" | "green" | "purple" | "orange" | "red"
  className?: string
}

const colorVariants = {
  blue: {
    bg: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/30",
    icon: "text-blue-500",
    iconBg: "bg-blue-500/10"
  },
  green: {
    bg: "from-green-500/20 to-green-600/20",
    border: "border-green-500/30",
    icon: "text-green-500",
    iconBg: "bg-green-500/10"
  },
  purple: {
    bg: "from-purple-500/20 to-purple-600/20",
    border: "border-purple-500/30",
    icon: "text-purple-500",
    iconBg: "bg-purple-500/10"
  },
  orange: {
    bg: "from-orange-500/20 to-orange-600/20",
    border: "border-orange-500/30",
    icon: "text-orange-500",
    iconBg: "bg-orange-500/10"
  },
  red: {
    bg: "from-red-500/20 to-red-600/20",
    border: "border-red-500/30",
    icon: "text-red-500",
    iconBg: "bg-red-500/10"
  }
}

const changeVariants = {
  positive: "text-green-500",
  negative: "text-red-500",
  neutral: "text-muted-foreground"
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color = "blue",
  className
}: StatsCardProps) {
  const colors = colorVariants[color]
  const changeColor = changeVariants[changeType]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "glass rounded-xl border border-white/20 p-6 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-foreground"
            >
              {value}
            </motion.p>
            {change && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn("text-sm font-medium", changeColor)}
              >
                {change}
              </motion.span>
            )}
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", damping: 15 }}
          className={cn(
            "p-3 rounded-lg",
            colors.iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", colors.icon)} />
        </motion.div>
      </div>
    </motion.div>
  )
}
