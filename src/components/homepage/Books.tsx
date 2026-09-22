import React from 'react';
import BookCard from '../shared/BookCard';
import { IBook } from '@/types/books.type';

const getBooks = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/booksData.json`, {
    cache: 'no-store', // সবসময় লেটেস্ট ডাটা পাওয়ার জন্য
  });
  const books = await res.json();
  return books;
};

const Books = async () => {
  const booksData = await getBooks();

  return (
    <section className="container mx-auto my-[40px] md:my-[70px] px-2 sm:px-4">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-10">
        <span className="text-emerald-600 text-xs font-bold tracking-widest uppercase">
          OUR COLLECTION
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-1 mb-2">
          Explore Popular Books
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto px-4">
          Discover amazing stories, timeless classics, and inspiring books from
          talented authors.
        </p>
      </div>

      {/* Grid Layout Container */}
      {/* 
        grid-cols-2    -> মোবাইল স্ক্রিনে ২টি কার্ড
        md:grid-cols-3 -> মাঝারি/ট্যাবলেট স্ক্রিনে ৩টি কার্ড
        lg:grid-cols-4 -> ল্যাপটপ/ফুল স্ক্রিনে ৪টি কার্ড
        gap-2 sm:gap-6 -> ছোট স্ক্রিনে কার্ড গ্যাপ কম রাখা যেন ২টি সুন্দর ধরে
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 items-stretch">
        {booksData.slice(0, 8).map((book: IBook, ind: number) => {
          return <BookCard key={book.bookId || ind} book={book} />;
        })}
      </div>
    </section>
  );
};

export default Books;