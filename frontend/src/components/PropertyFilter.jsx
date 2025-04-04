"use client"

import { useState, useEffect } from "react"
import {
  FaFilter,
  FaSearch,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHospital,
  FaSchool,
} from "react-icons/fa"
import { motion } from "framer-motion"
import "./PropertyFilter.css"

function PropertyFilter({ onFilter, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: "",
    nearbyHospital: false,
    nearbySchool: false,
    ...initialFilters,
  })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Apply initial filters if provided
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters)
      onFilter(initialFilters)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: "",
      nearbyHospital: false,
      nearbySchool: false,
    }

    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="filter-container">
      <div className="filter-header">
        <motion.h3
          className="filter-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaFilter className="filter-icon" />
          Filter Properties
        </motion.h3>
        <motion.button
          type="button"
          className="toggle-filter-btn"
          onClick={toggleExpand}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? "Hide Filters" : "Show All Filters"}
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="filter-form">
        <motion.div
          className="filter-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="filter-group">
            <label htmlFor="location">
              <FaMapMarkerAlt className="filter-icon-small" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Any location"
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price (₹)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min price"
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price (₹)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max price"
              className="filter-input"
            />
          </div>
        </motion.div>

        <motion.div
          className={`filter-expanded ${isExpanded ? "active" : ""}`}
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="bedrooms">
                <FaBed className="filter-icon-small" />
                Bedrooms
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="filter-select"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="bathrooms">
                <FaBath className="filter-icon-small" />
                Bathrooms
              </label>
              <select
                id="bathrooms"
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleChange}
                className="filter-select"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minArea">
                <FaRulerCombined className="filter-icon-small" />
                Min Area (sq.ft)
              </label>
              <input
                type="number"
                id="minArea"
                name="minArea"
                value={filters.minArea}
                onChange={handleChange}
                placeholder="Min area"
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="maxArea">Max Area (sq.ft)</label>
              <input
                type="number"
                id="maxArea"
                name="maxArea"
                value={filters.maxArea}
                onChange={handleChange}
                placeholder="Max area"
                className="filter-input"
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="nearbyHospital"
                  name="nearbyHospital"
                  checked={filters.nearbyHospital}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <label htmlFor="nearbyHospital" className="checkbox-label">
                  <FaHospital className="filter-icon-small" />
                  Near Hospital
                </label>
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="nearbySchool"
                  name="nearbySchool"
                  checked={filters.nearbySchool}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <label htmlFor="nearbySchool" className="checkbox-label">
                  <FaSchool className="filter-icon-small" />
                  Near School/College
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="filter-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            type="button"
            onClick={handleReset}
            className="reset-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
          <motion.button type="submit" className="apply-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaSearch className="filter-icon-small" />
            Apply Filters
          </motion.button>
        </motion.div>
      </form>
    </div>
  )
}

export default PropertyFilter

