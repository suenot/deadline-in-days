export type Language = "en" | "ru" | "zh" | "ja" | "ko" | "ar" | "fr" | "hi" | "de"

// Названия языков только на английском
export const languageNames: Record<Language, string> = {
  en: "English",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  fr: "French",
  hi: "Hindi",
  de: "German",
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "Day Calculator",
    "app.description": "Calculate days from today to a selected date",
    "select.date": "Select date:",
    "days.remaining": "Days remaining:",
    "select.date.placeholder": "Select a date",
    language: "Language",
    "select.language": "Select language",
    "theme.toggle": "Toggle theme",
    "fullscreen.toggle": "Toggle fullscreen",
  },
  ru: {
    "app.title": "Калькулятор дней",
    "app.description": "Расчет количества дней от сегодня до выбранной даты",
    "select.date": "Выберите дату:",
    "days.remaining": "Осталось дней:",
    "select.date.placeholder": "Выберите дату",
    language: "Язык",
    "select.language": "Выберите язык",
    "theme.toggle": "Переключить тему",
    "fullscreen.toggle": "Полный экран",
  },
  zh: {
    "app.title": "日期计算器",
    "app.description": "计算从今天到所选日期的天数",
    "select.date": "选择日期：",
    "days.remaining": "剩余天数：",
    "select.date.placeholder": "选择日期",
    language: "语言",
    "select.language": "选择语言",
    "theme.toggle": "切换主题",
    "fullscreen.toggle": "切换全屏",
  },
  ja: {
    "app.title": "日数計算機",
    "app.description": "今日から選択した日付までの日数を計算する",
    "select.date": "日付を選択：",
    "days.remaining": "残り日数：",
    "select.date.placeholder": "日付を選択",
    language: "言語",
    "select.language": "言語を選択",
    "theme.toggle": "テーマを切り替える",
    "fullscreen.toggle": "全画面表示を切り替える",
  },
  ko: {
    "app.title": "일 계산기",
    "app.description": "오늘부터 선택한 날짜까지의 일수 계산",
    "select.date": "날짜 선택:",
    "days.remaining": "남은 일수:",
    "select.date.placeholder": "날짜 선택",
    language: "언어",
    "select.language": "언어 선택",
    "theme.toggle": "테마 전환",
    "fullscreen.toggle": "전체 화면 전환",
  },
  ar: {
    "app.title": "حاسبة الأيام",
    "app.description": "حساب الأيام من اليوم إلى التاريخ المحدد",
    "select.date": "اختر التاريخ:",
    "days.remaining": "الأيام المتبقية:",
    "select.date.placeholder": "اختر تاريخًا",
    language: "اللغة",
    "select.language": "اختر اللغة",
    "theme.toggle": "تبديل السمة",
    "fullscreen.toggle": "تبديل ملء الشاشة",
  },
  fr: {
    "app.title": "Calculateur de jours",
    "app.description": "Calculer les jours entre aujourd'hui et une date sélectionnée",
    "select.date": "Sélectionner une date :",
    "days.remaining": "Jours restants :",
    "select.date.placeholder": "Sélectionner une date",
    language: "Langue",
    "select.language": "Sélectionner la langue",
    "theme.toggle": "Changer de thème",
    "fullscreen.toggle": "Basculer en plein écran",
  },
  hi: {
    "app.title": "दिन कैलकुलेटर",
    "app.description": "आज से चयनित तिथि तक के दिनों की गणना करें",
    "select.date": "तिथि चुनें:",
    "days.remaining": "शेष दिन:",
    "select.date.placeholder": "एक तिथि चुनें",
    language: "भाषा",
    "select.language": "भाषा चुनें",
    "theme.toggle": "थीम टॉगल करें",
    "fullscreen.toggle": "फुलस्क्रीन टॉगल करें",
  },
  de: {
    "app.title": "Tagerechner",
    "app.description": "Berechnen Sie die Tage von heute bis zu einem ausgewählten Datum",
    "select.date": "Datum auswählen:",
    "days.remaining": "Verbleibende Tage:",
    "select.date.placeholder": "Datum auswählen",
    language: "Sprache",
    "select.language": "Sprache auswählen",
    "theme.toggle": "Thema umschalten",
    "fullscreen.toggle": "Vollbild umschalten",
  },
}

// Функция для получения локализованного текста
export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key] || key
}

// Функция для определения направления текста (для арабского языка)
export function getTextDirection(lang: Language): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr"
}

// Функция для получения локали date-fns для форматирования дат
export function getDateLocale(lang: Language) {
  switch (lang) {
    case "ru":
      return import("date-fns/locale/ru").then((module) => module.default)
    case "zh":
      return import("date-fns/locale/zh-CN").then((module) => module.default)
    case "ja":
      return import("date-fns/locale/ja").then((module) => module.default)
    case "ko":
      return import("date-fns/locale/ko").then((module) => module.default)
    case "ar":
      return import("date-fns/locale/ar").then((module) => module.default)
    case "fr":
      return import("date-fns/locale/fr").then((module) => module.default)
    case "hi":
      // Для хинди используем английскую локаль, так как специфичной локали нет
      return import("date-fns/locale/en-IN").then((module) => module.default)
    case "de":
      return import("date-fns/locale/de").then((module) => module.default)
    default:
      return import("date-fns/locale/en-US").then((module) => module.default)
  }
}
