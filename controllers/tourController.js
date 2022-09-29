const fs = require("fs");

//GET FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//PARAM MIDDLEWARE:
exports.checkID = (req, res, next) => {
  if (+req.params.id < 0 || +req.params.id > tours.length) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: "fail", message: "Missing name or price" });
  }
  next();
};

//ROUTE HANDLER
//Get All Tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

//Get Specific Tour
exports.getSpecificTour = (req, res) => {
  const tour = tours.find((el) => el.id === +req.params.id);

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

//Create New Tour
exports.createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: { tour: newTour },
      });
    }
  );
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
