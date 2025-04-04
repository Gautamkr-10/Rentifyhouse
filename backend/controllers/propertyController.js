import Property from "../models/propertyModel.js"
import User from "../models/userModel.js"
import Interest from "../models/interestModel.js"
import Notification from "../models/notificationModel.js"

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private/Seller
export const createProperty = async (req, res) => {
  try {
    const { title, description, location, price, bedrooms, bathrooms, area, imageUrl, nearbyHospital, nearbySchool } =
      req.body

    // Check if user is a seller
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create properties" })
    }

    const property = await Property.create({
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      imageUrl,
      nearbyHospital,
      nearbySchool,
      owner: req.user._id,
    })

    res.status(201).json(property)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all properties with pagination and filtering
// @route   GET /api/properties
// @access  Private
export const getProperties = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = {}

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" }
    }

    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: Number.parseInt(req.query.minPrice) }
    }

    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number.parseInt(req.query.maxPrice) }
    }

    if (req.query.bedrooms) {
      filter.bedrooms = { $gte: Number.parseInt(req.query.bedrooms) }
    }

    if (req.query.bathrooms) {
      filter.bathrooms = { $gte: Number.parseInt(req.query.bathrooms) }
    }

    if (req.query.minArea) {
      filter.area = { ...filter.area, $gte: Number.parseInt(req.query.minArea) }
    }

    if (req.query.maxArea) {
      filter.area = { ...filter.area, $lte: Number.parseInt(req.query.maxArea) }
    }

    if (req.query.nearbyHospital === "true") {
      filter.nearbyHospital = true
    }

    if (req.query.nearbySchool === "true") {
      filter.nearbySchool = true
    }

    // Count total documents for pagination
    const count = await Property.countDocuments(filter)

    // Get properties with pagination
    const properties = await Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Check if user has liked each property
    const propertiesWithLikeStatus = properties.map((property) => {
      const isLiked = property.likedBy.includes(req.user._id)
      return {
        ...property.toObject(),
        isLiked,
      }
    })

    res.json({
      properties: propertiesWithLikeStatus,
      page,
      totalPages: Math.ceil(count / limit),
      totalProperties: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get seller's properties with pagination
// @route   GET /api/properties/seller
// @access  Private/Seller
export const getSellerProperties = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Count total documents for pagination
    const count = await Property.countDocuments({ owner: req.user._id })

    // Get properties with pagination
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.json({
      properties,
      page,
      totalPages: Math.ceil(count / limit),
      totalProperties: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Private
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user has liked this property
    const isLiked = property.likedBy.includes(req.user._id)

    // Check if user has shown interest in this property
    const isInterested = await Interest.exists({
      property: property._id,
      buyer: req.user._id,
    })

    res.json({
      property,
      isLiked,
      isInterested: !!isInterested,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Seller
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user is the owner of the property
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this property" })
    }

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json(updatedProperty)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Seller
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user is the owner of the property
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this property" })
    }

    // Delete all interests related to this property
    await Interest.deleteMany({ property: property._id })

    // Delete all notifications related to this property
    await Notification.deleteMany({ property: property._id })

    // Delete the property
    await Property.findByIdAndDelete(req.params.id)

    res.json({ message: "Property removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get seller info for a property
// @route   GET /api/properties/:id/seller
// @access  Private
export const getPropertySeller = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user has shown interest in this property
    const interest = await Interest.findOne({
      property: property._id,
      buyer: req.user._id,
    })

    if (!interest && req.user.role === "buyer") {
      return res.status(403).json({
        message: "You must express interest in this property to view seller details",
      })
    }

    const seller = await User.findById(property.owner).select("-password")

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" })
    }

    res.json(seller)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Like a property
// @route   POST /api/properties/:id/like
// @access  Private
export const likeProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user has already liked this property
    const alreadyLiked = property.likedBy.includes(req.user._id)

    if (alreadyLiked) {
      // Unlike the property
      property.likes = Math.max(0, property.likes - 1)
      property.likedBy = property.likedBy.filter((userId) => userId.toString() !== req.user._id.toString())
    } else {
      // Like the property
      property.likes += 1
      property.likedBy.push(req.user._id)
    }

    await property.save()

    res.json({
      likes: property.likes,
      isLiked: !alreadyLiked,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Express interest in a property
// @route   POST /api/properties/:id/interest
// @access  Private/Buyer
export const expressInterest = async (req, res) => {
  try {
    // Check if user is a buyer
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can express interest" })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Check if user has already expressed interest
    const existingInterest = await Interest.findOne({
      property: property._id,
      buyer: req.user._id,
    })

    if (existingInterest) {
      return res.status(400).json({ message: "You have already expressed interest in this property" })
    }

    // Create interest record
    const interest = await Interest.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.owner,
    })

    // Create notification for seller
    await Notification.create({
      recipient: property.owner,
      title: "New Interest in Your Property",
      message: `${req.user.firstName} ${req.user.lastName} is interested in your property "${property.title}"`,
      property: property._id,
    })

    res.status(201).json({ message: "Interest expressed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get properties user has expressed interest in
// @route   GET /api/properties/interested
// @access  Private/Buyer
export const getInterestedProperties = async (req, res) => {
  try {
    // Check if user is a buyer
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Access denied" })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Count total documents for pagination
    const count = await Interest.countDocuments({ buyer: req.user._id })

    // Get interests with pagination
    const interests = await Interest.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "firstName lastName email phone",
        },
      })

    // Extract properties from interests
    const properties = interests.map((interest) => interest.property)

    res.json({
      properties,
      page,
      totalPages: Math.ceil(count / limit),
      totalProperties: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

