"use client"

import { useEffect, useState } from "react"
import { Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFullscreen } from "@/contexts/fullscreen-context"

interface FullscreenDaysProps {
  daysRemaining: number
  label: string
}

export function FullscreenDays({ daysRemaining, label }: FullscreenDaysProps) {
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const [mounted, setMounted] = useState(false)

  // Предотвращаем гидрацию
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isFullscreen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center transition-all duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4">{label}</h2>
        <div className="text-[10rem] font-bold text-primary leading-none">{daysRemaining}</div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={toggleFullscreen}
        aria-label="Exit fullscreen"
      >
        <Minimize2 className="h-6 w-6" />
      </Button>
    </div>
  )
}
