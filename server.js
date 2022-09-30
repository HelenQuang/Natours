const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, "A tour must have a price"] },
});

const Tour = mongoose.model("Tour", tourSchema); //Model name always start with uppercase

const testTour = new Tour({
  name: "The Forest Hiker",
  rating: 4.7,
  price: 256,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const app = require("./app");

//START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
