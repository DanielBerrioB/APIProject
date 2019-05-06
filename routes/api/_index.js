var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

app.use("/", require("./comments"));
app.use("/", require("./clothes"));
app.use("/", require("./users"));
app.use("/", require("./shopCart"));

//If the route is not found, this message is deploy
app.use((req, res, next) => {
  res.status(400).send({
    message: "This end point does not exits"
  });
});
module.exports = app;
