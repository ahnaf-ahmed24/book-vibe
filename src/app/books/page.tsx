"use client";

import React, { useState, useEffect } from 'react';
import { IBook } from '@/types/books.type';
import BookCard from '@/components/shared/BookCard';

export default function Books() {
  const [booksData, setBooksData] = useState<IBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // প্রাথমিক অবস্থায় ৬টি বই দেখাবে
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:3000';

        const res = await fetch(`${baseUrl}/booksData.json`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch books data');
        }
        const books = await res.json();
        setBooksData(books);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // See More বাটনে ক্লিক করলে আরও ৬টি যোগ হবে
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium">
        Loading books...
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 bg-gradient-to-r from-emerald-200/30 via-teal-100/30 to-cyan-200/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Our Collection
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Explore All <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Books</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Discover amazing stories, timeless classics, and inspiring books from world-renowned authors.
          </p>

          {/* Stats / Quick Info */}
          <div className="mt-6 inline-flex items-center gap-4 px-4 py-2 bg-white/80 border border-slate-200/80 rounded-2xl shadow-sm backdrop-blur-sm text-xs sm:text-sm text-slate-600">
            <div>
              <span className="font-bold text-slate-900">{booksData.length}</span> Books Available
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div>
              <span className="font-bold text-slate-900">4.5+</span> Avg Rating
            </div>
          </div>
        </div>

        {/* Grid Layout Container */}
        {booksData.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch">
              {booksData.slice(0, visibleCount).map((book: IBook, ind: number) => (
                <div
                  key={book.bookId || ind}
                  className="transition-all duration-300 hover:-translate-y-1.5 h-full"
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {/* See More Button */}
            {visibleCount < booksData.length && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSeeMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
                >
                  <span>See More Books</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-slate-300 max-w-md mx-auto">
            <p className="text-slate-500 font-medium">No books found at the moment.</p>
          </div>
        )}

      </div>
    </section>
  );
}