import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      common: {
        appName: 'AutoHub',
      },
      home: {
        title: 'Manage your dealership in one place',
        description:
          'AutoHub helps dealerships and marketplaces centralize their inventory, leads and deals – without the chaos of spreadsheets and chats.',
        tagline: 'Smart car marketplace',
        pill: 'All your dealership cars in one place',
        getStarted: 'Get started',
        alreadyHaveAccount: 'Already have an account? Log in',
        noCreditCard: 'No credit card required – sign in with Google.',
        metricInventory: 'Inventory management',
        metricInventoryDesc: 'All cars, statuses and prices in a single system.',
        metricLeads: 'Lead management',
        metricLeadsDesc: 'Don’t lose requests – keep your sales funnel under control.',
        metricTime: 'Team time saved',
        metricTimeDesc: 'Less routine – more time for real sales.',
        previewLabel: 'Dealership dashboard demo',
        previewTitle: 'Current fleet status',
        previewInStock: 'in stock 19',
        previewReserved: 'reserved 6',
        statusInStock: 'In stock',
        statusReserved: 'Reserved',
        statusTestDrive: 'Test drive',
        ctaDashboard: 'Go to live dashboard',
        footerNote: 'After signing in you will land in a dashboard with your inventory and leads.',
        rightsReserved: 'All rights reserved.',
      },
      auth: {
        loginTitle: 'Sign in to AutoHub',
        loginDescription:
          'Sign in with Google to save data about your car.',
        loginWithGoogle: 'Sign in with Google',
        signUp: 'Sign up',
      },
      profile: {
        loading: 'Loading...',
        title: 'Profile',
        noName: 'No name',
        noEmail: 'No email',
        logout: 'Log out',
      },
      cars: {
        title: 'My cars',
        loadingList: 'Loading cars...',
        emptyList: 'No cars yet.',
        addCarTitle: 'Add car',
        brandLabel: 'Make',
        modelLabel: 'Model',
        yearLabelOptional: 'Year (optional)',
        vinLabelOptional: 'VIN (optional)',
        saving: 'Saving...',
        addCarButton: 'Add car',
        validation: {
          brandRequired: 'Make is required',
          modelRequired: 'Model is required',
          yearMustBeNumber: 'Year must be a number',
        },
      },
      notFound: {
        title: 'Page not found',
        backToHome: 'Back to home',
      },
      languageSwitcher: {
        label: 'Language',
        en: 'English',
        uk: 'Ukrainian',
      },
    },
  },
  uk: {
    translation: {
      common: {
        appName: 'AutoHub',
      },
      home: {
        title: 'Керуйте автопарком та клієнтами в один клік',
        description:
          'AutoHub допомагає автосалонам та маркетплейсам централізовано керувати авто, лідами та угодами – без хаосу в таблицях та месенджерах.',
        tagline: 'Розумний маркетплейс авто',
        pill: 'Усе авто вашого автосалону в одному місці',
        getStarted: 'Почати зараз',
        alreadyHaveAccount: 'Вже є акаунт? Увійти',
        noCreditCard: 'Жодних карток – вхід одразу через Google.',
        metricInventory: 'Керування автопарком',
        metricInventoryDesc: 'Усі авто, статуси та ціни – в єдиній системі.',
        metricLeads: 'Робота з лідами',
        metricLeadsDesc: 'Не губіть запити – вся воронка продажів під контролем.',
        metricTime: 'Економія часу менеджерів',
        metricTimeDesc: 'Менше рутини – більше часу на живі продажі.',
        previewLabel: 'Демо-панель автосалону',
        previewTitle: 'Поточний статус автопарку',
        previewInStock: 'в наявності 19',
        previewReserved: 'бронювання 6',
        statusInStock: 'В наявності',
        statusReserved: 'Бронювання',
        statusTestDrive: 'Тест-драйв',
        ctaDashboard: 'Перейти до живого дашборду',
        footerNote: 'Після входу ви потрапите до дашборду з автопарком та лідами.',
        rightsReserved: 'Всі права захищено.',
      },
      auth: {
        loginTitle: 'Увійти в AutoHub',
        loginDescription:
          'Авторизуйся через Google, щоб зберігати дані по своєму авто.',
        loginWithGoogle: 'Увійти через Google',
        signUp: 'Створити акаунт',
      },
      profile: {
        loading: 'Завантаження...',
        title: 'Профіль',
        noName: 'Без імені',
        noEmail: 'Без email',
        logout: 'Вийти',
      },
      cars: {
        title: 'Мої авто',
        loadingList: 'Завантаження списку авто...',
        emptyList: 'Поки що немає жодного авто.',
        addCarTitle: 'Додати авто',
        brandLabel: 'Марка',
        modelLabel: 'Модель',
        yearLabelOptional: "Рік (необовʼязково)",
        vinLabelOptional: "VIN (необовʼязково)",
        saving: 'Збереження...',
        addCarButton: 'Додати авто',
        validation: {
          brandRequired: 'Марка обовʼязкова',
          modelRequired: 'Модель обовʼязкова',
          yearMustBeNumber: 'Рік має бути числом',
        },
      },
      notFound: {
        title: 'Сторінку не знайдено',
        backToHome: 'Повернутися на головну',
      },
      languageSwitcher: {
        label: 'Мова',
        en: 'Англійська',
        uk: 'Українська',
      },
    },
  },
} as const

const languageDetector = new LanguageDetector()

languageDetector.addDetector({
  name: 'customNavigatorOrLocalStorage',
  lookup: () => {
    if (typeof window === 'undefined') return undefined

    const stored = window.localStorage.getItem('i18nextLng')
    if (stored) return stored

    const navLang = window.navigator.languages?.[0] ?? window.navigator.language
    if (!navLang) return undefined

    if (navLang.toLowerCase().startsWith('uk')) return 'uk'
    return 'en'
  },
})

void i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'uk'],
    detection: {
      order: ['customNavigatorOrLocalStorage', 'querystring', 'cookie', 'localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export { i18n }

