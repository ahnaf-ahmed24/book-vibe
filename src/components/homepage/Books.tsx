import React from 'react';
import BookCard from '../shared/BookCard';
import { IBook } from '@/types/books.type';

const getBooks = async (): Promise<IBook[]> => {
  try {
    // Vercel বা Local environment এর base URL সেট করা
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || '';
    
    // Server-side fetching
    const res = await fetch(`${baseUrl}/booksData.json`, {
      cache: 'no-store', // সবসময় ফ্রেশ ডাটা পাওয়ার জন্য
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const books = await res.json();
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    return []; // এরর হলে খালি অ্যারে রিটার্ন করবে যাতে অ্যাপ ক্র্যাশ না করে
  }
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 items-stretch">
        {booksData && booksData.length > 0 ? (
          booksData.slice(0, 8).map((book: IBook, ind: number) => (
            <BookCard key={book.bookId || ind} book={book} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            No books found!
          </p>
        )}
      </div>
    </section>
  );
};

export default Books;