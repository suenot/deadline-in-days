"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type ThemeName, themeNames, defaultTheme } from "@/lib/themes"

type ThemeContextType = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  themeNames: Record<ThemeName, string>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
  const [isInitialized, setIsInitialized] = useState(false)

  // Функция для обновления URL с новой темой
  const updateUrlWithTheme = (newTheme: ThemeName) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("theme", newTheme)
    router.push(`?${params.toString()}`)
  }

  // Функция для сохранения темы в localStorage
  const saveThemeToLocalStorage = (newTheme: ThemeName) => {
    try {
      localStorage.setItem("theme", newTheme)
    } catch (error) {
      console.error("Error saving theme to localStorage:", error)
    }
  }

  // Обработчик изменения темы
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
    updateUrlWithTheme(newTheme)
    saveThemeToLocalStorage(newTheme)

    // Применяем тему к документу
    document.documentElement.setAttribute("data-theme", newTheme)

    // Также устанавливаем класс dark для совместимости с существующими стилями
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Инициализация темы при загрузке страницы
  useEffect(() => {
    // Проверяем URL-параметры
    const themeFromUrl = searchParams.get("theme") as ThemeName | null

    if (themeFromUrl && Object.keys(themeNames).includes(themeFromUrl)) {
      setTheme(themeFromUrl)
      setIsInitialized(true)
      return
    }

    // Если нет в URL, проверяем localStorage
    try {
      const savedTheme = localStorage.getItem("theme") as ThemeName | null
      if (savedTheme && Object.keys(themeNames).includes(savedTheme)) {
        setTheme(savedTheme)
        setIsInitialized(true)
        return
      }
    } catch (error) {
      console.error("Error reading theme from localStorage:", error)
    }

    // Если нигде нет, используем тему по умолчанию
    setTheme(defaultTheme)
    setIsInitialized(true)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeNames }}>
      {isInitialized ? children : null}
    </ThemeContext.Provider>
  )
}

export function useCustomTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider")
  }
  return context
}
