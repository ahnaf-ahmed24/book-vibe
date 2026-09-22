import ReadButton from "@/components/bookDetails/ReadButton";
import WishListButton from "@/components/bookDetails/WishListButton";
import { IBook } from "@/types/books.type";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface IBookDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const getBooks = async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/booksData.json`, {
            cache: "no-store",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching books data:", error);
        return [];
    }
};

const BookDetailsPage = async ({ params }: IBookDetailsPageProps) => {
    const { id } = await params;
    const booksData = await getBooks();

    const book = booksData.find(
        (book: IBook) => String(book.bookId) === String(id)
    ) as IBook;

    if (!book) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center items-center">
            {/* Container Size Limited to max-w-4xl for Normal Card Look */}
            <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">

                {/* Left Side: Book Image Section */}
                <div className="md:col-span-5 bg-slate-50 p-6 md:p-8 flex items-center justify-center relative">
                    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] shadow-2xl rounded-xl overflow-hidden group">
                        <Image
                            src={book.image}
                            alt={book.bookName}
                            fill
                            className="object-contain p-2 rounded-xl transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                    </div>
                </div>

                {/* Right Side: Details Section */}
                <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        {/* Category & Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                                {book.category}
                            </span>
                            {book.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Title & Author */}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                            {book.bookName}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            By <span className="text-gray-800 font-semibold">{book.author}</span>
                        </p>

                        {/* Rating Section */}
                        <div className="flex items-center gap-2 mt-3 pb-4 border-b border-gray-100">
                            <div className="flex items-center text-amber-400 text-sm">
                                {"★".repeat(Math.round(book.rating))}
                                {"☆".repeat(5 - Math.round(book.rating))}
                            </div>
                            <span className="text-sm font-bold text-gray-800">{book.rating}</span>
                            <span className="text-xs text-gray-400">/ 5.0</span>
                        </div>

                        {/* About / Review */}
                        <div className="mt-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                About This Book
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                {book.review}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Info Grid & Actions */}
                    <div className="mt-6">
                        {/* Meta Info Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center mb-6">
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase font-medium">Pages</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800">{book.totalPages}</p>
                            </div>
                            <div className="border-x border-gray-200">
                                <p className="text-[11px] text-gray-400 uppercase font-medium">Published</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800">{book.yearOfPublishing}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase font-medium">Publisher</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 truncate px-1">
                                    {book.publisher}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">

                            <WishListButton book={book}></WishListButton>

                            <ReadButton book={book}></ReadButton>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default BookDetailsPage;