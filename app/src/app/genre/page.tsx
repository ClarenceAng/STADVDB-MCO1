"use client";
import { useState, useEffect } from "react";
import { GenreType } from "../lib/types/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Genre() {
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("Action");
  const [tab, setTab] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  const genreList = [
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
    const fetchGenres = async () => {
      setLoading(true);
      const res = await fetch("/lib/api/genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedGenre }),
      });
      const data = await res.json();

      const parsedGenres = data.map((d: GenreType) => ({
        titleID: d.titleID,
        primaryTitle: d.primaryTitle,
        year: d.year,
        month: d.month,
        day: d.day,
        totalGrossRevenue: Number(d.totalGrossRevenue),
      }));

      setGenres(parsedGenres);
      setLoading(false);
    };

    fetchGenres();
  }, [selectedGenre]);

  const filtered =
    tab === "monthly"
      ? genres.filter((g) => g.year && g.month && !g.day)
      : genres.filter((g) => g.year && !g.month && !g.day);

  const chartData = filtered.map((g) => ({
    label: tab === "monthly" ? `${g.year}-${g.month}` : `${g.year}`,
    totalGrossRevenue: g.totalGrossRevenue,
  }));

  return (
    <div className="py-10 text-gray-200 bg-black min-h-screen">
      <div className="flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-3xl font-extrabold text-white mb-4">
          Movie Industry Performance ({selectedGenre})
        </h1>

        {/* Genre selector */}
        <select
          id="selectGenre"
          className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2"
          style={{ boxShadow: "0 0 0 2px #facc15" }}
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genreList.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Tabs */}
        <div className="flex mt-6 border-b border-gray-700">
          {["monthly", "yearly"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                tab === t ? "border-b-2" : "hover:text-white"
              }`}
              style={{
                color: tab === t ? "#facc15" : "#9ca3af", // active: yellow, inactive: gray
                borderColor: tab === t ? "#facc15" : "transparent",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <p
            className="flex text-2xl font-bold justify-center mt-6 animate-pulse"
            style={{ color: "#facc15" }}
          >
            Loading...
          </p>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto w-full max-w-5xl border border-gray-700 rounded-lg shadow-lg mt-4">
              <table className="w-full border-collapse text-sm text-left">
                <thead className="bg-gray-900 text-gray-200 border-b border-gray-700">
                  <tr>
                    {tab === "monthly" && (
                      <>
                        <th className="p-3 border-r border-gray-700">Year</th>
                        <th className="p-3 border-r border-gray-700">Month</th>
                      </>
                    )}
                    {tab === "yearly" && (
                      <th className="p-3 border-r border-gray-700">Year</th>
                    )}
                    <th className="p-3 text-right">
                      Total Gross Revenue (in Millions)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr
                      key={i}
                      className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition"
                    >
                      {tab === "monthly" && (
                        <>
                          <td className="p-3 border-r border-gray-700">
                            {row.year}
                          </td>
                          <td className="p-3 border-r border-gray-700">
                            {row.month}
                          </td>
                        </>
                      )}
                      {tab === "yearly" && (
                        <td className="p-3 border-r border-gray-700">
                          {row.year}
                        </td>
                      )}
                      <td
                        className="p-3 text-right font-medium"
                        style={{ color: "#fde047" }}
                      >
                        {row.totalGrossRevenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart */}
            <div className="w-full max-w-5xl h-80 mt-10 bg-gray-900 p-4 rounded-lg shadow-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="label"
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    tickLine={false}
                  />
                  <YAxis stroke="#ccc" tick={{ fill: "#ccc" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalGrossRevenue"
                    name="Total Revenue (M)"
                    fill="#facc15"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
