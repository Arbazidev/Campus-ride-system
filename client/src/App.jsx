import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AllRidesPage from './pages/AllRidesPage.jsx'
import RideDetailsPage from './pages/RideDetailsPage.jsx'
import PostRidePage from './pages/PostRidePage.jsx'
import RequestRidePage from './pages/RequestRidePage.jsx'
import MyBookingsPage from './pages/MyBookingsPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { useAppSelector } from './app/hooks'
import { selectCurrentUser } from './features/user/userSlice'

function HomeRedirect() {
  const currentUser = useAppSelector((state) => selectCurrentUser(state))
  return <Navigate to={currentUser ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/rides" element={<AllRidesPage />} />
        <Route path="/rides/:rideId" element={<RideDetailsPage />} />
        <Route path="/rides/post" element={<RequireAuth><PostRidePage /></RequireAuth>} />
        <Route path="/rides/:rideId/request" element={<RequireAuth><RequestRidePage /></RequireAuth>} />

        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/bookings" element={<RequireAuth><MyBookingsPage /></RequireAuth>} />
        <Route path="/change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
        <Route path="/users/:userId" element={<UserProfilePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

