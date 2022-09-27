const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// MIDDLEWARES: These middleware apply to all routes below
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from middleware");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//GET FILES
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

//ROUTE HANDLERS
//Get All Tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

//Get Specific Tour
const getSpecificTour = (req, res) => {
  const tour = tours.find((el) => el.id === +req.params.id);

  if (!tour) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

//Create New Tour
const createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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
const updateTour = (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }

  res.status(200).json({
    status: "success",
    data: { tour: "Updated tour" },
  });
};

//Delete Tour
const deleteTour = (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

//Get All Users
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
};

//Create New User
const createNewUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//Get Specific User
const getSpecificUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//Update User
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//Delete User
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//ROUTES
app.route("/api/v1/tours").get(getAllTours).post(createNewTour);
app
  .route("/api/v1/tours/:id")
  .get(getSpecificTour)
  .patch(updateTour)
  .delete(deleteTour);
app.route("/api/v1/users").get(getAllUsers).post(createNewUser);
app
  .route("/api/v1/users/:id")
  .get(getSpecificUser)
  .patch(updateUser)
  .delete(deleteUser);

//START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
