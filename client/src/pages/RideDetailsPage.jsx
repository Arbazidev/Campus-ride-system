import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  selectBookingsForUser,
  selectRideById,
} from '../features/rides/rideSlice'
import { selectCurrentUser, selectUserById } from '../features/user/userSlice'
import { bookSeat } from '../features/rides/rideSlice'

function formatDateTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

export default function RideDetailsPage() {
  const { rideId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const ride = useAppSelector((state) => selectRideById(state, rideId))
  const currentUser = useAppSelector((state) => selectCurrentUser(state))
  const driver = useAppSelector((state) => (ride ? selectUserById(state, ride.driverUserId) : null))

  const bookingsForUser = useAppSelector((state) =>
    currentUser ? selectBookingsForUser(state, currentUser.id) : [],
  )

  const myBooking = useMemo(() => {
    if (!currentUser) return null
    return bookingsForUser.find((b) => b.rideId === rideId) ?? null
  }, [bookingsForUser, currentUser, rideId])

  const [bookingError, setBookingError] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  const onBook = async () => {
    if (!currentUser) return
    setBookingError(null)
    setBookingLoading(true)
    try {
      await dispatch(bookSeat({ rideId, userId: currentUser.id })).unwrap()
      navigate('/bookings', { replace: true })
    } catch (err) {
      setBookingError(typeof err === 'string' ? err : err?.message ?? 'Booking failed.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (!ride) {
    return (
      <div className="card card--soft">
        <h1 className="title">Ride not found</h1>
        <p className="muted">This ride may have been removed.</p>
        <Link to="/rides" className="btn btn--primary">
          Back to rides
        </Link>
      </div>
    )
  }

  const seatsText = ride.availableSeats === 1 ? '1 seat available' : `${ride.availableSeats} seats available`

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">Ride details</h1>
        <p className="muted">Offered by {ride.driverName}</p>
      </div>

      <div className="grid-two">
        <div className="card">
          <div className="detail-top">
            <div>
              <div className="detail-title">{ride.driverName}</div>
              <div className="tag tag--soft">{ride.vehicleType}</div>
            </div>
            <div className="detail-meta">
              <div className="muted">Departure</div>
              <div className="detail-meta__v">{formatDateTime(ride.departureTime)}</div>
            </div>
          </div>

          <div className="kv-grid">
            <div className="kv-cell">
              <div className="kv-cell__k">Pickup</div>
              <div className="kv-cell__v">{ride.pickupLocation}</div>
            </div>
            <div className="kv-cell">
              <div className="kv-cell__k">Destination</div>
              <div className="kv-cell__v">{ride.destination}</div>
            </div>
            <div className="kv-cell">
              <div className="kv-cell__k">Contact</div>
              <div className="kv-cell__v">{ride.contactInfo}</div>
            </div>
          </div>

          {ride.notes ? (
            <div className="notes">
              <div className="field__label">Notes</div>
              <div className="muted">{ride.notes}</div>
            </div>
          ) : null}

          <div className="detail-provider">
            <div className="field__label">Driver profile</div>
            <div className="provider-card">
              <div className="provider-card__name">{driver?.name ?? ride.driverName}</div>
              <div className="provider-card__meta">
                {driver?.major ? `${driver.major} • ` : ''}
                {driver?.year ? `Year ${driver.year}` : 'Student'}
              </div>
              <div>
                <Link to={`/users/${ride.driverUserId}`} className="btn btn--link">
                  View full profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card card--soft">
          <h2 className="subtitle">Seats & actions</h2>
          <div className="seat-summary">
            <div className="seat-summary__n">{seatsText}</div>
          </div>

          {currentUser ? (
            <div className="stack-sm">
              {myBooking ? (
                <div className="alert alert--ok">You already booked this ride.</div>
              ) : null}

              <button
                type="button"
                className="btn btn--primary"
                onClick={onBook}
                disabled={bookingLoading || !!myBooking || ride.availableSeats <= 0}
              >
                {bookingLoading ? 'Booking...' : 'Book a seat'}
              </button>

              {bookingError ? <div className="alert alert--error">{bookingError}</div> : null}

              <Link
                to={`/rides/${ride.id}/request`}
                className="btn btn--ghost"
                style={{ textAlign: 'center' }}
              >
                Request this ride
              </Link>
            </div>
          ) : (
            <div className="stack-sm">
              <div className="muted">Login to book a seat or request this ride.</div>
              <Link to="/login" className="btn btn--primary">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

