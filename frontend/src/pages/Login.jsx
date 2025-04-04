"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
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
      const response = await axios.post("${API_URL}/api/users/login", formData)
      const userData = response.data

      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      toast.success("Login successful!")

      // Check for redirect parameters in URL
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPage = searchParams.get("redirect")
      const locationParam = searchParams.get("location")

      if (redirectPage === "buyer-dashboard" && locationParam) {
        navigate(`/buyer-dashboard?location=${locationParam}`)
      } else if (userData.role === "seller") {
        navigate("/seller-dashboard")
      } else {
        navigate("/buyer-dashboard")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Login to Rentify</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <FaSignInAlt className="inline-block mr-2" />
              Login
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-20">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}

export default Login

