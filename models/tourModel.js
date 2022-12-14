const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal 40 characters"],
      minlength: [10, "A tour name must have more or equal 10 characters"],
    },
    slug: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty level should be: easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, //To round up the average
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "A tour must have a price"] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price; //"this" ONLY points to current doc on NEW doc creation NOT UPDATED one
        },
      },
      message: "Discount price ({VALUE}) must be less than regular price",
    },
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
    secretTour: { type: Boolean, default: false },
    startLocation: {
      //GeoJSON
      type: {
        type: "String",
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      //Embeded documents
      {
        type: {
          type: "String",
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      //Child Referencing: Ref with User and populate user data in tourController - getSpecificTour
      { type: mongoose.Schema.ObjectId, ref: "User" },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } } //Whenever data outputs into JSON or object, virtuals will be shown
);

//////////SET UP PERSONAL INDEX FOR MONGODB
// tourSchema.index({ price: 1 }); //Set index on price in an ascending order
tourSchema.index({ price: 1, ratingsAverage: -1 }); //Set compound index on price in an ascending order & ratingsAverage in a descending order
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

//////////VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
  //Have to use regular fn bc arrow fn can't use "this"
  return this.duration / 7;
});

/////////VIRTUAL POPULATE
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour", //The name of the property in ref model that wants to populate
  localField: "_id", //The name of the property in this model
});

////////DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//To embed user data into guides property => Have some drawbacks
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

////////QUERY MIDDLEWARE: runs before .find() query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

////////AGGREGATION MIDDLEWARE: runs before aggregation happens
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema); //Model name always start with uppercase

module.exports = Tour;
