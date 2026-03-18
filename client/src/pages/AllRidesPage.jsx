import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectRides } from '../features/rides/rideSlice'

function parseDate(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d
}

function formatDateTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

function containsCI(haystack, needle) {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

export default function AllRidesPage() {
  const rides = useAppSelector((state) => selectRides(state))
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const urlFilters = useMemo(
    () => ({
      pickup: searchParams.get('pickup') ?? '',
      destination: searchParams.get('destination') ?? '',
      vehicle: searchParams.get('vehicle') ?? '',
      seatsMin: searchParams.get('seats') ?? '',
      after: searchParams.get('after') ?? '',
      before: searchParams.get('before') ?? '',
    }),
    [searchParams],
  )

  const filtered = useMemo(() => {
    const pickup = urlFilters.pickup.trim()
    const destination = urlFilters.destination.trim()
    const vehicle = urlFilters.vehicle.trim()
    const seatsMin = urlFilters.seatsMin.trim() ? Number(urlFilters.seatsMin.trim()) : null
    const afterD = parseDate(urlFilters.after)
    const beforeD = parseDate(urlFilters.before)

    return rides
      .filter((r) => {
        if (pickup && !containsCI(r.pickupLocation, pickup)) return false
        if (destination && !containsCI(r.destination, destination)) return false
        if (vehicle && !containsCI(r.vehicleType, vehicle)) return false
        if (seatsMin !== null && Number.isFinite(seatsMin) && r.availableSeats < seatsMin) return false
        if (afterD && new Date(r.departureTime) < afterD) return false
        if (beforeD && new Date(r.departureTime) > beforeD) return false
        return true
      })
      .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
  }, [rides, urlFilters])

  function FiltersPanel({ initialFilters }) {
    const [draft, setDraft] = useState(initialFilters)

    const applyFilters = (e) => {
      e.preventDefault()
      const next = new URLSearchParams()
      if (draft.pickup.trim()) next.set('pickup', draft.pickup.trim())
      if (draft.destination.trim()) next.set('destination', draft.destination.trim())
      if (draft.vehicle.trim()) next.set('vehicle', draft.vehicle.trim())
      if (draft.seatsMin.trim()) next.set('seats', draft.seatsMin.trim())
      if (draft.after.trim()) next.set('after', draft.after.trim())
      if (draft.before.trim()) next.set('before', draft.before.trim())
      setSearchParams(next)
      navigate({ pathname: '/rides', search: next.toString() })
    }

    const clear = () => {
      setSearchParams({})
      navigate('/rides', { replace: true })
    }

    return (
      <div className="card">
        <h2 className="subtitle">Search filters</h2>
        <form onSubmit={applyFilters} className="form">
          <div className="form-row">
            <label className="field">
              <span className="field__label">Pickup location</span>
              <input
                className="input"
                value={draft.pickup}
                onChange={(e) => setDraft((s) => ({ ...s, pickup: e.target.value }))}
                placeholder="e.g., North Gate"
              />
            </label>

            <label className="field">
              <span className="field__label">Destination</span>
              <input
                className="input"
                value={draft.destination}
                onChange={(e) => setDraft((s) => ({ ...s, destination: e.target.value }))}
                placeholder="e.g., Library"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span className="field__label">Vehicle type</span>
              <input
                className="input"
                value={draft.vehicle}
                onChange={(e) => setDraft((s) => ({ ...s, vehicle: e.target.value }))}
                placeholder="e.g., Sedan"
              />
            </label>

            <label className="field">
              <span className="field__label">Seats (min)</span>
              <input
                className="input"
                value={draft.seatsMin}
                onChange={(e) => setDraft((s) => ({ ...s, seatsMin: e.target.value }))}
                placeholder="e.g., 1"
                inputMode="numeric"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span className="field__label">Departure after</span>
              <input
                className="input"
                type="datetime-local"
                value={draft.after}
                onChange={(e) => setDraft((s) => ({ ...s, after: e.target.value }))}
              />
            </label>
            <label className="field">
              <span className="field__label">Departure before</span>
              <input
                className="input"
                type="datetime-local"
                value={draft.before}
                onChange={(e) => setDraft((s) => ({ ...s, before: e.target.value }))}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              Search
            </button>
            <button type="button" className="btn btn--ghost" onClick={clear}>
              Clear
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">Available rides</h1>
        <p className="muted">
          Search and filter using URL parameters. Example: <code className="code-inline">/rides?pickup=North+Gate&seats=2</code>
        </p>
      </div>

      <FiltersPanel key={searchParams.toString()} initialFilters={urlFilters} />

      <div className="ride-list">
        {filtered.length === 0 ? (
          <div className="card card--soft">
            <h2 className="subtitle">No rides match your filters</h2>
            <p className="muted">Try clearing some filters or adjusting the time range.</p>
          </div>
        ) : (
          filtered.map((ride) => (
            <Link key={ride.id} to={`/rides/${ride.id}`} className="ride-card">
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
                  <div className="kv-row__k">Departs</div>
                  <div className="kv-row__v">{formatDateTime(ride.departureTime)}</div>
                </div>
              </div>
              <div className="ride-card__bottom">
                <div className="seats">
                  <span className="seats__n">{ride.availableSeats}</span> seats available
                </div>
                <div className="ride-card__cta">View details</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

