import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Сторінку не знайдено</h1>
      <p className="mt-2 text-muted-foreground">
        Повернутися на <Link className="underline" to="/">головну</Link>.
      </p>
    </main>
  )
}

