"use client";
import { useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
    </div>
  );
}
