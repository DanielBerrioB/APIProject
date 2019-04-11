var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

app.use("/", require("./comments"));
app.use("/", require("./clothes"));
app.use("/", require("./users"));

module.exports = app;
