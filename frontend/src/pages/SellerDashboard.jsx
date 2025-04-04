"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaHome, FaBell } from "react-icons/fa"
import axios from "axios"
import toast from "react-hot-toast"
import PropertyCard from "../components/PropertyCard"
import Pagination from "../components/Pagination"
import API_URL from '../config/api';

function SellerDashboard({ user }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("properties")
  const [notifications, setNotifications] = useState([])
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  const propertiesPerPage = 6

  useEffect(() => {
    fetchProperties()
    fetchNotifications()

    // Set up polling for new notifications
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [currentPage])

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/properties/seller?page=${currentPage}&limit=${propertiesPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      setProperties(response.data.properties)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (err) {
      toast.error("Failed to fetch properties")
      setError("Failed to fetch properties")
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("${API_URL}/api/notifications", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      const newNotifications = response.data

      // Check if there are any unread notifications
      const hasUnread = newNotifications.some((notification) => !notification.isRead)
      setHasNewNotifications(hasUnread)

      setNotifications(newNotifications)
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    }
  }

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`${API_URL}/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      toast.success("Property deleted successfully")

      // Refresh properties
      fetchProperties()
    } catch (err) {
      toast.error("Failed to delete property")
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      // Update notifications in state
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )

      // Check if there are still unread notifications
      const stillHasUnread = notifications.some(
        (notification) => notification._id !== notificationId && !notification.isRead,
      )
      setHasNewNotifications(stillHasUnread)
    } catch (err) {
      console.error("Failed to mark notification as read", err)
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
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Seller Dashboard</h1>
        <Link to="/add-property" className="btn btn-primary">
          <FaPlus className="inline-block mr-2" />
          Add New Property
        </Link>
      </div>

      <div className="dashboard-tabs">
        <div
          className={`dashboard-tab ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          <FaHome className="inline-block mr-2" />
          My Properties
        </div>
        <div
          className={`dashboard-tab ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <FaBell className="inline-block mr-2" />
          Interested Buyers
          {hasNewNotifications && <span className="notification-badge">New</span>}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === "properties" && (
        <>
          {properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaHome />
              </div>
              <h2 className="empty-state-title">No Properties Listed</h2>
              <p className="empty-state-description">
                You haven't listed any properties yet. Add your first property to get started.
              </p>
              <Link to="/add-property" className="btn btn-primary">
                Add Your First Property
              </Link>
            </div>
          ) : (
            <>
              <div className="property-grid">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    isSeller={true}
                    onDelete={handleDelete}
                    user={user}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </>
      )}

      {activeTab === "notifications" && (
        <>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaBell />
              </div>
              <h2 className="empty-state-title">No Interested Buyers Yet</h2>
              <p className="empty-state-description">
                When buyers express interest in your properties, you'll see their information here.
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification ${!notification.isRead ? "notification-new" : ""}`}
                >
                  <div className="notification-content">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button className="btn btn-outline" onClick={() => markNotificationAsRead(notification._id)}>
                        Mark as Read
                      </button>
                    )}
                    <Link to={`/property/${notification.property}`} className="btn btn-primary">
                      View Property
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SellerDashboard

