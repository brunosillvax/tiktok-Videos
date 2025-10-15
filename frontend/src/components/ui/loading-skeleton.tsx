"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("animate-pulse bg-muted rounded", className)}
    />
  )
}

export function ProfileSkeleton() {
  return (
    <div className="glass rounded-xl border border-white/20 p-6">
      <div className="flex items-center space-x-4">
        <LoadingSkeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-3 w-1/2" />
        </div>
        <LoadingSkeleton className="w-16 h-8 rounded-md" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="glass rounded-xl border border-white/20 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-4 w-1/2" />
          <LoadingSkeleton className="h-8 w-3/4" />
        </div>
        <LoadingSkeleton className="w-12 h-12 rounded-lg" />
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="glass rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <LoadingSkeleton className="h-6 w-1/4" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <LoadingSkeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <LoadingSkeleton className="h-4 w-1/3" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
            <LoadingSkeleton className="w-20 h-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
