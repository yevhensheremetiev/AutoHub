import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';

const SUPPORTED_LANGUAGES = [
  { code: 'en', labelKey: 'languageSwitcher.en' },
  { code: 'uk', labelKey: 'languageSwitcher.uk' },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleChangeLanguage = useCallback(
    (lng: string) => {
      void i18n.changeLanguage(lng);
    },
    [i18n],
  );

  return (
    <div className="flex items-center gap-2">
      <Text as="span" variant="muted" className="text-xs">
        {t('languageSwitcher.label')}:
      </Text>
      <div className="inline-flex rounded-md border border-input bg-background p-0.5 text-xs">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChangeLanguage(lang.code)}
              className={`px-2 py-1 rounded-sm ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground'
              }`}
              aria-pressed={isActive}
            >
              {t(lang.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
