import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { changePassword } from '../features/user/userSlice'

export default function ChangePasswordPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap()
      setSuccess('Password updated successfully.')
      setOldPassword('')
      setNewPassword('')
      setTimeout(() => navigate('/dashboard', { replace: true }), 800)
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message ?? 'Password change failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack">
      <div className="page-head">
        <h1 className="title">Change password</h1>
        <p className="muted">Update your password after logging in.</p>
      </div>

      <div className="card">
        <h2 className="subtitle">Security</h2>
        {error ? <div className="alert alert--error">{error}</div> : null}
        {success ? <div className="alert alert--ok">{success}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="field__label">Old password</span>
            <input
              className="input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">New password</span>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <div className="form-actions">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
            <Link to="/dashboard" className="btn btn--ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

