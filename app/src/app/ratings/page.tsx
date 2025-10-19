"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { RatingType } from "../lib/types/types";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export default function Ratings() {
  const [ratings, setRatings] = useState<RatingType[]>();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch("/lib/api/ratings");
        const data = await res.json();

        const parsedRatings = data.map((r: RatingType) => ({
          primaryName: r.primaryName,
          finalAverageRating: r.finalAverageRating,
          movieCount: r.movieCount,
        }));

        setRatings(parsedRatings);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRatings();
  }, []);
  return (
    <div className="py-10">
      <div className="flex flex-col justify-center items-center text-center gap-2">
        <h1 className="flex justify-center text-3xl font-bold mb-4">
          Experienced Directors with Consistent Ratings
        </h1>
        {ratings ? (
          <>
            <div className="relative w-full max-w-[1250px] h-[600px] overflow-y-auto border border-gray-300 rounded-lg shadow">
              <BarChart
                width={1250}
                height={ratings ? ratings.length * 40 : 1000}
                data={ratings}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 10]} />
                <YAxis dataKey="primaryName" type="category" width={200} />
                <Tooltip
                  contentStyle={{
                    color: "black",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                  labelStyle={{
                    color: "black",
                  }}
                  labelFormatter={(label, payload) => {
                    const extra = payload?.[0]?.payload;
                    return `${label} (${extra.movieCount} movies)`; // <- additional info
                  }}
                />
                <Legend />
                <Bar dataKey="finalAverageRating" fill="#f3ce13" />
              </BarChart>
            </div>
          </>
        ) : (
          <p className="flex text-2xl font-bold justify-center">Loading...</p>
        )}
      </div>
    </div>
  );
}
