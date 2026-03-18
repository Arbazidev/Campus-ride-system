import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout, selectCurrentUser } from '../features/user/userSlice'
import './appLayout.css'
import '../styles/app.css'

export default function AppLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentUser = useAppSelector((state) => selectCurrentUser(state))

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header__left">
          <Link className="brand" to="/">
            Campus Ride System
          </Link>
          <nav className="nav">
            <NavLink to="/rides" className="nav__link">
              All Rides
            </NavLink>
            {currentUser ? (
              <>
                <NavLink to="/dashboard" className="nav__link">
                  Dashboard
                </NavLink>
                <NavLink to="/bookings" className="nav__link">
                  My Bookings
                </NavLink>
                <NavLink to="/rides/post" className="nav__link">
                  Post Ride
                </NavLink>
              </>
            ) : null}
          </nav>
        </div>

        <div className="app-header__right">
          {currentUser ? (
            <div className="user-pill">
              <span className="user-pill__name">{currentUser.name}</span>
              <button type="button" className="btn btn--ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className="btn btn--ghost">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn--primary">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <main className="app-container">
        <Outlet />
      </main>
    </div>
  )
}

