"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import PropertyCard from "../components/PropertyCard"
import PropertyFilter from "../components/PropertyFilter"
import Pagination from "../components/Pagination"
import { FaSearch } from "react-icons/fa"
import { motion } from "framer-motion"


// Sample Indian properties data
const sampleProperties = [
  {
    _id: "prop1",
    title: "Luxury Apartment in South Mumbai",
    description: "Beautiful sea-facing apartment with modern amenities",
    location: "Mumbai",
    price: 85000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: true,
    nearbySchool: true,
    likes: 24,
    isLiked: false,
  },
  {
    _id: "prop2",
    title: "Spacious Villa in Whitefield",
    description: "Elegant villa with garden and swimming pool",
    location: "Bangalore",
    price: 120000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: true,
    nearbySchool: true,
    likes: 18,
    isLiked: false,
  },
  {
    _id: "prop3",
    title: "Modern Flat in Connaught Place",
    description: "Centrally located apartment with great connectivity",
    location: "Delhi",
    price: 65000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: true,
    nearbySchool: false,
    likes: 15,
    isLiked: false,
  },
  {
    _id: "prop4",
    title: "Sea View Apartment in Besant Nagar",
    description: "Beautiful apartment with beach view and modern amenities",
    location: "Chennai",
    price: 60000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: false,
    nearbySchool: true,
    likes: 12,
    isLiked: false,
  },
  {
    _id: "prop5",
    title: "Luxury Penthouse in Jubilee Hills",
    description: "Exclusive penthouse with panoramic city views",
    location: "Hyderabad",
    price: 95000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: true,
    nearbySchool: true,
    likes: 29,
    isLiked: false,
  },
  {
    _id: "prop6",
    title: "Garden Apartment in Koregaon Park",
    description: "Serene apartment with private garden and club access",
    location: "Pune",
    price: 55000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: true,
    nearbySchool: false,
    likes: 14,
    isLiked: false,
  },
  {
    _id: "prop7",
    title: "Heritage Home in Park Street",
    description: "Renovated colonial-era home with modern comforts",
    location: "Kolkata",
    price: 70000,
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: false,
    nearbySchool: true,
    likes: 9,
    isLiked: false,
  },
  {
    _id: "prop8",
    title: "Royal Haveli in Civil Lines",
    description: "Traditional haveli with modern amenities and courtyard",
    location: "Jaipur",
    price: 85000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    nearbyHospital: true,
    nearbySchool: true,
    likes: 21,
    isLiked: false,
  },
]

function BuyerDashboard({ user }) {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeFilters, setActiveFilters] = useState({})
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const locationFilter = searchParams.get("location")

  const propertiesPerPage = 6

  useEffect(() => {
    // Simulate fetching properties from API
    setLoading(true)
    setTimeout(() => {
      try {
        // If location filter is provided, apply it
        const initialFilters = {}
        if (locationFilter) {
          initialFilters.location = locationFilter
        }

        setActiveFilters(initialFilters)
        setProperties(sampleProperties)

        // Apply initial filters if any
        if (Object.keys(initialFilters).length > 0) {
          const filtered = applyFilters(sampleProperties, initialFilters)
          setFilteredProperties(filtered)
          setTotalPages(Math.ceil(filtered.length / propertiesPerPage))
        } else {
          setFilteredProperties(sampleProperties)
          setTotalPages(Math.ceil(sampleProperties.length / propertiesPerPage))
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching properties:", err)
        toast.error("Failed to fetch properties")
        setError("Failed to fetch properties")
        setLoading(false)
      }
    }, 1000)
  }, [locationFilter])

  // Helper function to apply filters
  const applyFilters = (properties, filters) => {
    return properties.filter((property) => {
      // Location filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Price filters
      if (filters.minPrice && property.price < Number.parseInt(filters.minPrice)) {
        return false
      }

      if (filters.maxPrice && property.price > Number.parseInt(filters.maxPrice)) {
        return false
      }

      // Bedroom filter
      if (filters.bedrooms && property.bedrooms < Number.parseInt(filters.bedrooms)) {
        return false
      }

      // Bathroom filter
      if (filters.bathrooms && property.bathrooms < Number.parseInt(filters.bathrooms)) {
        return false
      }

      // Area filters
      if (filters.minArea && property.area < Number.parseInt(filters.minArea)) {
        return false
      }

      if (filters.maxArea && property.area > Number.parseInt(filters.maxArea)) {
        return false
      }

      // Nearby amenities
      if (filters.nearbyHospital && !property.nearbyHospital) {
        return false
      }

      if (filters.nearbySchool && !property.nearbySchool) {
        return false
      }

      // If all filters pass, include the property
      return true
    })
  }

  const handleFilter = (filters) => {
    setActiveFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change

    // Apply filters to properties
    const filtered = applyFilters(properties, filters)
    setFilteredProperties(filtered)
    setTotalPages(Math.ceil(filtered.length / propertiesPerPage))

    // Show toast notification
    if (filtered.length === 0) {
      toast.info("No properties match your filters")
    } else {
      toast.success(`Found ${filtered.length} properties`)
    }
  }

  const handleLike = (propertyId, newLikeCount) => {
    // Update like count in the properties state
    setProperties(
      properties.map((property) =>
        property._id === propertyId ? { ...property, likes: newLikeCount, isLiked: !property.isLiked } : property,
      ),
    )

    setFilteredProperties(
      filteredProperties.map((property) =>
        property._id === propertyId ? { ...property, likes: newLikeCount, isLiked: !property.isLiked } : property,
      ),
    )
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get current properties for pagination
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty)

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="buyer-dashboard">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Browse Properties
      </motion.h1>

      {error && <div className="error-message">{error}</div>}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PropertyFilter onFilter={handleFilter} initialFilters={activeFilters} />
      </motion.div>

      {filteredProperties.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="empty-state-icon">
            <FaSearch />
          </div>
          <h2 className="empty-state-title">No Properties Found</h2>
          <p className="empty-state-description">
            No properties match your search criteria. Try adjusting your filters.
          </p>
          <button onClick={() => handleFilter({})} className="btn btn-primary">
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <>
          <div className="property-grid">
            {currentProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <PropertyCard property={property} isSeller={false} user={user} onLike={handleLike} />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

export default BuyerDashboard

