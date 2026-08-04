"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const BookItem = ({ book }) => {
  const router = useRouter();
  
  const handleNavigate = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <div onClick={handleNavigate} className="cursor-pointer py-2 border-b hover:bg-gray-50 transition-colors">
      <h3 className="text-lg">{book.title}</h3>
      <p className="text-sm font-medium text-gray-600">@{book.author}</p>
    </div>
  );
};

export default BookItem;