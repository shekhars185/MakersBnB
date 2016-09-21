process.env.NODE_ENV ? process.env.NODE_ENV : process.env.NODE_ENV = 'development';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./config/db');
var listing = require('./app/models/listing');
var user = require('./app/models/user');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var Listing = mongoose.model('Listing');
var User = mongoose.model('User');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({secret: 'mysecretphrase'}));

app.set("view engine", "ejs");

app.get('/', function (req, res) {
  res.send('Hello, Makers B&B welcomes you!!');
});

app.get("/listings/new", function (req, res) {
  res.render("listings/new", {});
});

app.post("/listings", function (req, res) {
  Listing.create({name: req.body.name,
                            description: req.body.description,
                            price: req.body.price,
                            availableFrom: req.body.available_from,
                            availableTo: req.body.available_to}),
        function (err, listing) {
          if (err) {
            res.send("There was a problem adding the information to the database.");
          } else {
            console.log('New listing has been created');
          }
        }
  res.redirect("/listings");
});

app.get("/listings", function(req, res) {
  var listingMap = {};
  Listing.find({}, function(err, listings) {
    listingMap = listings;
 });
  setTimeout(function() {
    res.render("listings/index", { listingMap });
  }, 500);
});

app.get("/users/new", function (req, res) {
  res.render("users/new", {});
});

app.post("/users", function (req, res) {
  if (req.body.password === req.body.password_confirmation) {


    User.create({name: req.body.name,
                 email: req.body.email,
                 password: req.body.password}),
      function (err, listing) {
        if (err) {
          res.send("There was a problem adding the information to the database.");
        } else {
          console.log('New listing has been created');
        };

      };


      setTimeout(function() {
        User.findOne({'email': 'zombie1@dead.com'}, function(err,testing){console.log("username " + testing);})
        User.find({email: 'zombie1@dead.com'}, function(err,user){console.log("usernamesss " + user)})

      }, 500);

      res.redirect("/listings");
  } else {

    console.log("User add failure, password mismatch?");
    //add flash message functonality
    res.redirect("/users/new")};

    // if (req.body.password == req.body.password_confirmation) {
    //   User.findOne({email: req.body.email}, function(err, user){
    //                    req.session.userid = user.id});
    //                    console.log(user.id);
    // }

});
app.listen(3000, function () {
  console.log('Makers B&B app listening on port 3000!');
});


// https://expressjs.com/en/guide/routing.html - instruction how to create seperate files with routing
// User.findOne({email: req.body.email}, function(err, user){
//  req.session.user = user.id;
//  console.log(user.id + "stored user id cookie");
//});
