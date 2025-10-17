"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: "calc(100vh - 88px)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
        <Link
          href="/audience"
          className="rounded-md bg-green-800 px-8 py-2 text-center text-xl"
        >
          Audience
        </Link>
        <Link
          href="/genre"
          className="rounded-md bg-green-800 px-8 py-2 text-center text-xl"
        >
          Genres
        </Link>
        <Link
          href="/ratings"
          className="rounded-md bg-green-800 px-8 py-2 text-center text-xl"
        >
          Trends
        </Link>
        <Link
          href="/trends"
          className="rounded-md bg-green-800 px-8 py-2 text-center text-xl"
        >
          Ratings
        </Link>
        <Link
          href="/revenue"
          className="rounded-md bg-green-800 px-8 py-2 text-center text-xl"
        >
          Revenue
        </Link>
      </div>
    </div>
  );
}
