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

  // console.log(books);
  // console.log(books.map(book => book.toJSON()));

})

);

/* GET new book form. */
//shows the create new book form

router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { title: "Add a new book" });
})

);

/* POST new book form. */
//posts a new book onto the database


/* GET book detail form. */

/*POST updates of book info into the database. */

/*POST delete a book. */











module.exports = router;
