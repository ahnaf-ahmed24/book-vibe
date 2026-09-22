"use client";

import { BooksContext } from "@/context/BooksContext";
import { IBook } from "@/types/books.type";
import { getReadBooks, toggleReadBook } from "@/utils/localStorage";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReadButton = ({ book }: { book: IBook }) => {
  const { readBooks, setReadBooks } = useContext(BooksContext);
  const [isRead, setIsRead] = useState<boolean>(false);

  // LocalStorage এবং Context দুটোর সাথেই স্ট্যাটাস সিঙ্ক রাখা
  useEffect(() => {
    const checkReadStatus = () => {
      const storedReadIds = getReadBooks();
      const existsInStorage = storedReadIds.includes(Number(book.bookId));
      const existsInContext = readBooks?.some(
        (b: IBook) => String(b.bookId) === String(book.bookId)
      );

      setIsRead(existsInStorage || existsInContext);
    };

    checkReadStatus();

    // কাস্টম ইভেন্ট লিসেন করা যাতে রিয়েল-টাইমে স্ট্যাটাস চেঞ্জ হয়
    window.addEventListener("storage-update", checkReadStatus);
    return () => window.removeEventListener("storage-update", checkReadStatus);
  }, [book.bookId, readBooks]);

  const handleReadBook = () => {
    if (isRead) return;

    // ১. LocalStorage আপডেট করা (যা 'storage-update' ইভেন্ট ফায়ার করে ড্যাশবোর্ডে রিয়েল-টাইমে পাঠাবে)
    toggleReadBook(Number(book.bookId));

    // ২. Context State-এ বইটি যুক্ত করা
    if (setReadBooks) {
      setReadBooks((prevReadBooks: IBook[]) => [...prevReadBooks, book]);
    }

    toast.success(`You have read "${book.bookName}"`);
  };

  return (
    <button
      onClick={handleReadBook}
      disabled={isRead}
      className={`flex-1 font-medium py-3 rounded-xl text-sm transition-all duration-200 ${
        isRead
          ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg active:scale-95"
      }`}
    >
      {isRead ? "Already Read" : "Read"}
    </button>
  );
};

export default ReadButton;