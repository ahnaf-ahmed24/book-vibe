"use client";

import BookDashboardAnalytics from "./BookDashboardAnalytics";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { Book } from "@/types/books.type";
import { getReadBooks, getWishlist } from "@/utils/localStorage";
import {
  BookOpen,
  Star,
  Search,
  Bookmark,
  CheckCircle2,
  Heart,
  LayoutGrid,
  List,
  Sparkles,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [readBookIds, setReadBookIds] = useState<number[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<"all" | "read" | "wishlist">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination limit state
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync Local Storage
  const syncLocalStorage = useCallback(() => {
    setReadBookIds(getReadBooks());
    setWishlistIds(getWishlist());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/booksData.json`);
        const data = await res.json();
        setAllBooks(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    syncLocalStorage();

    const handleStorageUpdate = () => syncLocalStorage();

    window.addEventListener("storage-update", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage-update", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [syncLocalStorage]);

  // Modal ESC Key Close & Body Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBook(null);
    };

    if (selectedBook) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBook]);

  // Dynamically extract categories
  const categories = useMemo(() => {
    const set = new Set(allBooks.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [allBooks]);

  const currentCategoryBooks = useMemo(() => {
    if (activeTab === "read") {
      return allBooks.filter((book) => readBookIds.includes(book.bookId));
    }
    if (activeTab === "wishlist") {
      return allBooks.filter((book) => wishlistIds.includes(book.bookId));
    }
    return allBooks;
  }, [allBooks, activeTab, readBookIds, wishlistIds]);

  const filteredBooks = useMemo(() => {
    return currentCategoryBooks.filter((book) => {
      const matchesSearch =
        book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [currentCategoryBooks, searchTerm, selectedCategory]);

  // Reset visible count when tab, search, or category changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeTab, searchTerm, selectedCategory]);

  const visibleBooks = useMemo(() => {
    return filteredBooks.slice(0, visibleCount);
  }, [filteredBooks, visibleCount]);

  const readBooksList = useMemo(
    () => allBooks.filter((b) => readBookIds.includes(b.bookId)),
    [allBooks, readBookIds]
  );

  const totalPagesRead = useMemo(() => {
    return readBooksList.reduce((acc, curr) => acc + (curr.totalPages || 0), 0);
  }, [readBooksList]);

  const handleSeeMore = useCallback(() => {
    setVisibleCount((prevCount) => prevCount + 6);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-600 font-semibold animate-pulse">
          <Sparkles className="animate-spin" size={22} />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-8 md:p-10 text-white shadow-xl shadow-emerald-500/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md mb-4 border border-white/20">
              <Sparkles size={14} /> Personal Book Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Book Vibe Dashboard
            </h1>
            <p className="mt-2 text-emerald-50 text-sm sm:text-base opacity-90 leading-relaxed">
              Track your reading progress, manage your wishlist, and explore your public book library with ease.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Collection</p>
                <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{allBooks.length}</p>
              </div>
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                <BookOpen size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Books</p>
                <p className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">{readBookIds.length}</p>
              </div>
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Wishlist</p>
                <p className="text-3xl font-bold mt-2 text-rose-500">{wishlistIds.length}</p>
              </div>
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-xl">
                <Heart size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pages Read</p>
                <p className="text-3xl font-bold mt-2 text-amber-500">{totalPagesRead}</p>
              </div>
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl">
                <Bookmark size={24} />
              </div>
            </div>
          </div>
        </div>


        <BookDashboardAnalytics />  

        {/* Controls Section */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "all"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                All Books ({allBooks.length})
              </button>
              <button
                onClick={() => setActiveTab("read")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "read"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Read Books ({readBookIds.length})
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "wishlist"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Wishlist ({wishlistIds.length})
              </button>
            </div>

            {/* Toggle View Mode */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-[160px]">
                <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by Category"
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
            <BookOpen className="mx-auto text-slate-300 dark:text-slate-700" size={48} />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No books found</h3>
            <p className="text-sm text-slate-400">Try resetting your search query or filters.</p>
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 transition mt-2"
              >
                <RotateCcw size={14} /> Reset Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 flex flex-col"
                >
                  <div className="p-5 flex-1 flex gap-4">
                    <div className="relative w-24 h-36 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={book.image}
                        alt={book.bookName}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md mb-2">
                          {book.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-base leading-snug group-hover:text-emerald-600 transition-colors">
                          {book.bookName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">By {book.author}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mt-2">
                        <Star size={14} fill="currentColor" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{book.totalPages} pages</span>
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* See More Button */}
            {visibleCount < filteredBooks.length && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSeeMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  <span>See More Books</span>
                  <ChevronDown size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Book Title</th>
                      <th className="px-6 py-4 font-semibold">Author</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Rating</th>
                      <th className="px-6 py-4 font-semibold">Pages</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visibleBooks.map((book) => (
                      <tr key={book.bookId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-12 flex-shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-700">
                              <Image src={book.image} alt={book.bookName} fill sizes="36px" className="object-cover" />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{book.bookName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{book.author}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-amber-500">
                          <div className="flex items-center gap-1">
                            <Star size={14} fill="currentColor" />
                            <span>{book.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{book.totalPages}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedBook(book)}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* See More Button for Table View */}
            {visibleCount < filteredBooks.length && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSeeMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  <span>See More Books</span>
                  <ChevronDown size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {selectedBook && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative space-y-6 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex gap-5">
                <div className="relative w-28 h-40 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                  <Image
                    src={selectedBook.image}
                    alt={selectedBook.bookName}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {selectedBook.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedBook.bookName}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">By {selectedBook.author}</p>
                  
                  <div className="pt-2 text-xs text-slate-400 space-y-0.5">
                    <p>Publisher: <span className="text-slate-600 dark:text-slate-300 font-medium">{selectedBook.publisher}</span></p>
                    <p>Year: <span className="text-slate-600 dark:text-slate-300 font-medium">{selectedBook.yearOfPublishing}</span></p>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm pt-2">
                    <Star size={16} fill="currentColor" />
                    <span>{selectedBook.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Review Summary</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 max-h-36 overflow-y-auto">
                  {selectedBook.review}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}