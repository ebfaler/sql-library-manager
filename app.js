var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//importing sequelize instance
const { sequelize } = require('./models/index');

//authenticate connection to the database
sequelize
  .authenticate()
  .then(
    () => {
      console.log('Connection to the database successful!');
    }
  )
  .catch(
    (error) => {
      console.log(`Error connecting to the database: Error: ${error} `);
    }
  );

//sync and create the table
sequelize
  .sync()
  .then

  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Sync successful!');
    }
    catch (error) {
      console.log(`There has been an error. Error: + ${error}`);
    }
  }
  );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// creating a static route to serve the static files



/* Error Handlers */

/* 404 error handle */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Global error handler */
//called when all other errors occur
//If the error status is 404: Set the response status to 404 and render page-not-found
//else: 
//   * Set the error message to the specific given message, or specify a general, 
//     default error message
//   * Set response status to the given specific error status OR, set it to 500 by default if no error status is set
//   * Render the 'error' view, passing it the error object
app.use((err, req, res, next) => {

  if (err) {
    console.log('Global error handler called', err);
  }
  if (err.status === 404) {
    res.status(404).render('page-not-found', { err });
    console.log("error status already defined");
  } else {
    err.message = err.message || `Oops!  It looks like something went wrong on the server.`;
    res.status(err.status || 500).render('error', { err });
  }
});






module.exports = app;
