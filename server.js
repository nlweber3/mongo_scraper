//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var request = require('request');
var morgan = require('morgan');

var PORT = process.env.PORT || 3000;

var Article = require('./models/Articles.js');

require('./public/app.js');

require('dotenv').config();

// log every request to the console
app.use(morgan('dev'));



mongoose.connect('mongodb://localhost/my_database');

// setting handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("/public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

//render handlebars page
app.get ('/', (req, res) => {
    res.render('index.handlebars');
    console.log('working');
});


// server listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});