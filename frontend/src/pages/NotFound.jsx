import { Link } from "react-router-dom"
import { FaHome, FaExclamationTriangle } from "react-icons/fa"

function NotFound() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FaExclamationTriangle />
      </div>
      <h2 className="empty-state-title">404 - Page Not Found</h2>
      <p className="empty-state-description">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        <FaHome className="inline-block mr-2" />
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound

