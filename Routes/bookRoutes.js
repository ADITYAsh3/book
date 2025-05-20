const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBook,
  getBooks,
  getBookById,
  searchBooks
} = require('../controllers/bookController');

router.route('/')
  .post(protect, createBook)
  .get(getBooks);

router.route('/:id')
  .get(getBookById);

router.route('/:id/reviews')
  .post(protect, require('../controllers/reviewController').createReview);

router.get('/search', searchBooks);

module.exports = router;