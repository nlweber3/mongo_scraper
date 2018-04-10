//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var request = require('request');
var morgan = require('morgan');

var axios = require('axios');
var cheerio = require('cheerio');

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

var db = mongoose.connection;

//render handlebars page
app.get('/', (req, res) => {
    res.render('index.handlebars');
    console.log('working');
});



// Show any mongoose errors
db.on("error", (error) => {
    console.log("Mongoose Error: ", error);
  });
  
  // Once logged in to the db through mongoose, log a success message
  db.once("open", () => {
    console.log("Mongoose connection successful.");
  });


app.get("/scrape", (req, res) => {
    // First, we grab the body of the html with request
    axios.get("http://www.latimes.com/").then((response) => {

        var $ = cheerio.load(response.data);

        $('article h2').each((i, element) => {
            var result = {};

            result.title = $(this)
                .children('a')
                .text();
            result.summary = $(this)
                .children('a')
                .text();
            result.link = $(this)
                .children('a')
                .attr('href');

            db.Article.create(result).then ((dbArticle) => {
                console.log(dbArticle);
            })
            .catch((err) => {
                return res.json(err);
            });
        });
        res.send('complete');
    });
});
  

// server listener
app.listen(PORT, function () {
            console.log("App listening on PORT " + PORT);
        });