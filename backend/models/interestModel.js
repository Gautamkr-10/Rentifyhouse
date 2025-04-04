import mongoose from "mongoose"

const interestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure a buyer can only express interest in a property once
interestSchema.index({ property: 1, buyer: 1 }, { unique: true })

const Interest = mongoose.model("Interest", interestSchema)

export default Interest

