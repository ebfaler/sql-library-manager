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
        catch(error)
        {
          console.log(`There has been an error. Error: + ${error}`);
        } 
      }
  );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
