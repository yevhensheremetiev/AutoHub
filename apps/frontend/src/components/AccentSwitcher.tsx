import { useCallback, useEffect, useState } from 'react'

import {
  applyAccent,
  getInitialAccent,
  persistAccent,
  type Accent,
} from '@/lib/appearance'
import { Text } from '@/components/ui/text'

const ACCENTS: Array<{ value: Accent; label: string; swatchClassName: string }> = [
  { value: 'slate', label: 'Slate', swatchClassName: 'bg-slate-700' },
  { value: 'sky', label: 'Sky', swatchClassName: 'bg-sky-500' },
  { value: 'emerald', label: 'Emerald', swatchClassName: 'bg-emerald-500' },
  { value: 'violet', label: 'Violet', swatchClassName: 'bg-violet-500' },
]

export function AccentSwitcher() {
  const [accent, setAccent] = useState<Accent>(() => getInitialAccent())

  useEffect(() => {
    applyAccent(accent)
    persistAccent(accent)
  }, [accent])

  const handleSetAccent = useCallback((next: Accent) => setAccent(next), [])

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background p-1 shadow-sm">
      {ACCENTS.map((item) => {
        const isActive = item.value === accent
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => handleSetAccent(item.value)}
            className={[
              'inline-flex h-7 w-7 items-center justify-center rounded-full transition',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
              isActive ? 'bg-primary/10 ring-1 ring-primary/50' : '',
            ].join(' ')}
            aria-label={`Accent: ${item.label}`}
            aria-pressed={isActive}
            title={item.label}
          >
            <Text
              as="span"
              aria-hidden="true"
              className={`h-3.5 w-3.5 rounded-full ${item.swatchClassName}`}
            />
          </button>
        )
      })}
    </div>
  )
}

