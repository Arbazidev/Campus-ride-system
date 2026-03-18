import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { loginUser } from '../features/user/userSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await dispatch(loginUser({ email, password })).unwrap()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message ?? 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-two">
      <div className="card">
        <h1 className="title">Login</h1>
        <p className="muted">Sign in to post rides and book seats.</p>

        {error ? <div className="alert alert--error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="field__label">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>

          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="muted small">
          New here?{' '}
          <Link to="/register" className="link">
            Create an account
          </Link>
        </p>
      </div>

      <div className="card card--soft">
        <h2 className="title-small">Demo accounts</h2>
        <div className="kv">
          <div>
            <div className="kv__k">Alex</div>
            <div className="kv__v">alex@example.com</div>
            <div className="kv__v muted">Password123!</div>
          </div>
          <div>
            <div className="kv__k">Sam</div>
            <div className="kv__v">sam@example.com</div>
            <div className="kv__v muted">Password123!</div>
          </div>
        </div>
      </div>
    </div>
  )
}

