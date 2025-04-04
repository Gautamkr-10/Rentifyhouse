"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import "./LandingPage.css"
import "../styles/AnimatedBackground.css"

const cityData = [
  {
    name: "Mumbai",
    type: "Apartment",
    price: "₹ 50,000",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bangalore",
    type: "House",
    price: "₹ 75,000",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Delhi",
    type: "Apartment",
    price: "₹ 55,000",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chennai",
    type: "House",
    price: "₹ 60,000",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hyderabad",
    type: "Apartment",
    price: "₹ 48,000",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pune",
    type: "Villa",
    price: "₹ 85,000",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kolkata",
    type: "Apartment",
    price: "₹ 45,000",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jaipur",
    type: "House",
    price: "₹ 52,000",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
]

function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [bgType, setBgType] = useState("gradient-bg")
  const navigate = useNavigate()

  useEffect(() => {
    // Check if dark mode is enabled in localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    // Add dark mode class to body if enabled
    if (savedDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

    // Set loaded state for animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    // Rotate through background types
    const bgInterval = setInterval(() => {
      setBgType((current) => {
        const bgTypes = ["gradient-bg", "particles-bg", "geometric-bg", "wave-bg", "bubble-bg"]
        const currentIndex = bgTypes.indexOf(current)
        const nextIndex = (currentIndex + 1) % bgTypes.length
        return bgTypes[nextIndex]
      })
    }, 10000) // Change background every 10 seconds

    return () => clearInterval(bgInterval)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())

    if (newDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/login?redirect=buyer-dashboard&location=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCityClick = (city) => {
    navigate(`/login?redirect=buyer-dashboard&location=${encodeURIComponent(city)}`)
  }

  // Render bubbles for bubble background
  const renderBubbles = () => {
    return Array.from({ length: 10 }).map((_, index) => <div key={index} className="bubble"></div>)
  }

  return (
    <div className="landing-page">
      <div className={`animated-bg ${bgType}`}>{bgType === "bubble-bg" && renderBubbles()}</div>

      <header className="landing-header">
        <motion.h1
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Rentify
        </motion.h1>

        <motion.div
          className="dark-mode-toggle"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span>Dark Mode</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
        </motion.div>
      </header>

      <main className="landing-main">
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h2 className="hero-title">Find your next place to live</h2>
          <p className="hero-subtitle">Search listings in your area to find the right home for you.</p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </motion.div>

        <div className="city-cards">
          {cityData.map((city, index) => (
            <motion.div
              key={city.name}
              className="city-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              onClick={() => handleCityClick(city.name)}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="city-card-content">
                <h3 className="city-name">{city.name}</h3>
                <p className="property-type">{city.type}</p>
                <div className="divider"></div>
                <p className="price">{city.price} / mo</p>
              </div>
              <div className="city-card-bg" style={{ backgroundImage: `url(${city.image})` }}></div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="landing-footer">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          © 2023 Rentify. All rights reserved.
        </motion.p>
      </footer>
    </div>
  )
}

export default LandingPage

