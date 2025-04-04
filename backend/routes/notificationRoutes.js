import express from "express"
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getUserNotifications)
router.put("/:id/read", protect, markNotificationAsRead)

export default router

