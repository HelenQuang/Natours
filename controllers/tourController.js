const Tour = require("./../models/tourModel");

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
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: { tours },
  });
};

//Get Specific Tour
exports.getSpecificTour = (req, res) => {
  // const tour = tours.find((el) => el.id === +req.params.id);
  // res.status(200).json({
  //   status: "success",
  //   data: { tour },
  // });
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
    res.status(400).json({ status: "fail", message: "Invalid data" });
  }
};

//Update Tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: { tour: "Updated tour" },
  });
};

//Delete Tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
