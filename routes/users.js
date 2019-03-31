var express = require("express");
var app = express();

var arrayAux = []; //This will be deleted when the DB is installed

//This method is used to get alla the data
app.get("/users/", (req, res) => {
    res.status(400).send(arrayAux);
});

//This POST method allows to add some users to the API
app.post("/users/", (req, res) => {
    var body = req.body;
    arrayAux.push(body);
    res.status(201).send(arrayAux);
});

module.exports = app; //To export the app