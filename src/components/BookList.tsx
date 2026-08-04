"use client";

import React from 'react';
import { getGoodreadsUrl } from '../utils/booksUtils';

const books = [
  { id: 1, title: "Book Title", author: "Author Name", goodreadsUrl: "" },
  // Other books...
];

const BookList: React.FC = () => {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <a href={getGoodreadsUrl(book.title)} target="_blank" rel="noopener noreferrer">
            {book.title}
          </a> by {book.author}
        </li>
      ))}
    </ul>
  );
};

export default BookList;