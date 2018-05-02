require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const Schema       = mongoose.Schema;

const citySchema = Schema({
  name:  String,
  id: Number
});
const City = mongoose.model("City", citySchema);

const courseSchema = Schema({
  name:  String,
  id: Number,
  type: String
});
const Course = mongoose.model("Course", courseSchema);

const bootcampSchema = Schema({
  id: Number,
  cityId: Number,
  courseId: Number
});
const Bootcamp = mongoose.model("Bootcamp", bootcampSchema);

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/rest-api-example', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.get("/cities", (req,res,next) =>{
  City.find((err, cities) => {
    res.json(cities) // Generates the cities as a JSON file.
  });
});

app.get("/cities/:id", (req,res,next) => {
  City.findOne({id: req.params.id}, (err, theCity) => {
    res.json(theCity) // Generates the city selected by ID as a JSON file.
  })
});

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
app.use('/', index);

module.exports = app;
