import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { firebaseAuth, googleProvider } from '@/lib/firebase'
import { api } from '@/api/client'

export function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(firebaseAuth, googleProvider ?? provider)
    const idToken = await result.user.getIdToken()

    await api.post('/auth/google', { idToken })

    navigate('/profile')
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Увійти в AutoHub</h1>
      <p className="mt-2 text-muted-foreground">
        Авторизуйся через Google, щоб зберігати дані по своєму авто.
      </p>
      <button
        type="button"
        onClick={handleLogin}
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Увійти через Google
      </button>
    </main>
  )
}

