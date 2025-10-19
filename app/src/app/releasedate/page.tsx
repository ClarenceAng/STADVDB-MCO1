"use client";
import { useState, useEffect } from "react";
import { ReleaseDateType } from "../lib/types/types";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export default function ReleaseDate() {
  const [releaseDate, setReleaseDate] = useState<ReleaseDateType[]>();

  useEffect(() => {
    try {
      const fetchReleaseDate = async () => {
        const res = await fetch("/lib/api/releasedate");
        const data = await res.json();

        const parsedReleaseDate = data.map((r: ReleaseDateType) => ({
          grossRevInMillions: r.grossRevInMillions,
          daysSinceRelease: r.daysSinceRelease,
        }));
        setReleaseDate(parsedReleaseDate);
      };

      fetchReleaseDate();
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div className="py-10">
      <div className="flex flex-col justify-center items-center text-center gap-2">
        <h1 className="flex justify-center text-3xl font-bold mb-4">
          Movies Daily Earnings since Release Date
        </h1>
        <LineChart width={1450} height={450} data={releaseDate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="daysSinceRelease" />
          <YAxis
            label={{
              value: "Revenue (in millions)",
              angle: -90,
              position: "insideLeft",
            }}
          />
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
            labelFormatter={(label) => `Day ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="grossRevInMillions"
            stroke="#f3ce13"
            strokeWidth={2}
          />
        </LineChart>
      </div>
    </div>
  );
}
