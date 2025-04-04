import express from "express"
import {
  createProperty,
  getProperties,
  getSellerProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertySeller,
  likeProperty,
  expressInterest,
  getInterestedProperties,
} from "../controllers/propertyController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, createProperty).get(protect, getProperties)

router.get("/seller", protect, getSellerProperties)
router.get("/interested", protect, getInterestedProperties)

router.route("/:id").get(protect, getPropertyById).put(protect, updateProperty).delete(protect, deleteProperty)

router.get("/:id/seller", protect, getPropertySeller)
router.post("/:id/like", protect, likeProperty)
router.post("/:id/interest", protect, expressInterest)

export default router

