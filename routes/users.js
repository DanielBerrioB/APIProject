var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var app = express();
app.use(cors());

var collection1 = "users";
var nameDB = "boutique";
var url =
  "mongodb+srv://DanielBB:daniel123@cluster0-qdjmv.mongodb.net/test?retryWrites=true";

//This method is used to get alla the data
app.get("/main/users/create/", (req, res) => {
  MongoClient.connect(url, (err, dataBase) => {
    if (err) throw err;
    const db = dataBase.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).send(result);
        dataBase.close();
      });
    
  });
});

//This POST method allows to add some users to the API
app.post("/main/users/create/", (req, res) => {
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
        dataBase.close();
      });
  });
});

//This POST method allows to find a user when somebody
//is trying to log in.
app.post("/main/users/auth/", (req, res) => {
  var body = req.body;
  if (body) {
    MongoClient.connect(url, (err, dataBase) => {
      if (err) throw err;
      const db = dataBase.db(nameDB);
      db.collection(collection1)
        .find()
        .toArray((err, result) => {
          if (err) throw err;
          if (body.email && body.password) {
            var element = result.find(
              i => i.email === body.email && i.password === body.password
            );
            if (element) {
              res.status(200).send({ status: true, message: "User found" });
              dataBase.close();
            } else {
              res.status(400).send({ status: false, message: "Not found" });
              dataBase.close();
            }
          } else {
            res.status(400).send({ status: false, message: "Not valid" });
            dataBase.close();
          }
        });
    });
  } else {
    res.status(400).send({ status: false, message: "Not valid" });
  }
});

module.exports = app; //To export the app
