const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a specific duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a maximum group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty level"],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, required: [true, "A tour must have a price"] },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a summary"],
  },
  description: { type: String, trim: true },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //To hide this field from the client
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema); //Model name always start with uppercase

module.exports = Tour;
