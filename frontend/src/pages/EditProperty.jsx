"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaHome,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaImage,
  FaHospital,
  FaSchool,
  FaEdit,
} from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"

function EditProperty({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    imageUrl: "",
    nearbyHospital: false,
    nearbySchool: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setFormData(response.data.property)
      setLoading(false)
    } catch (err) {
      toast.error("Failed to fetch property details")
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = "Number of bedrooms is required"
    } else if (isNaN(formData.bedrooms) || Number(formData.bedrooms) <= 0) {
      newErrors.bedrooms = "Bedrooms must be a positive number"
    }

    if (!formData.bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required"
    } else if (isNaN(formData.bathrooms) || Number(formData.bathrooms) <= 0) {
      newErrors.bathrooms = "Bathrooms must be a positive number"
    }

    if (!formData.area) {
      newErrors.area = "Area is required"
    } else if (isNaN(formData.area) || Number(formData.area) <= 0) {
      newErrors.area = "Area must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      await axios.put(`${API_URL}/api/properties/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      toast.success("Property updated successfully!")
      navigate("/seller-dashboard")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update property")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <h2 className="form-title">
        <FaEdit className="inline-block mr-2" />
        Edit Property
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            <FaHome className="inline-block mr-2" />
            Property Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "error" : ""}
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "error" : ""}
          />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <FaMapMarkerAlt className="inline-block mr-2" />
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? "error" : ""}
          />
          {errors.location && <div className="error">{errors.location}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="price">
            <FaRupeeSign className="inline-block mr-2" />
            Rent per Month (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "error" : ""}
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="bedrooms">
            <FaBed className="inline-block mr-2" />
            Bedrooms
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className={errors.bedrooms ? "error" : ""}
          />
          {errors.bedrooms && <div className="error">{errors.bedrooms}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="bathrooms">
            <FaBath className="inline-block mr-2" />
            Bathrooms
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className={errors.bathrooms ? "error" : ""}
          />
          {errors.bathrooms && <div className="error">{errors.bathrooms}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="area">
            <FaRulerCombined className="inline-block mr-2" />
            Area (sq.ft)
          </label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={errors.area ? "error" : ""}
          />
          {errors.area && <div className="error">{errors.area}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">
            <FaImage className="inline-block mr-2" />
            Image URL
          </label>
          <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>

        <div className="form-group">
          <div className="filter-checkbox">
            <input
              type="checkbox"
              id="nearbyHospital"
              name="nearbyHospital"
              checked={formData.nearbyHospital}
              onChange={handleChange}
            />
            <label htmlFor="nearbyHospital">
              <FaHospital className="inline-block mr-2" />
              Hospital Nearby
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="filter-checkbox">
            <input
              type="checkbox"
              id="nearbySchool"
              name="nearbySchool"
              checked={formData.nearbySchool}
              onChange={handleChange}
            />
            <label htmlFor="nearbySchool">
              <FaSchool className="inline-block mr-2" />
              School/College Nearby
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Updating Property..." : "Update Property"}
        </button>
      </form>
    </div>
  )
}

export default EditProperty

