"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type FullscreenContextType = {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined)

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Функция для обновления URL с состоянием полноэкранного режима
  const updateUrlWithFullscreenState = (state: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (state) {
      params.set("fullscreen", "true")
    } else {
      params.delete("fullscreen")
    }
    router.push(`?${params.toString()}`)
  }

  // Функция для сохранения состояния в localStorage
  const saveFullscreenStateToLocalStorage = (state: boolean) => {
    try {
      localStorage.setItem("fullscreen", state ? "true" : "false")
    } catch (error) {
      console.error("Error saving fullscreen state to localStorage:", error)
    }
  }

  // Обработчик переключения полноэкранного режима
  const toggleFullscreen = () => {
    const newState = !isFullscreen
    setIsFullscreen(newState)
    updateUrlWithFullscreenState(newState)
    saveFullscreenStateToLocalStorage(newState)

    // Управление браузерным полноэкранным режимом
    if (newState) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      }
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        })
      }
    }
  }

  // Слушатель событий полноэкранного режима браузера
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      if (isFullscreen !== isCurrentlyFullscreen) {
        setIsFullscreen(isCurrentlyFullscreen)
        updateUrlWithFullscreenState(isCurrentlyFullscreen)
        saveFullscreenStateToLocalStorage(isCurrentlyFullscreen)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [isFullscreen])

  // Инициализация состояния при загрузке страницы
  useEffect(() => {
    // Проверяем URL-параметры
    const fullscreenFromUrl = searchParams.get("fullscreen")

    if (fullscreenFromUrl === "true") {
      setIsFullscreen(true)
      // Не активируем полноэкранный режим браузера автоматически,
      // так как это требует взаимодействия пользователя
      setIsInitialized(true)
      return
    }

    // Если нет в URL, проверяем localStorage
    try {
      const savedFullscreen = localStorage.getItem("fullscreen")
      if (savedFullscreen === "true") {
        setIsFullscreen(true)
        // Не активируем полноэкранный режим браузера автоматически
        setIsInitialized(true)
        return
      }
    } catch (error) {
      console.error("Error reading fullscreen state from localStorage:", error)
    }

    // Если нигде нет, используем состояние по умолчанию (false)
    setIsFullscreen(false)
    setIsInitialized(true)
  }, [])

  return (
    <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen }}>
      {isInitialized ? children : null}
    </FullscreenContext.Provider>
  )
}

export function useFullscreen() {
  const context = useContext(FullscreenContext)
  if (context === undefined) {
    throw new Error("useFullscreen must be used within a FullscreenProvider")
  }
  return context
}
