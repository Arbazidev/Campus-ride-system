import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/user/userSlice'

export default function DashboardPage() {
  const currentUser = useAppSelector((state) => selectCurrentUser(state))

  return (
    <div className="stack">
      <div className="hero-card">
        <h1 className="title">Welcome, {currentUser?.name}</h1>
        <p className="muted">
          Use the dashboard to post rides, request rides, and manage your bookings.
        </p>
      </div>

      <div className="grid-three">
        <Link to="/rides/post" className="tile">
          <h2 className="tile__title">Post a ride</h2>
          <p className="muted">Offer your route and available seats.</p>
        </Link>
        <Link to="/rides" className="tile">
          <h2 className="tile__title">Search rides</h2>
          <p className="muted">Find rides using URL filters.</p>
        </Link>
        <Link to="/bookings" className="tile">
          <h2 className="tile__title">My bookings</h2>
          <p className="muted">View rides you’ve booked.</p>
        </Link>
      </div>

      <div className="grid-two">
        <Link to="/change-password" className="tile tile--soft">
          <h2 className="tile__title">Change password</h2>
          <p className="muted">Keep your account secure.</p>
        </Link>
        {currentUser ? (
          <Link to={`/users/${currentUser.id}`} className="tile tile--soft">
            <h2 className="tile__title">My profile</h2>
            <p className="muted">View and share your student details.</p>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

