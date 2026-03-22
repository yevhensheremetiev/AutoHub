import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/client';
import { useMe } from '@/api/hooks';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

function getErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const response = (err as { response?: unknown }).response;
  if (!response || typeof response !== 'object') return undefined;
  const status = (response as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { data: me, isLoading, isError, error } = useMe();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isError) return;

    const status = getErrorStatus(error);
    if (status === 401) {
      navigate('/login');
    }
  }, [isError, error, navigate]);

  async function handleLogout() {
    await api.post('/auth/logout');
    navigate('/login');
  }

  if (isLoading) {
    return (
      <main className="container py-10">
        <Text variant="muted">{t('profile.loading')}</Text>
      </main>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <main className="container py-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Text as="h1" variant="h3">
            {t('profile.title')}
          </Text>
          <Text className="mt-1" variant="muted">
            {me.name ?? t('profile.noName')} ·{' '}
            {me.email ?? t('profile.noEmail')}
          </Text>
        </div>
        <Button
          type="button"
          onClick={handleLogout}
          variant="outline"
          size="sm"
        >
          {t('profile.logout')}
        </Button>
      </div>
    </main>
  );
}
