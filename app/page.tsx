"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, differenceInDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Globe, Maximize2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { type Language, getDateLocale, getTextDirection } from "@/lib/i18n"
import { ThemeSelector } from "@/components/theme-selector"
import { FullscreenDays } from "@/components/fullscreen-days"
import { CustomThemeProvider } from "@/contexts/theme-context"
import { FullscreenProvider, useFullscreen } from "@/contexts/fullscreen-context"
import type { Locale } from "date-fns"

function DateCalculatorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, language, setLanguage, languageNames } = useLanguage()
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [today] = useState(new Date())
  const [dateLocale, setDateLocale] = useState<Locale | undefined>(undefined)
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr")

  // Загрузка локали для форматирования дат
  useEffect(() => {
    getDateLocale(language).then((locale) => {
      setDateLocale(locale)
    })

    // Установка направления текста
    setTextDirection(getTextDirection(language))
  }, [language])

  // Функция для обновления URL с новой датой
  const updateUrlWithDate = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(date, "yyyy-MM-dd"))

    // Сохраняем текущий язык в URL
    params.set("lang", language)

    router.push(`?${params.toString()}`)
  }

  // Функция для сохранения даты в localStorage
  const saveDateToLocalStorage = (date: Date) => {
    localStorage.setItem("targetDate", format(date, "yyyy-MM-dd"))
  }

  // Обработчик изменения даты
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setTargetDate(date)
      updateUrlWithDate(date)
      saveDateToLocalStorage(date)
      calculateDaysRemaining(date)
    }
  }

  // Расчет оставшихся дней
  const calculateDaysRemaining = (date: Date) => {
    const days = differenceInDays(date, today)
    setDaysRemaining(days)
  }

  // Обработчик изменения языка
  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language)
  }

  // Инициализация даты при загрузке страницы
  useEffect(() => {
    // Проверяем URL-параметры
    const dateFromUrl = searchParams.get("date")

    if (dateFromUrl) {
      const parsedDate = new Date(dateFromUrl)
      if (!isNaN(parsedDate.getTime())) {
        setTargetDate(parsedDate)
        calculateDaysRemaining(parsedDate)
        return
      }
    }

    // Если нет в URL, проверяем localStorage
    try {
      const savedDate = localStorage.getItem("targetDate")
      if (savedDate) {
        const parsedDate = new Date(savedDate)
        if (!isNaN(parsedDate.getTime())) {
          setTargetDate(parsedDate)
          calculateDaysRemaining(parsedDate)
          updateUrlWithDate(parsedDate)
          return
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }

    // Если нигде нет, устанавливаем текущую дату + 7 дней
    const defaultDate = addDays(today, 7)
    setTargetDate(defaultDate)
    calculateDaysRemaining(defaultDate)
    updateUrlWithDate(defaultDate)
    saveDateToLocalStorage(defaultDate)
  }, [])

  // Функция для определения класса для дня в календаре
  const getDayClass = (date: Date) => {
    if (!targetDate) return ""

    const isInRange = date >= today && date <= targetDate
    const isToday = date.toDateString() === today.toDateString()
    const isTarget = date.toDateString() === targetDate.toDateString()

    if (isTarget) return "bg-primary text-primary-foreground rounded-full"
    if (isToday) return "border-2 border-primary rounded-full"
    if (isInRange) return "bg-primary/20 rounded-full"

    return ""
  }

  if (!dateLocale) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  // Если активен полноэкранный режим, показываем только количество дней
  if (isFullscreen) {
    return <FullscreenDays daysRemaining={daysRemaining} label={t("days.remaining")} />
  }

  return (
    <div className="container mx-auto py-10" dir={textDirection}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{t("app.title")}</CardTitle>
          <CardDescription>{t("app.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t("select.date")}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal mt-1",
                        !targetDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate ? (
                        format(targetDate, "PPP", { locale: dateLocale })
                      ) : (
                        <span>{t("select.date.placeholder")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={targetDate}
                      onSelect={handleDateChange}
                      initialFocus
                      locale={dateLocale}
                      modifiers={{
                        today: [today],
                      }}
                      modifiersClassNames={{
                        today: "bg-primary/10",
                      }}
                      className="rounded-md border"
                      components={{
                        day: ({ date, ...props }) => (
                          <button {...props} className={cn(props.className, getDayClass(date))} />
                        ),
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{t("days.remaining")}</p>
                <p className="text-4xl font-bold text-primary mt-1">{daysRemaining}</p>
              </div>
            </div>
          </div>

          <Calendar
            mode="single"
            selected={targetDate}
            onSelect={handleDateChange}
            locale={dateLocale}
            disabled={{ before: today }}
            modifiers={{
              today: [today],
            }}
            modifiersClassNames={{
              today: "bg-primary/10",
            }}
            className="mt-4"
            components={{
              day: ({ date, ...props }) => <button {...props} className={cn(props.className, getDayClass(date))} />,
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("select.language")} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageNames).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <ThemeSelector />
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label="Fullscreen">
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function DateCalculatorWithProviders() {
  return (
    <LanguageProvider>
      <CustomThemeProvider>
        <FullscreenProvider>
          <DateCalculatorContent />
        </FullscreenProvider>
      </CustomThemeProvider>
    </LanguageProvider>
  )
}

export default function DateCalculator() {
  return <DateCalculatorWithProviders />
}
