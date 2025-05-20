const Review = require('../models/Review');
const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

// @desc    Submit a review for a book
// @route   POST /api/books/:id/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  const existingReview = await Review.findOne({
    book: book._id,
    user: req.user._id
  });
  
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }
  
  const review = await Review.create({
    book: book._id,
    user: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment
  });
  
  res.status(201).json(review);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }
  
  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;
  
  const updatedReview = await review.save();
  
  res.json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }
  
  await review.deleteOne();
  
  res.json({ message: 'Review removed' });
});

module.exports = {
  createReview,
  updateReview,
  deleteReview
};