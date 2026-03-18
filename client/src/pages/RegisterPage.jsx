import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { registerUser } from '../features/user/userSlice'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    major: '',
    year: '',
    bio: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await dispatch(
        registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          major: form.major || undefined,
          year: form.year || undefined,
          bio: form.bio || undefined,
        }),
      ).unwrap()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-two">
      <div className="card">
        <h1 className="title">Create account</h1>
        <p className="muted">Post rides and book seats within your campus community.</p>
        {error ? <div className="alert alert--error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <div className="form-row">
            <label className="field">
              <span className="field__label">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="input"
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Email</span>
              <input
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="input"
                type="email"
                required
              />
            </label>
          </div>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              className="input"
              type="password"
              required
              minLength={6}
            />
          </label>

          <div className="form-row">
            <label className="field">
              <span className="field__label">Phone (optional)</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                className="input"
              />
            </label>

            <label className="field">
              <span className="field__label">Year (optional)</span>
              <input
                value={form.year}
                onChange={(e) => setForm((s) => ({ ...s, year: e.target.value }))}
                className="input"
                placeholder="e.g., 2"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span className="field__label">Major (optional)</span>
              <input
                value={form.major}
                onChange={(e) => setForm((s) => ({ ...s, major: e.target.value }))}
                className="input"
              />
            </label>

            <label className="field">
              <span className="field__label">Bio (optional)</span>
              <input
                value={form.bio}
                onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
                className="input"
              />
            </label>
          </div>

          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="muted small">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>

      <div className="card card--soft">
        <h2 className="title-small">How it works</h2>
        <p className="muted">
          After registering you’ll be redirected to your dashboard. From there you can post rides, request rides, and book seats.
        </p>
      </div>
    </div>
  )
}

