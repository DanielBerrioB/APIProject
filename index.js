//Import libraries
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use("/", require("./routes/users"));

//Get the server port or a default port called 3000
var port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`I'm listening port ${port}`);
});
