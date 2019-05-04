var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var crypto = require("crypto");
var app = express();
app.use(cors());

var collection1 = "users";
var nameDB = "boutique";
var url =
  "mongodb+srv://DanielBB:daniel123@cluster0-qdjmv.mongodb.net/test?retryWrites=true";
var client = MongoClient(url, { useNewUrlParser: true });
const { createToken } = require("../utils/auth");
const { validateToken } = require("../utils/auth");

//This method is used to get alla the data
app.get("/main/users/create/", validateToken, (req, res) => {
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

//This POST method allows to add some users to the API
app.post("/main/users/create/", (req, res) => {
  client.connect(err => {
    if (err) throw err;
    const db = client.db(nameDB);
    db.collection(collection1)
      .find({ email: req.body.email })
      .toArray((err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.status(400).send({ message: "The user is already created" });
        } else {
          var data = [
            {
              email: req.body.email,
              password: crypto
                .createHmac("sha256", req.body.password)
                .digest("hex"),
              role: req.body.role
            }
          ];
          db.collection(collection1).insert(data);
          res.status(201).send({ user: data });
        }
      });
  });
});

//This POST method allows to find a user when somebody
//is trying to log in.
app.post("/main/users/auth/", (req, res) => {
  var body = req.body;
  if (body) {
    client.connect(err => {
      if (err) throw err;
      const db = client.db(nameDB);
      db.collection(collection1)
        .find()
        .toArray((err, result) => {
          if (err) throw err;
          if (body.email && body.password) {
            passwordEncrypted = crypto
              .createHmac("sha256", body.password)
              .digest("hex");
            var element = result.find(
              i => i.email === body.email && i.password === passwordEncrypted
            );
            if (element) {
              const token = createToken({ ...element });
              delete element.password;
              res.status(200).send({
                status: true,
                user: element,
                message: "User found",
                token: token
              });
            } else {
              res.status(400).send({ status: false, message: "Not found" });
            }
          } else {
            res.status(400).send({ status: false, message: "Not valid" });
          }
        });
    });
  } else {
    res.status(400).send({ status: false, message: "Not valid" });
  }
});

module.exports = app; //To export the app
