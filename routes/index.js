var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

//Try Catch function acts as a Middleware

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      // res.status(500).send(error);
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

/* GET books page. */
router.get('/books', asyncHandler(async (req, res) => {

  const books = await Book.findAll();
  res.render('index', { books, title: "Cataloge of Books" });

  console.log(books);
  console.log(books.map(book => book.toJSON()));


})

);


// get / - Home route should redirect to the /books route
// get /books - Shows the full list of books
// get /books/new - Shows the create new book form
// post /books/new - Posts a new book to the database
// get /books/:id - Shows book detail form
// post /books/:id - Updates book info in the database
// post /books/:id/delete - Deletes a book










module.exports = router;
