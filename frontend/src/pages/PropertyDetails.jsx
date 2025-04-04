"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHospital,
  FaSchool,
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"

function PropertyDetails({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [sellerInfo, setSellerInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showContact, setShowContact] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isInterested, setIsInterested] = useState(false)
  const [interestLoading, setInterestLoading] = useState(false)

  useEffect(() => {
    fetchPropertyDetails()
  }, [id])

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setProperty(response.data.property)
      setIsLiked(response.data.isLiked)
      setLikeCount(response.data.property.likes)
      setIsInterested(response.data.isInterested)

      if (response.data.isInterested) {
        // If already interested, fetch seller info
        fetchSellerInfo()
      }

      setLoading(false)
    } catch (err) {
      setError("Failed to fetch property details")
      toast.error("Failed to fetch property details")
      setLoading(false)
    }
  }

  const fetchSellerInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}/seller`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setSellerInfo(response.data)
      setShowContact(true)
    } catch (err) {
      toast.error("Failed to fetch seller information")
    }
  }

  const handleShowContact = async () => {
    if (interestLoading) return

    setInterestLoading(true)

    try {
      await axios.post(
        `http://localhost:5000/api/properties/${id}/interest`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      fetchSellerInfo()
      setIsInterested(true)
      toast.success("Interest shown successfully! Seller has been notified.")
    } catch (err) {
      toast.error("Failed to show interest")
    } finally {
      setInterestLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/properties/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      setIsLiked(!isLiked)
      setLikeCount(response.data.likes)
    } catch (err) {
      toast.error("Failed to like property")
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div className="property-detail">
      <img
        src={property.imageUrl || "/placeholder-property.jpg"}
        alt={property.title}
        className="property-detail-image"
      />
      <div className="property-detail-info">
        <div className="flex justify-between items-center">
          <h1 className="property-detail-title">{property.title}</h1>
          {user.role === "buyer" && (
            <button onClick={handleLike} className={`like-button ${isLiked ? "active" : ""}`}>
              {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              <span>{likeCount}</span>
            </button>
          )}
        </div>

        <p className="property-detail-location">
          <FaMapMarkerAlt />
          {property.location}
        </p>
        <p className="property-detail-price">₹{property.price.toLocaleString()}/month</p>

        <div className="property-detail-description">
          <h3>Description</h3>
          <p>{property.description}</p>
        </div>

        <div className="property-detail-features">
          <div className="property-detail-feature">
            <FaBed size={20} />
            <span>
              {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </span>
          </div>
          <div className="property-detail-feature">
            <FaBath size={20} />
            <span>
              {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
            </span>
          </div>
          <div className="property-detail-feature">
            <FaRulerCombined size={20} />
            <span>{property.area} sq.ft</span>
          </div>
          {property.nearbyHospital && (
            <div className="property-detail-feature">
              <FaHospital size={20} />
              <span>Hospital Nearby</span>
            </div>
          )}
          {property.nearbySchool && (
            <div className="property-detail-feature">
              <FaSchool size={20} />
              <span>School/College Nearby</span>
            </div>
          )}
        </div>

        {user.role === "buyer" && !showContact && (
          <button onClick={handleShowContact} className="btn btn-primary" disabled={interestLoading}>
            {interestLoading ? "Processing..." : "I'm Interested"}
          </button>
        )}

        {showContact && sellerInfo && (
          <div className="seller-info">
            <h3>Contact Owner</h3>
            <div className="seller-contact">
              <p>
                <FaUser />
                <strong>Name:</strong> {sellerInfo.firstName} {sellerInfo.lastName}
              </p>
              <p>
                <FaEnvelope />
                <strong>Email:</strong> {sellerInfo.email}
              </p>
              <p>
                <FaPhone />
                <strong>Phone:</strong> {sellerInfo.phone}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetails

