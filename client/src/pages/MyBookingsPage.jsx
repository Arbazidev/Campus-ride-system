import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/user/userSlice'
import { selectBookingsForUser, selectRides } from '../features/rides/rideSlice'

function formatDateTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

export default function MyBookingsPage() {
  const currentUser = useAppSelector((state) => selectCurrentUser(state))
  const rides = useAppSelector((state) => selectRides(state))
  const bookings = useAppSelector((state) =>
    currentUser ? selectBookingsForUser(state, currentUser.id) : [],
  )

  const bookedRides = bookings
    .map((b) => {
      const ride = rides.find((r) => r.id === b.rideId)
      return ride ? { ride, booking: b } : null
    })
    .filter(Boolean)

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">My bookings</h1>
        <p className="muted">These are the rides you’ve booked.</p>
      </div>

      {bookedRides.length === 0 ? (
        <div className="card card--soft">
          <h2 className="subtitle">No bookings yet</h2>
          <p className="muted">Browse rides and book a seat to see it here.</p>
          <Link to="/rides" className="btn btn--primary">
            Browse rides
          </Link>
        </div>
      ) : (
        <div className="ride-list">
          {bookedRides.map(({ ride, booking }) => (
            <Link key={booking.id} to={`/rides/${ride.id}`} className="ride-card ride-card--selected">
              <div className="ride-card__top">
                <div className="ride-card__title">{ride.driverName}</div>
                <div className="tag">{ride.vehicleType}</div>
              </div>

              <div className="ride-card__body">
                <div className="kv-row">
                  <div className="kv-row__k">From</div>
                  <div className="kv-row__v">{ride.pickupLocation}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-row__k">To</div>
                  <div className="kv-row__v">{ride.destination}</div>
                </div>
                <div className="kv-row">
                  <div className="kv-row__k">Departure</div>
                  <div className="kv-row__v">{formatDateTime(ride.departureTime)}</div>
                </div>
              </div>

              <div className="ride-card__bottom">
                <div className="seats">
                  Booked on <span className="seats__n">{formatDateTime(booking.bookedAt)}</span>
                </div>
                <div className="ride-card__cta">View details</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

