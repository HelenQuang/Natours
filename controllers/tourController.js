const Tour = require("../models/tourModel");

const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const factory = require("./handlerFactory");

/////////////////////////////////////////////
//CREATE PARAM MIDDLEWARE:
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  // req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

////////////////////////////////////////////
//ROUTE HANDLER
//Get All Tours

exports.getAllTours = factory.getAll(Tour);

//Get Specific Tour
exports.getSpecificTour = factory.getSpecificOne(Tour, { path: "reviews" });

//Create New Tour
exports.createNewTour = factory.createOne(Tour);

//Update Tour
exports.updateTour = factory.updateOne(Tour);

//Delete Tour
exports.deleteTour = factory.deleteOne(Tour);

//////////AGGREGATION PIPELINE
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, //Select docs that matches
    },
    {
      $group: {
        //_id: null, //Group all docs
        _id: "$difficulty", //Group all docs based on difficulty
        totalTours: { $sum: 1 }, //Each doc. goes through this pipeline add 1 to sum
        totalRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { avgPrice: 1 } }, //Sort avgPrice in ascending order
  ]);

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    //unwind: deconstruct an array field from the docs $ output 1 doc for each el of the array
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        totalTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      //Add new fields
      $addFields: {
        month: "$_id",
      },
    },
    {
      //Show or hide fields
      $project: {
        _id: 0,
      },
    },
    { $sort: { totalTours: -1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { plan },
  });
});
