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

/* GET new book form. */
//shows the create new book form

router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {},title: "Add a new book" });
})

);

/* POST new book form. */
//posts a new book onto the database

router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books/" + book.id);

})

);


/* GET book update form. */

router.get('/books/:id', asyncHandler(async (req, res) => {
  console.log("displaying book form");

  res.render('update-book', {book: {}, title: "Added book to database" });


})

);

/*POST update of book info into the database. */

router.post('/books/:id', asyncHandler(async (req, res) => {
  console.log("posting book form");

  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  
  res.redirect("/books/" + book.id);
  //add text to say book has been updated

})

);


/*POST delete a book. */
// /books/:id/delete


router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  console.log("deleting a book");
  
})

);









module.exports = router;
