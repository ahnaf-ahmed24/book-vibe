"use client";

import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Top Section: Branding, Newsletter & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info & Newsletter (Takes 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Book<span className="text-emerald-500">Vibe</span> 📚
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your ultimate destination for discovering life-changing books, timeless classics, and inspiring stories from top global authors.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                Subscribe to our newsletter
              </span>
              <form className="flex items-center gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-emerald-400 transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/listed-books" className="hover:text-emerald-400 transition-colors">
                  Listed Books
                </Link>
              </li>
              <li>
                <Link href="/pages-to-read" className="hover:text-emerald-400 transition-colors">
                  Pages to Read
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Fiction & Novels
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Self-Improvement
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Sci-Fi & Fantasy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Biography & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Customer Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Help Center / FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BookVibe. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;