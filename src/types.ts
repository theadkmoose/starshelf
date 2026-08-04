"use client";

export interface Book {
  id: number;
  title: string;
  author: string;
  year_published: number;
  genre: string;
  goodreads_link?: string; // Optional property for Goodreads link
}