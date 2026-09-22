import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '@/assets/book.ico';

const Navbar = () => {
    const links = (
        <>
            <li>
                <Link href="/" className="font-medium hover:text-emerald-600 transition-colors">
                    Home
                </Link>
            </li>
            <li>
                <Link href="/books" className="font-medium hover:text-emerald-600 transition-colors">
                    Books
                </Link>
            </li>
            <li>
                <Link href="/listed-books" className="font-medium hover:text-emerald-600 transition-colors">
                    Listed Books
                </Link>
            </li>
            <li>
                <Link href="/read-books" className="font-medium hover:text-emerald-600 transition-colors">
                    Read Books
                </Link>
            </li>
            <li>
                <Link href="/dashboard" className="font-medium hover:text-emerald-600 transition-colors">
                    Dashboard
                </Link>
            </li>
        </>
    );

    return (
        <nav className="bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-xs">
            <div className="navbar container mx-auto px-4">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden mr-1 hover:bg-gray-100">
                            <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-[1] mt-3 w-52 p-3 shadow-xl border border-gray-100 gap-1">
                            {links}
                        </ul>
                    </div>

                    {/* লোগো এবং নামের ওপর ক্লিক করলে হোম পেজে নিয়ে যাবে */}
                    <Link href="/" className="flex gap-2.5 items-center group">
                        <div className="p-1 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <Image src={Logo} alt="Book Vibe Logo" width={28} height={28} />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                            Book Vibe
                        </span>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        {links}
                    </ul>
                </div>

                <div className="navbar-end gap-2">
                    <button className="btn btn-ghost hover:bg-emerald-50 text-emerald-700 font-semibold rounded-xl text-sm px-4">
                        Sign in
                    </button>
                    <button className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl border-none text-sm px-4 shadow-sm hover:shadow-md transition-all">
                        Sign up
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;