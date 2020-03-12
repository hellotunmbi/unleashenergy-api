const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: "variables.env" });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({message: "Purpcoin"});
});


let port = 1000;

app.listen(process.env.PORT || port, () => {
    console.log(`Server now up and running on port ${port}`);
});
