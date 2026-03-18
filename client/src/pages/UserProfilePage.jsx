import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectUserById } from '../features/user/userSlice'
import { selectRides } from '../features/rides/rideSlice'

function formatYear(year) {
  if (!year) return null
  return `Year ${year}`
}

export default function UserProfilePage() {
  const { userId } = useParams()
  const profile = useAppSelector((state) => selectUserById(state, userId))
  const rides = useAppSelector((state) => selectRides(state))

  const offeredRides = rides.filter((r) => r.driverUserId === userId)

  if (!profile) {
    return (
      <div className="card card--soft">
        <h1 className="title">User not found</h1>
        <p className="muted">This student profile does not exist.</p>
        <Link to="/rides" className="btn btn--primary">
          Browse rides
        </Link>
      </div>
    )
  }

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">{profile.name}</h1>
        <p className="muted">
          {profile.major ? `${profile.major} • ` : ''}
          {formatYear(profile.year) ?? 'Student'}
        </p>
      </div>

      <div className="grid-two">
        <div className="card">
          <h2 className="subtitle">Student profile</h2>
          <div className="kv-grid">
            <div className="kv-cell">
              <div className="kv-cell__k">Email</div>
              <div className="kv-cell__v">{profile.email}</div>
            </div>
            <div className="kv-cell">
              <div className="kv-cell__k">Phone</div>
              <div className="kv-cell__v">{profile.phone ?? '—'}</div>
            </div>
            <div className="kv-cell">
              <div className="kv-cell__k">Major</div>
              <div className="kv-cell__v">{profile.major ?? '—'}</div>
            </div>
            <div className="kv-cell">
              <div className="kv-cell__k">Year</div>
              <div className="kv-cell__v">{profile.year ?? '—'}</div>
            </div>
          </div>

          {profile.bio ? (
            <div className="notes">
              <div className="field__label">Bio</div>
              <div className="muted">{profile.bio}</div>
            </div>
          ) : null}
        </div>

        <div className="card card--soft">
          <h2 className="subtitle">Rides offered</h2>
          {offeredRides.length === 0 ? (
            <p className="muted">No rides posted yet.</p>
          ) : (
            <div className="stack-sm">
              {offeredRides.map((ride) => (
                <Link key={ride.id} to={`/rides/${ride.id}`} className="list-row">
                  <div>
                    <div className="list-row__title">{ride.pickupLocation} → {ride.destination}</div>
                    <div className="muted small">{ride.vehicleType} • {new Date(ride.departureTime).toLocaleString()}</div>
                  </div>
                  <div className="tag">{ride.availableSeats} seats</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

