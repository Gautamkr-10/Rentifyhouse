"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaBell, FaUser, FaEnvelope, FaPhone, FaHome } from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"
import Pagination from "../components/Pagination"

function InterestedBuyers({ user }) {
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const interestsPerPage = 10

  useEffect(() => {
    fetchInterestedBuyers()
  }, [currentPage])

  const fetchInterestedBuyers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/interests?page=${currentPage}&limit=${interestsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      setInterests(response.data.interests)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (err) {
      toast.error("Failed to fetch interested buyers")
      setError("Failed to fetch interested buyers")
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="dashboard-title">
        <FaBell className="inline-block mr-2" />
        Interested Buyers
      </h1>

      {error && <div className="error-message">{error}</div>}

      {interests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaBell />
          </div>
          <h2 className="empty-state-title">No Interested Buyers Yet</h2>
          <p className="empty-state-description">
            When buyers express interest in your properties, you'll see their information here.
          </p>
        </div>
      ) : (
        <>
          <div className="interests-list">
            {interests.map((interest) => (
              <div key={interest._id} className="notification">
                <div className="notification-content">
                  <h3 className="notification-title">
                    <FaUser className="inline-block mr-2" />
                    {interest.buyer.firstName} {interest.buyer.lastName} is interested in your property
                  </h3>
                  <p className="notification-message">
                    <FaHome className="inline-block mr-2" />
                    <strong>Property:</strong> {interest.property.title}
                  </p>
                  <div className="seller-contact mt-20">
                    <p>
                      <FaEnvelope className="inline-block mr-2" />
                      <strong>Email:</strong> {interest.buyer.email}
                    </p>
                    <p>
                      <FaPhone className="inline-block mr-2" />
                      <strong>Phone:</strong> {interest.buyer.phone}
                    </p>
                  </div>
                  <p className="notification-time">Interested on: {new Date(interest.createdAt).toLocaleString()}</p>
                </div>
                <div className="notification-actions">
                  <Link to={`/property/${interest.property._id}`} className="btn btn-primary">
                    View Property
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  )
}

export default InterestedBuyers

