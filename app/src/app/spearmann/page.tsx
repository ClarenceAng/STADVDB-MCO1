"use client";
import { useState, useEffect } from "react";
import { SpearmannType } from "../lib/types/types";

export default function Spearmann() {
  const [data, setData] = useState<SpearmannType[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Short",
    "Sport",
    "Thriller",
    "War",
    "Western",
  ];

  useEffect(() => {
    if (selectedGenres.length === 0) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const results: SpearmannType[] = [];

        for (const genre of selectedGenres) {
          const res = await fetch("/lib/api/spearmann", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genre }),
          });
          const json = await res.json();
          results.push({
            genre,
            spearmann: json[0]?.spearmann ?? "N/A",
          });
        }

        setData(results);
      } catch (e) {
        console.error("Error fetching Spearmann:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenres]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">
        Ratings vs Revenue in Different Genres
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-8">
        {genres.map((g) => (
          <label key={g} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedGenres.includes(g)}
              onChange={() => toggleGenre(g)}
              className="accent-black"
            />
            <span>{g}</span>
          </label>
        ))}
      </div>

      {loading ? (
        <p className="text-xl font-bold">Loading...</p>
      ) : data.length > 0 ? (
        <table className="border-collapse border border-gray-400 text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-black">
                Genre
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-black">
                Spearmann Correlation
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.genre}>
                <td className="border border-gray-400 px-4 py-2">{d.genre}</td>
                <td className="border border-gray-400 px-4 py-2">
                  {d.spearmann}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 mt-4">
          Select one or more genres to see results.
        </p>
      )}
    </div>
  );
}
