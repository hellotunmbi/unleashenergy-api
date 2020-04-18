const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error");
const morgan = require("morgan");
const colors = require("colors");

require("dotenv").config({ path: "variables.env" });
require("./handlers/passport");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("combined"));

// Connect to MongoDB...
let mongoDB = process.env.MONGODB_URL; // || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => {
  console.log("> MongoDB Connection Error...".red);
});
db.once("open", () => {
  console.log("> Successfully Connected the database".blue.bold);
});

// Configure routes...
const auth = require("./routes/auth.route");
const user = require("./routes/user.route");
const settings = require("./routes/settings.route");
const verify = require("./routes/verify.route");
const cylinder = require("./routes/cylinder.route");
// Admin Routes...
const adminuser = require("./routes/admin/user.route");

// ROUTES...
app.get("/", (req, res) => {
  res.status(200).json({ message: "Unleash Energy" });
});
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/settings", settings);
app.use("/api/verify", verify);
app.use("/api/cylinder", cylinder);

app.use("/api/admin/user", adminuser);

app.use(errorHandler);

module.exports = app;
