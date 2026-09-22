// ব্রাউজারের ইন-মেমোরি স্টেট (রিফ্রেশ দিলে এটি মুছে রিসেট হয়ে যাবে)
let readBooksMemory: number[] = [];
let wishlistMemory: number[] = [];

// Read Books-এর তালিকা পাওয়া
export const getReadBooks = (): number[] => {
  return [...readBooksMemory];
};

// Wishlist-এর তালিকা পাওয়া
export const getWishlist = (): number[] => {
  return [...wishlistMemory];
};

// Read তালিকায় যোগ বা রিমুভ করা
export const toggleReadBook = (bookId: number): void => {
  if (readBooksMemory.includes(bookId)) {
    readBooksMemory = readBooksMemory.filter((id) => id !== bookId);
  } else {
    readBooksMemory.push(bookId);
  }

  // কম্পোনেন্টগুলোকে আপডেট জানানোর জন্য কাস্টম ইভেন্ট
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage-update"));
  }
};

// Wishlist তালিকায় যোগ বা রিমুভ করা
export const toggleWishlistBook = (bookId: number): void => {
  if (wishlistMemory.includes(bookId)) {
    wishlistMemory = wishlistMemory.filter((id) => id !== bookId);
  } else {
    wishlistMemory.push(bookId);
  }

  // কম্পোনেন্টগুলোকে আপডেট জানানোর জন্য কাস্টম ইভেন্ট
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage-update"));
  }
};