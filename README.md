Tech Stack
Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT

Middleware: Helmet, CORS, Morgan

Environment: Dotenv



API Documentation
Authentication
Register a new user


curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com", "password": "password123"}'
Login


curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
Books
Create a book (Authenticated)

bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Classic"}'
Get all books with pagination

bash
curl -X GET "http://localhost:5000/api/books?page=1&limit=5&genre=Classic"
Get book details with reviews

bash
curl -X GET "http://localhost:5000/api/books/BOOK_ID?page=1&limit=3"
Search books

bash
curl -X GET "http://localhost:5000/api/search?q=gatsby"
Reviews
Submit a review (Authenticated)

bash
curl -X POST http://localhost:5000/api/books/BOOK_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rating": 5, "comment": "Amazing book!"}'
Update a review (Authenticated)

bash
curl -X PUT http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rating": 4, "comment": "Updated review"}'
Delete a review (Authenticated)

bash
curl -X DELETE http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Database Schema
Collections
Users

username (String, required, unique)

email (String, required, unique)

password (String, required)

createdAt (Date)

updatedAt (Date)

Books

title (String, required)

author (String, required)

genre (String, required)

publishedYear (Number)

description (String)

createdBy (ObjectId, ref: User)

createdAt (Date)

updatedAt (Date)

Reviews

book (ObjectId, ref: Book, required)

user (ObjectId, ref: User, required)

rating (Number, min: 1, max: 5, required)

comment (String)

createdAt (Date)

updatedAt (Date)

Indexes
Unique compound index on Reviews (book, user) to ensure one review per user per book

Text index on Books (title, author) for search functionality

Design Decisions
Authentication:

Used JWT for stateless authentication

Password hashing with bcryptjs

Token expiration set to 30 days

Pagination:

Implemented offset-based pagination for both books and reviews

Default limit of 10 for books and 5 for reviews

Reviews:

Enforced one review per user per book

Average rating calculated using MongoDB aggregation

Reviews can only be modified by their owners

Search:

Implemented MongoDB text search with case-insensitive partial matching

Results sorted by relevance score

Error Handling:

Custom error middleware for consistent error responses

Proper HTTP status codes for different scenarios

Security:

Helmet middleware for security headers

CORS enabled for cross-origin requests

Environment variables for sensitive configuration

Performance:

Indexes for frequently queried fields

Selective population of referenced documents

Aggregation pipeline for average rating calculation

Future Improvements
Add user roles (admin, regular user)

Implement rate limiting

Add book cover image upload

