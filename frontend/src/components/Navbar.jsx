"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaBars, FaTimes, FaHome, FaUser, FaHeart, FaBell, FaMoon, FaSun } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import "./Navbar.css"

function Navbar({ user, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

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

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaHome className="navbar-logo-icon" />
          <span>Rentify</span>
        </Link>

        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <AnimatePresence>
          <motion.div
            className={`navbar-menu ${isMenuOpen ? "active" : ""}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {user ? (
              <>
                <motion.div
                  className="navbar-welcome"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FaUser className="navbar-icon" />
                  <span>Welcome, {user.firstName}</span>
                </motion.div>

                {user.role === "seller" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Link
                        to="/add-property"
                        className={`navbar-link ${location.pathname === "/add-property" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        Add Property
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Link
                        to="/seller-dashboard"
                        className={`navbar-link ${location.pathname === "/seller-dashboard" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        My Properties
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Link
                        to="/interested-buyers"
                        className={`navbar-link ${location.pathname === "/interested-buyers" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        <FaBell className="navbar-icon" />
                        Interested Buyers
                      </Link>
                    </motion.div>
                  </>
                )}

                {user.role === "buyer" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Link
                        to="/buyer-dashboard"
                        className={`navbar-link ${location.pathname === "/buyer-dashboard" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        Browse Properties
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Link
                        to="/interested-properties"
                        className={`navbar-link ${location.pathname === "/interested-properties" ? "active" : ""}`}
                        onClick={closeMenu}
                      >
                        <FaHeart className="navbar-icon" />
                        Interested Properties
                      </Link>
                    </motion.div>
                  </>
                )}

                <div className="navbar-actions">
                  <motion.button
                    onClick={toggleDarkMode}
                    className="theme-toggle-btn"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="navbar-button"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link
                    to="/login"
                    className={`navbar-link ${location.pathname === "/login" ? "active" : ""}`}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </motion.div>

                <div className="navbar-actions">
                  <motion.button
                    onClick={toggleDarkMode}
                    className="theme-toggle-btn"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Link to="/register" className="navbar-button" onClick={closeMenu}>
                      Register
                    </Link>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar

