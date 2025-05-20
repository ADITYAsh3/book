const Book = require('../models/Book');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');

//     Create a new book
//    POST /api/books
//   Private
const createBook = asyncHandler(async (req, res) => {
  const { title, author, genre, publishedYear, description } = req.body;
  
  const book = await Book.create({
    title,
    author,
    genre,
    publishedYear,
    description,
    createdBy: req.user._id
  });

  res.status(201).json(book);
});

//     Get all books with pagination and filtering
//    GET /api/books
//  Public
const getBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const query = {};
  if (req.query.author) query.author = req.query.author;
  if (req.query.genre) query.genre = req.query.genre;
  
  const books = await Book.find(query)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'username');
    
  const total = await Book.countDocuments(query);
  
  res.json({
    books,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get book by ID with reviews and average rating
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('createdBy', 'username');
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  // Get average rating
  const [result] = await Review.aggregate([
    { $match: { book: book._id } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } }
  ]);
  
  const averageRating = result ? result.averageRating : 0;
  
  // Get reviews with pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  
  const reviews = await Review.find({ book: book._id })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username');
    
  const totalReviews = await Review.countDocuments({ book: book._id });
  
  res.json({
    book,
    averageRating: averageRating.toFixed(1),
    reviews,
    reviewPage: page,
    reviewPages: Math.ceil(totalReviews / limit),
    totalReviews
  });
});

// @desc    Search books by title or author
// @route   GET /api/books/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Please provide a search query');
  }
  
  const books = await Book.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
  
  res.json(books);
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  searchBooks
};