var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var app = express();
app.use(cors());

var collection1 = "products";
var nameDB = "boutique";
var url =
  "mongodb+srv://DanielBB:daniel123@cluster0-qdjmv.mongodb.net/test?retryWrites=true";

var client = MongoClient(url, { useNewUrlParser: true });
const { validateToken } = require("../utils/auth");

/**
 * This GET method "get" all the products storaged in the dataBase
 */
app.get("/main/", (req, res) => {
  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        res.status(200).send(result);
      });
  });
});

/**
 * This GET method "get" just one product with a given id
 */
app.get("/main/:id", (req, res) => {
  var id = req.params.id;
  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        var element = result.find(i => i.id == id);
        if (element) {
          res.status(200).send(element);
        } else {
          res.status(400).send({ message: "Element not found" });
        }
      });
  });
});

/**
 * This POST method allows to add a new clothe to the API,
 * in order to show it in the list
 */
app.post("/main/", validateToken, (req, res) => {
  var body = req.body;
  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        var element = result.find(i => i.id === body.id);
        if (!element) {
          db.collection(collection1).insert(body);
          db.collection(collection1)
            .find()
            .toArray((err, result) => {
              if (err) throw err;
              res.status(201).send(result);
            });
        } else {
          res.status(400).send({ message: "The element already exists" });
        }
      });
  });
});

/**
 * This POST method updates an element from the data base with a given id and a new body
 */
app.put("/main/:id", validateToken, (req, res) => {
  var body = req.body;
  var idDocument = req.params.id;

  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        var element = result.find(i => i.id == idDocument);
        if (element) {
          body = { $set: body };
          db.collection(collection1).updateOne(element, body, (err, value) => {
            if (err) throw err;
            db.collection(collection1)
              .find()
              .toArray((err, result) => {
                if (err) throw err;
                res.status(200).send(result);
              });
          });
        } else {
          res.status(400).send({ message: "Element not found" });
        }
      });
  });
});

/**
 * This DELETE method allows to delete an element to the database with a given ID
 */
app.delete("/main/:id", validateToken, (req, res) => {
  var id = req.params.id;
  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        var element = result.find(i => i.id == id);
        console.log(element);
        if (element) {
          db.collection(collection1).deleteOne(element, (err, value) => {
            if (err) throw err;
            db.collection(collection1)
              .find()
              .toArray((err, result) => {
                if (err) throw err;
                res.status(200).send(result);
              });
          });
        } else {
          res.status(400).send({ message: "Element not found" });
        }
      });
  });
});

module.exports = app;
