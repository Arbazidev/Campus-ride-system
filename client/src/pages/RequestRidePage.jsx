import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectCurrentUser, selectUserById } from '../features/user/userSlice'
import { selectRideById, requestRide } from '../features/rides/rideSlice'

export default function RequestRidePage() {
  const { rideId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const ride = useAppSelector((state) => selectRideById(state, rideId))
  const currentUser = useAppSelector((state) => selectCurrentUser(state))
  const driver = useAppSelector((state) =>
    ride ? selectUserById(state, ride.driverUserId) : null,
  )

  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const canRequest = !!ride && !!currentUser
  const title = useMemo(() => (driver?.name ? `Requesting from ${driver.name}` : 'Requesting ride'), [driver])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!ride || !currentUser) return
    setLoading(true)
    try {
      await dispatch(
        requestRide({
          rideId: ride.id,
          requesterId: currentUser.id,
          message: message || undefined,
        }),
      ).unwrap()
      navigate(`/rides/${ride.id}`, { replace: true })
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message ?? 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!ride) {
    return (
      <div className="card card--soft">
        <h1 className="title">Ride not found</h1>
        <Link to="/rides" className="btn btn--primary">
          Back to rides
        </Link>
      </div>
    )
  }

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">{title}</h1>
        <p className="muted">
          Pickup: {ride.pickupLocation} → {ride.destination}
        </p>
      </div>

      <div className="card">
        <h2 className="subtitle">Send a ride request</h2>
        {error ? <div className="alert alert--error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="field__label">Message (optional)</span>
            <textarea
              className="input input--textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your schedule or any details..."
            />
          </label>

          <div className="form-actions">
            <button className="btn btn--primary" type="submit" disabled={!canRequest || loading}>
              {loading ? 'Sending...' : 'Send request'}
            </button>
            <Link to={`/rides/${ride.id}`} className="btn btn--ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

