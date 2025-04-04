"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import SellerDashboard from "./pages/SellerDashboard"
import BuyerDashboard from "./pages/BuyerDashboard"
import PropertyDetails from "./pages/PropertyDetails"
import AddProperty from "./pages/AddProperty"
import EditProperty from "./pages/EditProperty"
import InterestedProperties from "./pages/InterestedProperties"
import InterestedBuyers from "./pages/InterestedBuyers"
import NotFound from "./pages/NotFound"
import LandingPage from "./pages/LandingPage"
import "./App.css"
import "./styles/AnimatedBackground.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bgType, setBgType] = useState("gradient-bg")

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
    setLoading(false)

    // Rotate through background types
    const bgInterval = setInterval(() => {
      setBgType((current) => {
        const bgTypes = ["gradient-bg", "particles-bg", "geometric-bg", "wave-bg", "bubble-bg"]
        const currentIndex = bgTypes.indexOf(current)
        const nextIndex = (currentIndex + 1) % bgTypes.length
        return bgTypes[nextIndex]
      })
    }, 15000) // Change background every 15 seconds

    return () => clearInterval(bgInterval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  // Render bubbles for bubble background
  const renderBubbles = () => {
    return Array.from({ length: 10 }).map((_, index) => <div key={index} className="bubble"></div>)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        {/* Animated background for all pages except landing page */}
        <Routes>
          <Route path="/" element={null} />
          <Route
            path="*"
            element={<div className={`animated-bg ${bgType}`}>{bgType === "bubble-bg" && renderBubbles()}</div>}
          />
        </Routes>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="*"
            element={
              <>
                <Navbar user={user} handleLogout={handleLogout} />
                <div className="container">
                  <Routes>
                    <Route
                      path="/login"
                      element={
                        user ? (
                          user.role === "seller" ? (
                            <Navigate to="/seller-dashboard" />
                          ) : (
                            <Navigate to="/buyer-dashboard" />
                          )
                        ) : (
                          <Login setUser={setUser} />
                        )
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        user ? (
                          user.role === "seller" ? (
                            <Navigate to="/seller-dashboard" />
                          ) : (
                            <Navigate to="/buyer-dashboard" />
                          )
                        ) : (
                          <Register setUser={setUser} />
                        )
                      }
                    />
                    <Route
                      path="/seller-dashboard"
                      element={
                        user && user.role === "seller" ? <SellerDashboard user={user} /> : <Navigate to="/login" />
                      }
                    />
                    <Route
                      path="/buyer-dashboard"
                      element={user ? <BuyerDashboard user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/property/:id"
                      element={user ? <PropertyDetails user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/add-property"
                      element={user && user.role === "seller" ? <AddProperty user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/edit-property/:id"
                      element={user && user.role === "seller" ? <EditProperty user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/interested-properties"
                      element={
                        user && user.role === "buyer" ? <InterestedProperties user={user} /> : <Navigate to="/login" />
                      }
                    />
                    <Route
                      path="/interested-buyers"
                      element={
                        user && user.role === "seller" ? <InterestedBuyers user={user} /> : <Navigate to="/login" />
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App

