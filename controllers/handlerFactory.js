const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: { data: doc },
    });
  });

exports.getSpecificOne = (Model, populateOpts) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOpts) {
      query = query.populate(populateOpts);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("Cannot find any document with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //new updated document will be returned
      runValidators: true, //when update document, validators in schema run again
    });

    if (!doc) {
      return next(new AppError("Cannot find any document with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: { data: newDoc },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("Cannot find any document with this ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
