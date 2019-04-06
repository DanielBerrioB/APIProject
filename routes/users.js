var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var app = express();
app.use(cors());

var collection1 = "users";
var nameDB = "boutique";
var url =
  "mongodb+srv://DanielBB:DanielBB@cluster0-qdjmv.mongodb.net/test?retryWrites=true";

//This method is used to get alla the data
app.get("/users/create/", (req, res) => {
  MongoClient.connect(url, (err, dataBase) => {
    if (err) throw err;
    const db = dataBase.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).send(result);
        //db.close(); That's not working
      });
  });
});

//This POST method allows to add some users to the API
app.post("/users/create/", (req, res) => {
  var body = req.body;

  MongoClient.connect(url, (err, dataBase) => {
    if (err) throw err;
    const db = dataBase.db(nameDB); //The connection with the database is establish
    db.collection(collection1).insert(body);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        res.status(201).send(result);
        //db.close(); That's not working
      });
  });
});

module.exports = app; //To export the app
