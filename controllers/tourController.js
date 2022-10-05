const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

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
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

//Get Specific Tour
exports.getSpecificTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Cannot find tour" });
  }
};

//Create New Tour
exports.createNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};

//Update Tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //new updated document will be returned
      runValidators: true, //when update document, validators in schema run again
    });

    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Invalid data" });
  }
};

//Delete Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Cannot delete" });
  }
};

//////////AGGREGATION PIPELINE
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Cannot delete" });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Cannot delete" });
  }
};
