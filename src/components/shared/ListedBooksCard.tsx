import { IBook } from "@/types/books.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IListedBooksCardProps {
  book: IBook;
}

const ListedBooksCard = ({ book }: IListedBooksCardProps) => {
  return (
    <div className="group flex flex-col items-center overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row">
      {" "}
      {/* Book Image */}{" "}
      <div className="relative h-72 w-full shrink-0 overflow-hidden bg-base-200 sm:h-auto sm:w-[400px]">
        {" "}
        <Image
          src={book.image}
          alt={book.bookName}
          width={450}
          height={450}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />{" "}
        {/* Category */}{" "}
        <span className="absolute left-4 top-4 rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold shadow backdrop-blur">
          {" "}
          {book.category}{" "}
        </span>{" "}
      </div>{" "}
      {/* Details */}{" "}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {" "}
        {/* Tags */}{" "}
        <div className="mb-3 flex flex-wrap gap-2">
          {" "}
          {book.tags.map((tag) => (
            <span key={tag} className="badge badge-primary badge-outline">
              {" "}
              #{tag}{" "}
            </span>
          ))}{" "}
        </div>{" "}
        {/* Title */}{" "}
        <h2 className="text-2xl font-bold transition-colors group-hover:text-primary md:text-3xl">
          {" "}
          {book.bookName}{" "}
        </h2>{" "}
        {/* Author */}{" "}
        <p className="mt-1 text-sm text-base-content/60 md:text-base">
          {" "}
          Written by{" "}
          <span className="font-semibold text-base-content">
            {" "}
            {book.author}{" "}
          </span>{" "}
        </p>{" "}
        {/* Rating */}{" "}
        <div className="mt-4 flex items-center gap-2">
          {" "}
          <span className="text-lg text-orange-400">★★★★★</span>{" "}
          <span className="font-semibold"> {book.rating} </span>{" "}
          <span className="text-sm text-base-content/50"> / 5.0 </span>{" "}
        </div>{" "}
        {/* Review */}{" "}
        <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-6 text-base-content/65 md:text-base">
          {" "}
          {book.review}{" "}
        </p>{" "}
        {/* Book Info */}{" "}
        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-base-300 py-4 sm:grid-cols-4">
          {" "}
          <div>
            {" "}
            <p className="text-xs text-base-content/50">Pages</p>{" "}
            <p className="mt-1 font-bold">{book.totalPages}</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs text-base-content/50">Published</p>{" "}
            <p className="mt-1 font-bold">{book.yearOfPublishing}</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs text-base-content/50">Publisher</p>{" "}
            <p className="mt-1 truncate font-bold">{book.publisher}</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs text-base-content/50">Category</p>{" "}
            <p className="mt-1 font-bold">{book.category}</p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Actions */}{" "}
        <div className="mt-6 flex flex-wrap gap-3">
          {" "}
          <Link
            href={`/books/${book.bookId}`}
            className="btn btn-primary rounded-xl px-6"
          >
            <button className="btn btn-primary rounded-xl px-6">
              {" "}
              View Details →{" "}
            </button>{" "}
          </Link>
          <button className="btn btn-outline rounded-xl px-6">
            {" "}
            ♡ Save Book{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default ListedBooksCard;