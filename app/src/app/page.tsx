"use client";
import { useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center" style={{height: 'calc(100vh - 88px)'}}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
        <a href='/audience' className="rounded-md bg-green-800 px-8 py-2 text-center text-xl">Audience</a>
        <a href='/genre' className="rounded-md bg-green-800 px-8 py-2 text-center text-xl">Genres</a>
        <a href='/ratings' className="rounded-md bg-green-800 px-8 py-2 text-center text-xl">Trends</a>
        <a href='/trends' className="rounded-md bg-green-800 px-8 py-2 text-center text-xl">Ratings</a>
        <a href='/revenue' className="rounded-md bg-green-800 px-8 py-2 text-center text-xl">Revenue</a>
      </div>
    </div>
  );
}
