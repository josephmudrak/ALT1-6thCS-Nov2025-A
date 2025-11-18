console.log("Server log - start again");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
// Not sure that the next 3 lines are actually needed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static("public"));

// This is called when the app is first started
app.get("/", function (request, response) {
  console.log("In app.get (/)");
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/whatson.html", function (request, response) {
  console.log("In app.get (/whatson.html)");
  response.sendFile(__dirname + "/views/whatson.html");
});

app.get("/review.html", function (request, response) {
  console.log("In app.get (/review.html)");
  response.sendFile(__dirname + "/views/review.html");
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// Create the database object
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("SQLite.db"); // database name

app.post("/postReview", function (request, response) {
  console.log("In app.post (/postReview)");
  let insStr = "INSERT INTO Users (user_name, film_name, review) VALUES (";
  insStr += "'" + request.body.username + "', ";
  insStr += "'" + request.body.film + "', ";
  insStr += "'" + request.body.review + "');";
  db.run(insStr);
});

app.get("/getFilms", function (request, response) {
  console.log("In app.get (/getFilms)");
  db.all("SELECT * FROM Films", function (err, rows) {
    response.send(JSON.stringify(rows));
  });
});

app.get("/getReviews", function (request, response) {
  console.log("In app.get (/getReviews)");
  db.all("SELECT * FROM Users", function (err, rows) {
    response.send(JSON.stringify(rows));
  });
});
