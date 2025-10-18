"use client";
import { useState, useEffect } from "react";
import { MovieType } from "../lib/types/types";
import Pagination from "@/components/pagination/Pagination";

export default function Ratings() {
  const [movies, setMovies] = useState<MovieType[]>();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchRevenueCount = async () => {
      try {
        const res = await fetch("/lib/api/revenue/count");
        const data = await res.json();

        console.log("Count: ", data.length);
        setTotalPages(data.length / pageSize);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRevenueCount();

    const fetchRevenue = async () => {
      try {
        const res = await fetch("/lib/api/revenue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page, pageSize }),
        });
        const data = await res.json();

        const parsedMovies: MovieType[] = data.map((row: MovieType) => ({
          titleID: Number(row.titleID),
          primaryTitle: row.primaryTitle,
          cumulativeRevenue: Number(row.cumulativeRevenue),
          avgRating: Number(row.avgRating),
        }));

        setMovies(parsedMovies);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRevenue();
  }, [page]);

  function prevPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function nextPage() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  return (
    <div className="p-6">
      {movies ? (
        <>
          <h1 className="text-xl font-bold mb-4">Movies with a Low Rating</h1>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white rounded-lg">
              <tr>
                <th className="px-4 py-2 text-black">Title ID</th>
                <th className="px-4 py-2 text-black">Title</th>
                <th className="px-4 py-2 text-black">Revenue</th>
                <th className="px-4 py-2 text-black">Rating</th>
              </tr>
            </thead>
            <tbody className="rounded-lg">
              {movies.map((m) => (
                <tr key={m.titleID} className="text-center border-t">
                  <td className="px-4 py-2">{m.titleID}</td>
                  <td className="px-4 py-2">{m.primaryTitle}</td>
                  <td className="px-4 py-2">
                    ${m.cumulativeRevenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{m.avgRating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </>
      ) : (
        <p className="flex text-2xl font-bold justify-center">Loading...</p>
      )}
    </div>
  );
}
