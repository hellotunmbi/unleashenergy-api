const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: "variables.env" });
require("./handlers/passport");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Connect to MongoDB...
let mongoDB = process.env.MONGODB_URL; // || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB Connection Error...")
);

// Configure routes...
const auth = require("./routes/auth.route");
const user = require("./routes/user.route");
const settings = require("./routes/settings.route");
const verify = require("./routes/verify.route");

// ROUTES...
app.get("/", (req, res) => {
  res.status(200).json({ message: "Purpcoin" });
});
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/settings", settings);
app.use("/api/verify", verify);

let port = 1000;

app.listen(process.env.PORT || port, () => {
  console.log(`Server now up and running on port ${port}`);
});
