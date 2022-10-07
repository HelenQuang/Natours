const Tour = require("../models/tourModel");

const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
exports.getAllTours = catchAsync(async (req, res, next) => {
  //////EXECUTE QUERY////
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
});

//Get Specific Tour
exports.getSpecificTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("Cannot find any tour with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

//Create New Tour
exports.createNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: { tour: newTour },
  });
});

//Update Tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //new updated document will be returned
    runValidators: true, //when update document, validators in schema run again
  });

  if (!tour) {
    return next(new AppError("Cannot find any tour with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

//Delete Tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("Cannot find any tour with this ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
