import { Navigate, Route, Routes } from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
