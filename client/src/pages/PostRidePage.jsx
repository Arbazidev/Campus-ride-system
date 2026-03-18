import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/user/userSlice'
import { addRide } from '../features/rides/rideSlice'
import { fromInputDateTimeValue, toInputDateTimeValue } from '../app/utils'

function defaultDeparture() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  // Keep it local-time-ish for datetime-local: convert to ISO then to local input value.
  return toInputDateTimeValue(d.toISOString())
}

export default function PostRidePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentUser = useAppSelector((state) => selectCurrentUser(state))

  const [form, setForm] = useState({
    pickupLocation: '',
    destination: '',
    departureTimeLocal: defaultDeparture(),
    availableSeats: '1',
    vehicleType: '',
    contactInfo: '',
    notes: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const driverName = useMemo(() => currentUser?.name ?? '', [currentUser])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!currentUser) return
    setLoading(true)
    try {
      const departureTime = fromInputDateTimeValue(form.departureTimeLocal)
      const result = await dispatch(
        addRide({
          driverUserId: currentUser.id,
          driverName,
          pickupLocation: form.pickupLocation,
          destination: form.destination,
          departureTime,
          availableSeats: Number(form.availableSeats),
          vehicleType: form.vehicleType,
          contactInfo: form.contactInfo,
          notes: form.notes || undefined,
        }),
      ).unwrap()

      navigate(`/rides/${result.ride.id}`, { replace: true })
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message ?? 'Could not post ride.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">Post a new ride</h1>
        <p className="muted">Create an offer for other students to book seats.</p>
      </div>

      <div className="card">
        <h2 className="subtitle">Ride offer details</h2>
        {error ? <div className="alert alert--error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <div className="form-row">
            <label className="field">
              <span className="field__label">Pickup location</span>
              <input
                className="input"
                value={form.pickupLocation}
                onChange={(e) => setForm((s) => ({ ...s, pickupLocation: e.target.value }))}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Destination</span>
              <input
                className="input"
                value={form.destination}
                onChange={(e) => setForm((s) => ({ ...s, destination: e.target.value }))}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span className="field__label">Departure time</span>
              <input
                className="input"
                type="datetime-local"
                value={form.departureTimeLocal}
                onChange={(e) => setForm((s) => ({ ...s, departureTimeLocal: e.target.value }))}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Available seats</span>
              <input
                className="input"
                value={form.availableSeats}
                onChange={(e) => setForm((s) => ({ ...s, availableSeats: e.target.value }))}
                required
                inputMode="numeric"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span className="field__label">Vehicle type</span>
              <input
                className="input"
                value={form.vehicleType}
                onChange={(e) => setForm((s) => ({ ...s, vehicleType: e.target.value }))}
                required
                placeholder="e.g., Sedan"
              />
            </label>
            <label className="field">
              <span className="field__label">Contact information</span>
              <input
                className="input"
                value={form.contactInfo}
                onChange={(e) => setForm((s) => ({ ...s, contactInfo: e.target.value }))}
                required
                placeholder="Email or phone"
              />
            </label>
          </div>

          <label className="field">
            <span className="field__label">Notes / description (optional)</span>
            <textarea
              className="input input--textarea"
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              rows={4}
              placeholder="Any details riders should know..."
            />
          </label>

          <div className="form-actions">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post ride'}
            </button>
            <Link to="/rides" className="btn btn--ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

