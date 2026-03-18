import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '@/api/client'
import { useMe } from '@/api/hooks'

export function ProfilePage() {
  const navigate = useNavigate()
  const { data: me, isLoading, isError, error } = useMe()

  useEffect(() => {
    if (!isError) return

    const status = (error as any)?.response?.status as number | undefined
    if (status === 401) {
      navigate('/login')
    }
  }, [isError, error, navigate])

  async function handleLogout() {
    await api.post('/auth/logout')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <main className="container py-10">
        <p>Завантаження...</p>
      </main>
    )
  }

  if (!me) {
    return null
  }

  return (
    <main className="container py-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Профіль</h1>
          <p className="mt-1 text-muted-foreground">
            {me.name ?? 'Без імені'} · {me.email ?? 'Без email'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Вийти
        </button>
      </div>
    </main>
  )
}

