"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
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

    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", formData)
      const userData = response.data

      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      toast.success("Registration successful!")

      if (userData.role === "seller") {
        navigate("/seller-dashboard")
      } else {
        navigate("/buyer-dashboard")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Register for Rentify</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">
            <FaUser className="inline-block mr-2" />
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "error" : ""}
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            <FaUser className="inline-block mr-2" />
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="inline-block mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            <FaPhone className="inline-block mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "error" : ""}
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <FaLock className="inline-block mr-2" />
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FaLock className="inline-block mr-2" />
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role">I am a:</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="buyer">Tenant (Looking for property)</option>
            <option value="seller">Owner (Listing property)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? (
            "Registering..."
          ) : (
            <>
              <FaUserPlus className="inline-block mr-2" />
              Register
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-20">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Register

