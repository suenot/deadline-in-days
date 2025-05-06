"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type Language, getTranslation, languageNames } from "@/lib/i18n"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  languageNames: Record<Language, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguageState] = useState<Language>("en")

  // Функция для обновления URL с новым языком
  const updateUrlWithLanguage = (lang: Language) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", lang)
    router.push(`?${params.toString()}`)
  }

  // Функция для сохранения языка в localStorage
  const saveLanguageToLocalStorage = (lang: Language) => {
    try {
      localStorage.setItem("language", lang)
    } catch (error) {
      console.error("Error saving language to localStorage:", error)
    }
  }

  // Обработчик изменения языка
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    updateUrlWithLanguage(lang)
    saveLanguageToLocalStorage(lang)
  }

  // Функция для получения перевода
  const t = (key: string) => {
    return getTranslation(language, key)
  }

  // Инициализация языка при загрузке страницы
  useEffect(() => {
    // Проверяем URL-параметры
    const langFromUrl = searchParams.get("lang") as Language | null

    if (langFromUrl && Object.keys(languageNames).includes(langFromUrl)) {
      setLanguageState(langFromUrl)
      return
    }

    // Если нет в URL, проверяем localStorage
    try {
      const savedLang = localStorage.getItem("language") as Language | null
      if (savedLang && Object.keys(languageNames).includes(savedLang)) {
        setLanguageState(savedLang)
        updateUrlWithLanguage(savedLang)
        return
      }
    } catch (error) {
      console.error("Error reading language from localStorage:", error)
    }

    // Если нигде нет, пытаемся определить язык браузера
    try {
      const browserLang = navigator.language.split("-")[0] as Language
      if (Object.keys(languageNames).includes(browserLang)) {
        setLanguageState(browserLang)
        updateUrlWithLanguage(browserLang)
        saveLanguageToLocalStorage(browserLang)
        return
      }
    } catch (error) {
      console.error("Error detecting browser language:", error)
    }

    // Если ничего не подошло, используем английский по умолчанию
    setLanguageState("en")
    updateUrlWithLanguage("en")
    saveLanguageToLocalStorage("en")
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
