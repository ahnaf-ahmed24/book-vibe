"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { getReadBooks, getWishlist } from "@/utils/localStorage";
import { IBook } from "@/types/books.type";

const COLORS = ["#10B981", "#F43F5E", "#3B82F6", "#8B5CF6", "#F59E0B"];

export default function BookDashboardAnalytics() {
    const [allBooks, setAllBooks] = useState<IBook[]>([]);
    const [readIds, setReadIds] = useState<number[]>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // ক্লায়েন্ট রেন্ডারিং নিশ্চিত করা
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ডাটা লোড ও আপডেট সিঙ্ক করার ফাংশন
    const syncData = useCallback(async () => {
        try {
            const res = await fetch("/booksData.json");
            const data: IBook[] = await res.json();
            setAllBooks(data);
        } catch (err) {
            console.error("Failed to fetch books:", err);
        } finally {
            setLoading(false);
        }

        // LocalStorage থেকে আইডি আপডেট (নিরাপদ উপায়ে)
        if (typeof window !== "undefined") {
            setReadIds(getReadBooks() || []);
            setWishlistIds(getWishlist() || []);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            syncData();

            const handleStorageUpdate = () => {
                syncData();
            };

            window.addEventListener("storage-update", handleStorageUpdate);

            return () => {
                window.removeEventListener("storage-update", handleStorageUpdate);
            };
        }
    }, [isMounted, syncData]);

    if (!isMounted || loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-slate-400 font-medium">Loading Analytics...</span>
            </div>
        );
    }

    // ১. Read vs Wishlist vs Unread ডাটা তৈরি
    const readCount = readIds.length;
    const wishlistCount = wishlistIds.length;
    const totalBooksCount = allBooks.length;
    const unreadCount = Math.max(0, totalBooksCount - readCount);

    const bookDistributionData = [
        { name: "Read Books", value: readCount },
        { name: "Wishlist Books", value: wishlistCount },
        { name: "Unread/Remaining", value: unreadCount },
    ];

    // ২. পেজ সম্পর্কিত গণনা
    const readBooksDetails = allBooks.filter((book) =>
        readIds.includes(Number(book.bookId))
    );
    const totalReadPages = readBooksDetails.reduce(
        (acc, book) => acc + (book.totalPages || book.pages || 0),
        0
    );
    const totalAllPages = allBooks.reduce(
        (acc, book) => acc + (book.totalPages || book.pages || 0),
        0
    );

    const pageDistributionData = [
        { name: "Pages Read", value: totalReadPages },
        { name: "Pages Remaining", value: Math.max(0, totalAllPages - totalReadPages) },
    ];

    // ৩. বার চার্ট ডাটা
    const bookPagesBarData = allBooks.map((book) => ({
        name: book.bookName
            ? book.bookName.length > 12
                ? book.bookName.slice(0, 12) + "..."
                : book.bookName
            : "Book",
        pages: book.totalPages || book.pages || 0,
        status: readIds.includes(Number(book.bookId)) ? "Read" : "Unread",
    }));

    return (
        <div className="w-full space-y-8 p-4 md:p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl my-6 text-slate-100">
            <h2 className="text-2xl font-bold text-slate-100 text-center tracking-wide">
                📊 Real-time Books Analytics & Dashboard
            </h2>

            {/* সামারি কার্ডস */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* ১. Completion Percentage (টোটাল বইয়ের কত % শেষ হয়েছে) */}
  <div className="bg-slate-800/60 p-4 rounded-xl border border-emerald-500/20 text-center shadow-sm">
    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Completion Rate</p>
    <p className="text-2xl font-bold text-emerald-400 mt-1">
      {totalBooksCount > 0 ? Math.round((readCount / totalBooksCount) * 100) : 0}%
    </p>
  </div>

  {/* ২. Completed Books vs Total Books */}
  <div className="bg-slate-800/60 p-4 rounded-xl border border-emerald-500/20 text-center shadow-sm">
    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Completed Books</p>
    <p className="text-2xl font-bold text-emerald-400 mt-1">
      {readCount} <span className="text-sm font-normal text-slate-400">/ {totalBooksCount}</span>
    </p>
  </div>

  {/* ৩. Wishlist Books vs Total Books */}
  <div className="bg-slate-800/60 p-4 rounded-xl border border-rose-500/20 text-center shadow-sm">
    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">In Wishlist</p>
    <p className="text-2xl font-bold text-rose-400 mt-1">
      {wishlistCount} <span className="text-sm font-normal text-slate-400">/ {totalBooksCount}</span>
    </p>
  </div>

  {/* ৪. Pages Read vs Total Pages (এবং কত % পেজ পড়া হয়েছে) */}
  <div className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20 text-center shadow-sm">
    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Pages Read</p>
    <p className="text-2xl font-bold text-blue-400 mt-1">
      {totalReadPages} <span className="text-sm font-normal text-slate-400">/ {totalAllPages}</span>
      <span className="block text-xs font-normal text-slate-400 mt-0.5">
        ({totalAllPages > 0 ? Math.round((totalReadPages / totalAllPages) * 100) : 0}%)
      </span>
    </p>
  </div>
</div>

            {/* পাই চার্ট সেকশন */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 flex flex-col items-center">
                    <h3 className="font-semibold text-slate-300 mb-2">Book Status Distribution</h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bookDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {bookDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                                    itemStyle={{ color: "#f8fafc" }}
                                />
                                <Legend wrapperStyle={{ paddingTop: "10px", color: "#94a3b8" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 flex flex-col items-center">
                    <h3 className="font-semibold text-slate-300 mb-2">Pages Read vs Remaining</h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pageDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#334155" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                                    itemStyle={{ color: "#f8fafc" }}
                                />
                                <Legend wrapperStyle={{ paddingTop: "10px", color: "#94a3b8" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* বার চার্ট সেকশন */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <h3 className="font-semibold text-slate-300 mb-4 text-center">
                    Pages Per Book Breakdown
                </h3>
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bookPagesBarData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                                itemStyle={{ color: "#f8fafc" }}
                            />
                            <Legend wrapperStyle={{ paddingTop: "10px", color: "#94a3b8" }} />
                            <Bar dataKey="pages" fill="#3B82F6" name="Total Pages" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}