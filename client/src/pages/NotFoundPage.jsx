import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="card">
      <h1 className="title">Page not found</h1>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <Link to="/rides" className="btn btn--primary">
        Browse rides
      </Link>
    </div>
  )
}

