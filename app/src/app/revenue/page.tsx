"use client";
import Header from "@/components/Header";
import { useEffect } from "react";

useEffect(() => {
  const fetchRevenue = async () => {
    try {
      const res = await fetch("app/lib/api/revenue");
      const data = res.json();
    } catch (e) {
      console.error(e);
    }
  };

  fetchRevenue();
}, []);

export default function Ratings() {
  return <div className="flex min-h-screen flex-col"></div>;
}
