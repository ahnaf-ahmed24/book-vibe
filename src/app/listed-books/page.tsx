"use client";

import ListedBooksCard from "@/components/shared/ListedBooksCard";
import { BooksContext } from "@/context/BooksContext";
import { IBook } from "@/types/books.type";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const ListedBooks = () => {
  const { readBooks, setReadBooks, wishlist, setWishlist } = useContext(BooksContext);
  const [sortBy, setSortBy] = useState<"rating" | "pages" | "year">("rating");
  
  // 1. ডিফল্টভাবে 'read' ট্যাব অ্যাক্টিভ রাখার জন্য State
  const [activeTab, setActiveTab] = useState<"read" | "wishlist">("read");

  // Sorting Function
  const sortBooks = (books: IBook[] = []) => {
    const sortedBooks = [...books];

    if (sortBy === "rating") {
      sortedBooks.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "pages") {
      sortedBooks.sort((a, b) => b.totalPages - a.totalPages);
    } else if (sortBy === "year") {
      sortedBooks.sort((a, b) => b.yearOfPublishing - a.yearOfPublishing);
    }

    return sortedBooks;
  };

  // Remove Handlers
  const handleRemoveRead = (book: IBook) => {
    const updatedReadBooks = readBooks.filter(
      (b: IBook) => String(b.bookId) !== String(book.bookId)
    );
    setReadBooks(updatedReadBooks);
    toast.warn(`"${book.bookName}" removed from Read List`);
  };

  const handleRemoveWishlist = (book: IBook) => {
    const updatedWishlist = wishlist.filter(
      (b: IBook) => String(b.bookId) !== String(book.bookId)
    );
    setWishlist(updatedWishlist);
    toast.warn(`"${book.bookName}" removed from Wishlist`);
  };

  const sortedReadBooks = sortBooks(readBooks);
  const sortedWishlist = sortBooks(wishlist);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[85vh]">
      {/* Hero Header */}
      <div className="relative overflow-hidden my-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 rounded-3xl p-8 border border-emerald-500/20 shadow-sm backdrop-blur-md text-center">
        <h2 className="font-black text-3xl md:text-4xl text-slate-800 tracking-tight">
          Your Book Shelf 📚
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-2 font-medium">
          Track your reading journey, manage wishlists & organize by favorites.
        </p>
      </div>

      {/* Control Bar: Sort Dropdown */}
      <div className="flex justify-end mb-6">
        <div className="relative inline-block w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "rating" | "pages" | "year")
            }
            className="w-full sm:w-auto appearance-none bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl px-5 py-3 pr-10 cursor-pointer shadow-md shadow-emerald-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            <option value="rating" className="bg-white text-gray-800">
              Sort By: Rating
            </option>
            <option value="pages" className="bg-white text-gray-800">
              Sort By: Number of Pages
            </option>
            <option value="year" className="bg-white text-gray-800">
              Sort By: Published Year
            </option>
          </select>
          {/* Custom Select Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Modern Segmented Custom Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab("read")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeTab === "read"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span>Read Books</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              activeTab === "read"
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {readBooks?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeTab === "wishlist"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span>Wishlist</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              activeTab === "wishlist"
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {wishlist?.length || 0}
          </span>
        </button>
      </div>

      {/* Tab Content Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden divide-y divide-slate-100">
        {/* READ BOOKS LIST */}
        {activeTab === "read" && (
          <div>
            {sortedReadBooks.length > 0 ? (
              sortedReadBooks.map((book: IBook) => (
                <div
                  key={book.bookId}
                  className="group relative flex items-start justify-between gap-4 p-4 md:p-5 bg-white hover:bg-slate-50/80 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <ListedBooksCard book={book} />
                  </div>

                  <button
                    onClick={() => handleRemoveRead(book)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 shrink-0 cursor-pointer"
                    title="Remove from Read List"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  📖
                </div>
                <h3 className="text-slate-700 font-bold text-base">No read books yet</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Books you mark as read will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* WISHLIST LIST */}
        {activeTab === "wishlist" && (
          <div>
            {sortedWishlist.length > 0 ? (
              sortedWishlist.map((book: IBook) => (
                <div
                  key={book.bookId}
                  className="group relative flex items-start justify-between gap-4 p-4 md:p-5 bg-white hover:bg-slate-50/80 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <ListedBooksCard book={book} />
                  </div>

                  <button
                    onClick={() => handleRemoveWishlist(book)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 shrink-0 cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  🔖
                </div>
                <h3 className="text-slate-700 font-bold text-base">Your wishlist is empty</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Save books you want to read in the future.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListedBooks;