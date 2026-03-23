import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
        metricInventoryDesc:
          'All cars, statuses and prices in a single system.',
        metricLeads: 'Lead management',
        metricLeadsDesc:
          'Don’t lose requests – keep your sales funnel under control.',
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
        footerNote:
          'After signing in you will land in a dashboard with your inventory and leads.',
        rightsReserved: 'All rights reserved.',
      },
      auth: {
        loginTitle: 'Sign in to AutoHub',
        loginDescription:
          'Use your email and password, or continue with Google.',
        signUpTitle: 'Create your AutoHub account',
        signUpDescription:
          'Enter your details and password, or continue with Google.',
        firstNameLabel: 'First name',
        lastNameLabel: 'Last name',
        firstNamePlaceholder: 'Jane',
        lastNamePlaceholder: 'Doe',
        signUpSubmit: 'Create account',
        signUpWithGoogle: 'Sign up with Google',
        emailAlreadyInUse: 'This email is already in use',
        signUpFailed: 'Could not create account. Try again.',
        signInFailed: 'Could not sign in. Try again.',
        invalidCredentials: 'Invalid email or password.',
        noAccountPrompt: "Don't have an account?",
        hasAccountPrompt: 'Already have an account?',
        confirmPasswordPlaceholderSignUp: 'Repeat password',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        emailPlaceholder: 'you@example.com',
        passwordPlaceholder: '••••••••',
        signIn: 'Sign in',
        forgotPassword: 'Forgot password?',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        orContinueWith: 'or',
        loginWithGoogle: 'Sign in with Google',
        signUp: 'Sign up',
        backToHome: 'Back to home',
        forgotPasswordTitle: 'Reset your password',
        forgotPasswordDescription:
          'Enter the email for your account. We will send you a link to set a new password.',
        forgotPasswordSubmit: 'Send request',
        backToLogin: 'Back to sign in',
        resetPasswordTitle: 'Set a new password',
        resetPasswordDescription:
          'Use the link from your email to open this page, then enter and confirm your new password. Use at least 8 characters with uppercase, lowercase, a digit, and a symbol.',
        newPasswordLabel: 'New password',
        confirmPasswordLabel: 'Confirm password',
        newPasswordPlaceholder: '••••••••',
        confirmPasswordPlaceholder: 'Repeat new password',
        resetPasswordSubmit: 'Save new password',
        resetPasswordInvalidTitle: 'Link not valid',
        resetPasswordInvalidDescription:
          'This page must be opened from the reset link in your email. The link may be missing, expired, or already used.',
        resetPasswordRequestNewLink: 'Request a new reset email',
        validation: {
          firstNameRequired: 'First name is required',
          lastNameRequired: 'Last name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Enter a valid email address',
          passwordRequired: 'Password is required',
          passwordMinLength: 'At least 8 characters',
          passwordLowercase: 'Add at least one lowercase letter',
          passwordUppercase: 'Add at least one uppercase letter',
          passwordDigit: 'Add at least one digit',
          passwordSpecial: 'Add at least one special character (!@#$…)',
          confirmPasswordRequired: 'Confirm your password',
          passwordsMustMatch: 'Passwords do not match',
        },
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
        ohNo: 'Oh no! Really?',
        description:
          'The link may be outdated, or the page may have been moved. Check the address or return to where everything works.',
        goBack: 'Go back',
        backToHome: 'Back to home',
        illustrationAriaLabel: '404 illustration',
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
        metricLeadsDesc:
          'Не губіть запити – вся воронка продажів під контролем.',
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
        footerNote:
          'Після входу ви потрапите до дашборду з автопарком та лідами.',
        rightsReserved: 'Всі права захищено.',
      },
      auth: {
        loginTitle: 'Увійти в AutoHub',
        loginDescription:
          'Введіть email і пароль або продовжіть через Google.',
        signUpTitle: 'Створити акаунт AutoHub',
        signUpDescription:
          'Вкажіть ім’я, прізвище та пароль або продовжіть через Google.',
        firstNameLabel: 'Ім’я',
        lastNameLabel: 'Прізвище',
        firstNamePlaceholder: 'Олена',
        lastNamePlaceholder: 'Шевченко',
        signUpSubmit: 'Створити акаунт',
        signUpWithGoogle: 'Зареєструватись через Google',
        emailAlreadyInUse: 'Цей email уже використовується',
        signUpFailed: 'Не вдалося створити акаунт. Спробуйте ще раз.',
        signInFailed: 'Не вдалося увійти. Спробуйте ще раз.',
        invalidCredentials: 'Невірний email або пароль.',
        noAccountPrompt: 'Немає акаунта?',
        hasAccountPrompt: 'Вже є акаунт?',
        confirmPasswordPlaceholderSignUp: 'Повторіть пароль',
        emailLabel: 'Email',
        passwordLabel: 'Пароль',
        emailPlaceholder: 'you@example.com',
        passwordPlaceholder: '••••••••',
        signIn: 'Увійти',
        forgotPassword: 'Забув пароль?',
        showPassword: 'Показати пароль',
        hidePassword: 'Приховати пароль',
        orContinueWith: 'або',
        loginWithGoogle: 'Увійти через Google',
        signUp: 'Створити акаунт',
        backToHome: 'На головну',
        forgotPasswordTitle: 'Відновлення пароля',
        forgotPasswordDescription:
          'Вкажіть email акаунта — надішлемо посилання для нового пароля.',
        forgotPasswordSubmit: 'Надіслати запит',
        backToLogin: 'Назад до входу',
        resetPasswordTitle: 'Новий пароль',
        resetPasswordDescription:
          'Відкрийте цю сторінку з посилання в листі, потім введіть і підтвердіть новий пароль. Мінімум 8 символів: велика й мала літери, цифра та спецсимвол.',
        newPasswordLabel: 'Новий пароль',
        confirmPasswordLabel: 'Підтвердження пароля',
        newPasswordPlaceholder: '••••••••',
        confirmPasswordPlaceholder: 'Повторіть новий пароль',
        resetPasswordSubmit: 'Зберегти новий пароль',
        resetPasswordInvalidTitle: 'Посилання недійсне',
        resetPasswordInvalidDescription:
          'Цю сторінку потрібно відкривати з посилання в листі. Посилання може бути простроченим, уже використаним або відсутнім.',
        resetPasswordRequestNewLink: 'Надіслати новий лист',
        validation: {
          firstNameRequired: 'Вкажіть ім’я',
          lastNameRequired: 'Вкажіть прізвище',
          emailRequired: 'Вкажіть email',
          emailInvalid: 'Некоректна адреса email',
          passwordRequired: 'Вкажіть пароль',
          passwordMinLength: 'Мінімум 8 символів',
          passwordLowercase: 'Додайте хоча б одну малу літеру',
          passwordUppercase: 'Додайте хоча б одну велику літеру',
          passwordDigit: 'Додайте хоча б одну цифру',
          passwordSpecial: 'Додайте хоча б один спецсимвол (!@#$…)',
          confirmPasswordRequired: 'Підтвердіть пароль',
          passwordsMustMatch: 'Паролі не збігаються',
        },
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
        yearLabelOptional: 'Рік (необовʼязково)',
        vinLabelOptional: 'VIN (необовʼязково)',
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
        ohNo: 'Ой-ой! Справді?',
        description:
          'Можливо, посилання застаріло, або сторінку перенесли. Перевірте адресу або поверніться туди, де все працює.',
        goBack: 'Повернутись назад',
        backToHome: 'На головну',
        illustrationAriaLabel: 'Ілюстрація 404',
      },
      languageSwitcher: {
        label: 'Мова',
        en: 'Англійська',
        uk: 'Українська',
      },
    },
  },
} as const;

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'customNavigatorOrLocalStorage',
  lookup: () => {
    if (typeof window === 'undefined') return undefined;

    const stored = window.localStorage.getItem('i18nextLng');
    if (stored) return stored;

    const navLang =
      window.navigator.languages?.[0] ?? window.navigator.language;
    if (!navLang) return undefined;

    if (navLang.toLowerCase().startsWith('uk')) return 'uk';
    return 'en';
  },
});

void i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'uk'],
    detection: {
      order: [
        'customNavigatorOrLocalStorage',
        'querystring',
        'cookie',
        'localStorage',
        'navigator',
      ],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export { i18n };
