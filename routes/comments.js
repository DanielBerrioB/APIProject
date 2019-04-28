var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var app = express();
app.use(cors());

var collection1 = "comment";
var nameDB = "boutique";
var url =
  "mongodb+srv://DanielBB:daniel123@cluster0-qdjmv.mongodb.net/test?retryWrites=true";

var client = MongoClient(url, { useNewUrlParser: true });
const { validateToken } = require("./utils/auth");
/**
 * This GET method allows to get all the comments on the database
 */
app.get("/main/comment/", (req, res) => {
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
 * This POST method add a new comment to the collection into the database
 */
app.post("/main/comment/", validateToken, (req, res) => {
  var body = req.body;
  if (body) {
    client.connect(err => {
      if (err) throw err;
      const db = client.db(nameDB);
      db.collection(collection1)
        .find()
        .toArray((err, result) => {
          if (err) throw err;
          var element = result.find(i => i.comment === body.comment);
          if (!element) {
            db.collection(collection1).insert(body);
            db.collection(collection1)
              .find()
              .toArray((err, value) => {
                if (err) throw err;
                res.status(201).send(value);
              });
          } else {
            res.status(400).send({ message: "The comment already exists" });
          }
        });
    });
  } else {
    res.send({ message: "Not valid body" });
  }
});

module.exports = app;
