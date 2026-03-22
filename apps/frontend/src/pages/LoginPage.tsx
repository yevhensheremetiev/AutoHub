import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { firebaseAuth, googleProvider } from '@/lib/firebase';
import { api } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleLogin() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(
      firebaseAuth,
      googleProvider ?? provider,
    );
    const idToken = await result.user.getIdToken();

    await api.post('/auth/google', { idToken });

    navigate('/profile');
  }

  return (
    <main className="container py-10">
      <Text as="h1" variant="h3">
        {t('auth.loginTitle')}
      </Text>
      <Text className="mt-2" variant="muted">
        {t('auth.loginDescription')}
      </Text>
      <Button type="button" onClick={handleLogin} className="mt-6">
        {t('auth.loginWithGoogle')}
      </Button>
    </main>
  );
}
