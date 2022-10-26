const mongoose = require("mongoose");
const Tour = require("../models/tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review message cannot be empty."],
    },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now() },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/////////////SET COMPOUND INDEX to prevent duplicated reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/////////////MIDDLEWARE to populate data
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});

////////////FN to calculate Average ratings by using statics method and aggregation pipeline
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numberRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  //Persist stats into tour data
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numberRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

/////////////MIDDLEWARE to call fn calcAverageRatings after .save() query, POST middleware don't take next()
reviewSchema.post("save", function () {
  //this means current review
  this.constructor.calcAverageRatings(this.tour);
});

///////////MIDDLEWARE to find the review before .findByIdAndUpdate(), .findByIdAndDelete() query
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

////////////MIDDLEWARE to call fn calcAverageRatings after .findByIdAndUpdate(), .findByIdAndDelete() query, POST middleware don't take next()
reviewSchema.post(/^findOneAnd/, async function () {
  //this.r means current review
  this.r.constructor.calcAverageRatings(this.r.tour); //To get tour id
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
