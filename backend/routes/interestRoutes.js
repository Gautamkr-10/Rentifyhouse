import express from "express"
import { getSellerInterests } from "../controllers/interestController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getSellerInterests)

export default router

