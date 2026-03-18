export type ThemeMode = 'light' | 'dark'
export type Accent = 'slate' | 'sky' | 'emerald' | 'violet'

const STORAGE_KEYS = {
  theme: 'theme',
  accent: 'accent',
} as const

export function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEYS.theme) as ThemeMode | null
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function applyThemeMode(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function persistThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEYS.theme, mode)
}

export function getInitialAccent(): Accent {
  if (typeof window === 'undefined') return 'slate'

  const stored = window.localStorage.getItem(STORAGE_KEYS.accent) as Accent | null
  if (stored === 'slate' || stored === 'sky' || stored === 'emerald' || stored === 'violet') {
    return stored
  }
  return 'slate'
}

export function applyAccent(accent: Accent) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.accent = accent
}

export function persistAccent(accent: Accent) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEYS.accent, accent)
}

