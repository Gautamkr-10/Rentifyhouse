import Interest from "../models/interestModel.js"

// @desc    Get all interests for a seller
// @route   GET /api/interests
// @access  Private/Seller
export const getSellerInterests = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Count total documents for pagination
    const count = await Interest.countDocuments({ seller: req.user._id })

    // Get interests with pagination
    const interests = await Interest.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("buyer", "firstName lastName email phone")
      .populate("property", "title location price")

    res.json({
      interests,
      page,
      totalPages: Math.ceil(count / limit),
      totalInterests: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

