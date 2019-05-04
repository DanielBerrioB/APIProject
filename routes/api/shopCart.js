var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var app = express();

var collection1 = "shopCart";
var nameDB = "boutique";
var url =
  "mongodb+srv://DanielBB:daniel123@cluster0-qdjmv.mongodb.net/test?retryWrites=true";

var client = MongoClient(url, { useNewUrlParser: true });
const { validateToken } = require("../utils/auth");

app.post("/main/users/shopCart/", validateToken, (req, res) => {
  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    if (req.body.email && req.body.shop && req.body.total) {
      db.collection(collection1).insertOne(req.body, (err, result) => {
        if (err) throw err;
        if (result.result.ok >= 1) {
          res.status(201).send({ status: true, message: "Agregado con éxito" });
        } else {
          res.status(404).send({ status: false, message: "No se agregó" });
        }
      });
    } else {
      res.status(404).send({ status: false, message: "Campos incompletos" });
    }
  });
});

app.get("/main/users/shopCart/", validateToken, (req, res) => {
  client.connect(err => {
    if(err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1).find().toArray((err, result) => {
      if(err) throw err;
      res.status(200).send(result);
    });
  });
})

module.exports = app;
