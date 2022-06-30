var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const {
  Op
} = require('sequelize');

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


function getNumericParameter(query, paramName, defaultVal) {
  if (query && query[paramName]) {
    const value = Number.parseInt(query[paramName]);

    if (!Number.isNaN(value) && value >= 0) {
      return value;
    }
  }
  //if any of the above fails, return the defaultVal
  return defaultVal;
}


/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

/* GET books page. */
router.get('/books', asyncHandler(async (req, res) => {

  const page = getNumericParameter(req.query, "page", 0);
  const size = getNumericParameter(req.query, "size", 10);


  const dbQueryParams = {
    //max number of objects per page
    limit: size,
    // number of objects to skip past
    offset: page * size
  };
  if (req.query && req.query.search) {
    const queryString = req.query.search;
    console.log(queryString);
    dbQueryParams.where = {
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + queryString + "%"
            }
          }, {
            author: {
              [Op.like]: "%" + queryString + "%"
            }
          }, {
            genre: {
              [Op.like]: "%" + queryString + "%"
            }
          }, {
            year: {
              [Op.like]: "%" + queryString + "%"
            }
          }
        ]
      };
  }
  const books = await Book.findAndCountAll(dbQueryParams);
  console.log(books.count);
  console.log(Math.ceil(books.count/ size));
  res.render('index', {
    books: books.rows,
    currentPage: page,
    maxResults: size,
    //the last page to display
    totalPages: Math.ceil(books.count/ size),
    title: "Catalogue of Books"
  
  });

})



);


/* Create a new book form. */

router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "Add a new book" });
})

);

/* Add a new book to the database. */

router.post('/books/new', asyncHandler(async (req, res) => {
  // const book = await Book.create(req.body);
  // res.redirect("/books/" + book.id);
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("form-error", { book, errors: error.errors, title: "Add a new book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }

  }
  console.log("validation error");
})
);


/* Displays the book form and option to edit. */

router.get('/books/:id', asyncHandler(async (req, res) => {
  console.log("displaying book form");
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book: book, title: "Added book to database" });


})

);

/*Update the book form. */

router.post('/books/:id', asyncHandler(async (req, res) => {

  //   const book = await Book.findByPk(req.params.id);
  //   await book.update(req.body);

  //   res.render('update-book', {book: book, title: "Updated book" });
  //   // res.redirect("/books/" + book.id);
  //   console.log("updated book form");
  //   //need to display error if sequel validation error when updating too
  // })

  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("form-error", { book, errors: error.errors, title: "Add a new book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }

  }
  console.log("validation error");
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

/*Search functionality*/

// router.get('/books/search/', asyncHandler(async (req, res) => {

//   let searchTerm = req.query.search;
//   console.log(searchTerm);
//   searchTerm = searchTerm.toLowerCase();
//   await Book.findAll(
//     //how to get value of query and why the value is assigned to id
//     {
//       where: {
//         title: {
//           [Op.like]: "%" + searchTerm + "%"
//         }
//       }

//     }
//   )

//   // .then(books => res.render("index", { books }));
//   console.log("searching");


//   //  res.render('index', { books, title: "Catalogue of Books" });
//   // SELECT * FROM post WHERE title, author, genre, year are defined;

// })
// );






module.exports = router;
