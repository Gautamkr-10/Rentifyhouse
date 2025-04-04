"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaHeart,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"
import Pagination from "../components/Pagination"

function InterestedProperties({ user }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const propertiesPerPage = 6

  useEffect(() => {
    fetchInterestedProperties()
  }, [currentPage])

  const fetchInterestedProperties = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/properties/interested?page=${currentPage}&limit=${propertiesPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      setProperties(response.data.properties)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (err) {
      toast.error("Failed to fetch interested properties")
      setError("Failed to fetch interested properties")
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
        <FaHeart className="inline-block mr-2" />
        Interested Properties
      </h1>

      {error && <div className="error-message">{error}</div>}

      {properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaHeart />
          </div>
          <h2 className="empty-state-title">No Interested Properties</h2>
          <p className="empty-state-description">
            You haven't shown interest in any properties yet. Browse properties and click "I'm Interested" to contact
            owners.
          </p>
          <Link to="/buyer-dashboard" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      ) : (
        <>
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property._id} className="property-card">
                <img
                  src={property.imageUrl || "/placeholder-property.jpg"}
                  alt={property.title}
                  className="property-image"
                />
                <div className="property-info">
                  <h3 className="property-title">{property.title}</h3>
                </div>
                <div className="property-info">
                  <p className="property-location">
                    <FaMapMarkerAlt />
                    {property.location}
                  </p>
                  <p className="property-price">
                    <FaRupeeSign />
                    {property.price.toLocaleString()}/month
                  </p>
                  <div className="property-features">
                    <div className="property-feature">
                      <FaBed />
                      <span>
                        {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                      </span>
                    </div>
                    <div className="property-feature">
                      <FaBath />
                      <span>
                        {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
                      </span>
                    </div>
                    <div className="property-feature">
                      <FaRulerCombined />
                      <span>{property.area} sq.ft</span>
                    </div>
                  </div>

                  <div className="seller-info">
                    <h3>Owner Contact</h3>
                    <div className="seller-contact">
                      <p>
                        <FaUser />
                        <strong>Name:</strong> {property.owner.firstName} {property.owner.lastName}
                      </p>
                      <p>
                        <FaEnvelope />
                        <strong>Email:</strong> {property.owner.email}
                      </p>
                      <p>
                        <FaPhone />
                        <strong>Phone:</strong> {property.owner.phone}
                      </p>
                    </div>
                  </div>

                  <div className="property-actions">
                    <Link to={`/property/${property._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
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

export default InterestedProperties

