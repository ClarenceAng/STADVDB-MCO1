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
      Click the menu on the top left to view pages
    </div>
  );
}
