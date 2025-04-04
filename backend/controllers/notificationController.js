import Notification from "../models/notificationModel.js"

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 })

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    notification.isRead = true
    await notification.save()

    res.json({ message: "Notification marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

