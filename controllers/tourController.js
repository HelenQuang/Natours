const Tour = require("./../models/tourModel");

/////////////////////////////////////////////
//GET FILE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//CREATE PARAM MIDDLEWARE:
// exports.checkID = (req, res, next) => {
//   if (+req.params.id < 0 || +req.params.id > tours.length) {
//     return res.status(404).json({ status: "fail", message: "Invalid ID" });
//   }
//   next();
// };
////////////////////////////////////////////

//ROUTE HANDLER
//Get All Tours
exports.getAllTours = async (req, res) => {
  try {
    //////FILTER QUERY/////
    const { page, sort, limit, fields, ...queryObj } = req.query; //Only want the main query obj and ignore other four queries

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, (match) => `$${match}`); //Advance filter for greater than, greater than equal, less than, less than equal

    let query = Tour.find(JSON.parse(queryStr)); //Find all tour that match query

    //////SORT QUERY//////
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    /////FIELD LIMIT QUERY////
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); //Exclude the __v field
    }

    //////EXECUTE QUERY////
    const tours = await query;

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
