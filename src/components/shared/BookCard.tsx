import { IBook } from '@/types/books.type';
import Image from 'next/image';
import Link from 'next/link';

interface IBookCardProps {
  book: IBook;
}

// ক্যাটাগরি অনুযায়ী কালার ম্যাপ
const categoryColors: Record<string, string> = {
  Classic: 'bg-amber-100 text-amber-800 border-amber-200',
  Fiction: 'bg-blue-100 text-blue-800 border-blue-200',
  Fantasy: 'bg-purple-100 text-purple-800 border-purple-200',
  Mystery: 'bg-rose-100 text-rose-800 border-rose-200',
  'Sci-Fi': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Non-Fiction': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Historical: 'bg-orange-100 text-orange-800 border-orange-200',
};

const BookCard = ({ book }: IBookCardProps) => {
  const {
    bookName,
    author,
    image,
    totalPages,
    rating,
    category,
    tags,
    publisher,
    yearOfPublishing,
  } = book;

  // বর্তমান ক্যাটাগরির কালার ক্লাস (ম্যাচ না করলে ডিফল্ট গ্রে)
  const categoryBadgeStyle =
    categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 bg-gray-100">
        <Image
          src={image}
          alt={bookName}
          fill
          unoptimized={true}
          className="object-cover"
          priority={false}
        />

        {/* Dynamic Category Pill (Top Left) */}
        <span
          className={`absolute top-3 left-3 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-sm border ${categoryBadgeStyle}`}
        >
          {category}
        </span>

        {/* Rating Badge (Top Right) */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="text-yellow-400">★</span>
          <span>{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags?.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Book Title & Author */}
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">
            {bookName}
          </h2>
          <p className="text-sm text-gray-500 font-medium mb-4">
            by <span className="text-gray-700">{author}</span>
          </p>
        </div>

        {/* Bottom Details & Button */}
        <div>
          {/* Meta Info: Pages, Published, Publisher */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 mb-4 text-xs">
            <div>
              <p className="text-gray-400">Pages</p>
              <p className="font-semibold text-gray-800">{totalPages}</p>
            </div>
            <div>
              <p className="text-gray-400">Published</p>
              <p className="font-semibold text-gray-800">{yearOfPublishing}</p>
            </div>
            <div>
              <p className="text-gray-400">Publisher</p>
              <p className="font-semibold text-gray-800 truncate">{publisher}</p>
            </div>
          </div>

          {/* View Details Button */}
          <Link href={`/books/${book.bookId}`}>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2">
              <span>View Details</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;