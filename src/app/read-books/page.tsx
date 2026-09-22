"use client";

import { BooksContext } from "@/context/BooksContext";
import { IBook } from "@/types/books.type";
import React, { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface ChartDataItem {
  name: string;
  uv: number;
  pv: number;
}

// Modern & Vibrant Color Palette
const colors = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

// Custom Triangle Bar Shape
const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

// Any/Record দিয়ে Props টাইপ করা হয়েছে যেন Recharts Custom Shape এরর না দেয়
const TriangleBar = (props: any) => {
  const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props;
  const color = colors[index % colors.length];

  return (
    <path
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      stroke={color}
      fill={color}
      style={{
        filter: "drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.15))",
        transition: "transform 0.3s ease, filter 0.3s ease",
      }}
      className="hover:opacity-90 cursor-pointer"
    />
  );
};

// Custom Label on top of each bar
const CustomColorLabel = (props: any) => {
  const { x, y, width, value, index = 0 } = props;
  const fill = colors[index % colors.length];

  if (x === undefined || y === undefined || width === undefined) return null;

  return (
    <text
      x={Number(x) + Number(width) / 2}
      y={Number(y) - 10}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs font-bold"
    >
      {value} pages
    </text>
  );
};

// Custom Glassmorphism Tooltip (সংশোধিত টাইপিং)
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-1">
        <p className="font-bold text-gray-800 text-sm">{data.name}</p>
        <p className="text-xs text-indigo-600 font-semibold">
          📖 Pages: <span className="text-gray-700">{data.uv}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ReadBooks = () => {
  const context = useContext(BooksContext);
  const readBooks: IBook[] = context?.readBooks || [];

  const data: ChartDataItem[] = readBooks.map((book: IBook, index: number) => ({
    name: book.bookName,
    uv: Number(book.totalPages) || 0,
    pv: index + 1,
  }));

  // Total pages calculation for summary badge
  const totalPagesRead = readBooks.reduce(
    (acc: number, book: IBook) => acc + (Number(book.totalPages) || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-8 max-w-5xl"
    >
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-8 border border-emerald-100/80 shadow-xs text-center relative overflow-hidden">
        <h2 className="font-extrabold text-2xl md:text-4xl text-gray-800 mb-2">
          Reading Analytics 📊
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
          Visual representation of total pages read per book.
        </p>

        {readBooks.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-200/60 shadow-xs">
            <span className="text-xs font-semibold text-gray-600">
              Total Books: <strong className="text-emerald-600">{readBooks.length}</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-semibold text-gray-600">
              Total Pages: <strong className="text-indigo-600">{totalPagesRead}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Chart Card */}
      {readBooks.length > 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="w-full h-[380px] md:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 30, right: 20, left: -10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="uv"
                  shape={<TriangleBar />}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  <LabelList dataKey="uv" content={<CustomColorLabel />} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center text-3xl">
            📚
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            No Read Books Yet!
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Mark books as read from your listed books to view your reading bar chart analytics here.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReadBooks;