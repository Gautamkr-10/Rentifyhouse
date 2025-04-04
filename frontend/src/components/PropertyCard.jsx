"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart, FaMapMarkerAlt } from "react-icons/fa"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import "./PropertyCard.css"

function PropertyCard({ property, isSeller, onDelete, user, onLike }) {
  const [isLiked, setIsLiked] = useState(property.isLiked || false)
  const [likeCount, setLikeCount] = useState(property.likes || 0)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)

    try {
      // Toggle like state
      const newIsLiked = !isLiked
      setIsLiked(newIsLiked)

      // Update like count
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1
      setLikeCount(newLikeCount)

      // Notify parent component
      if (onLike) {
        onLike(property._id, newLikeCount)
      }

      // Show success toast
      toast.success(newIsLiked ? "Property liked!" : "Property unliked!")

      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    } catch (err) {
      console.error("Failed to like property:", err)
      toast.error("Failed to like property")
      setIsLoading(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(property._id)
    }
  }

  return (
    <motion.div
      className="property-card"
      whileHover={{
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="property-image-container">
        <img src={property.imageUrl || "/placeholder-property.jpg"} alt={property.title} className="property-image" />
        <div className="property-price">₹{property.price.toLocaleString()}/month</div>
        {!isSeller && (
          <button
            onClick={handleLike}
            className={`like-button ${isLiked ? "active" : ""}`}
            disabled={isLoading}
            aria-label={isLiked ? "Unlike property" : "Like property"}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </motion.div>
          </button>
        )}
      </div>

      <div className="property-info">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">
          <FaMapMarkerAlt />
          {property.location}
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

        <div className="property-actions">
          <Link to={`/property/${property._id}`} className="view-details-btn">
            View Details
          </Link>

          {isSeller && (
            <div className="seller-actions">
              <Link to={`/edit-property/${property._id}`} className="edit-btn">
                Edit
              </Link>
              <button onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            </div>
          )}

          {!isSeller && (
            <div className="like-count">
              <span>{likeCount}</span>
              <FaHeart />
            </div>
          )}
        </div>
      </div>

      <motion.div
        className="property-card-shine"
        animate={{
          x: isHovered ? ["0%", "100%"] : "0%",
          opacity: isHovered ? [0, 0.5, 0] : 0,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

export default PropertyCard

