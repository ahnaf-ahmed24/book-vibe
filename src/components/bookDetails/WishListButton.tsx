"use client";

import { BooksContext } from "@/context/BooksContext";
import { IBook } from "@/types/books.type";
import { getWishlist, toggleWishlistBook } from "@/utils/localStorage";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishListButton = ({ book }: { book: IBook }) => {
  const { wishlist, setWishlist } = useContext(BooksContext);
  const [isAlreadyInWishlist, setIsAlreadyInWishlist] = useState<boolean>(false);

  // LocalStorage এবং Context দুটোর সাথেই স্ট্যাটাস সিঙ্ক রাখা
  useEffect(() => {
    const checkWishlistStatus = () => {
      const storedWishlistIds = getWishlist();
      const existsInStorage = storedWishlistIds.includes(Number(book.bookId));
      const existsInContext = wishlist?.some(
        (b: IBook) => String(b.bookId) === String(book.bookId)
      );

      setIsAlreadyInWishlist(existsInStorage || existsInContext);
    };

    checkWishlistStatus();

    // কাস্টম ইভেন্ট লিসেন করা
    window.addEventListener("storage-update", checkWishlistStatus);
    return () => window.removeEventListener("storage-update", checkWishlistStatus);
  }, [book.bookId, wishlist]);

  const handleAddToWishlist = () => {
    if (isAlreadyInWishlist) return;

    // ১. LocalStorage আপডেট করা (যা ড্যাশবোর্ডে রিয়েল-টাইমে আপডেট পাঠাবে)
    toggleWishlistBook(Number(book.bookId));

    // ২. Context State-এ বইটি যুক্ত করা
    if (setWishlist) {
      setWishlist((prevWishlist: IBook[]) => [...prevWishlist, book]);
    }

    toast.success(`You have added "${book.bookName}" to your wishlist`);
  };

  return (
    <button
      onClick={handleAddToWishlist}
      disabled={isAlreadyInWishlist}
      className={`btn flex-1 transition-all duration-200 ${
        isAlreadyInWishlist
          ? "btn-disabled bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
          : "btn-primary"
      }`}
    >
      {isAlreadyInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
};

export default WishListButton;