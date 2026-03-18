import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/user/userSlice'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const currentUser = useAppSelector((state) => selectCurrentUser(state))

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

