"use client";

import React from 'react';
import { books } from '../books.json';
import BookItem from '../components/BookItem';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Book Club</h1>
      
      <ul>
        {books.map(book => (
          <li key={book.id} >
            <BookItem book={book} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;