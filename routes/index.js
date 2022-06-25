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
  res.render('index', { books, title: "Catalogue of Books" });

  // console.log(books);
  // console.log(books.map(book => book.toJSON()));

})

);

/* Create a new book form. */


router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {},title: "Add a new book" });
})

);

/* Add a new book to the database. */

router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books/" + book.id);

})

);


/* Displays the book form and option to edit. */

router.get('/books/:id', asyncHandler(async (req, res) => {
  console.log("displaying book form");
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', {book: book, title: "Added book to database" });


})

);

/*Update the book form. */

router.post('/books/:id', asyncHandler(async (req, res) => {
 
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  
  res.render('update-book', {book: book, title: "Updated book" });
  // res.redirect("/books/" + book.id);
  console.log("updated book form");

})

);

/*Delete a book. */

router.post('/books/:id/delete', asyncHandler(async (req, res) => {

  const book = await Book.findByPk(req.params.id);
  await book.destroy(req.body);
  res.redirect("/books");
  console.log("deleted a book");
  
})

);









module.exports = router;
