import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login/${allowedRole || 'stagiaire'}`} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/login/${user.role}`} replace />
  }

  return children
}

export default ProtectedRoute