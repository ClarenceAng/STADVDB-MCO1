"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { TrendsType } from "../lib/types/types";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export default function Trends() {
  const [trends, setTrends] = useState<TrendsType[]>();
  const [selectedYear, setSelectedYear] = useState(2024);
  useEffect(() => {
    try {
      const fetchTrends = async () => {
        const res = await fetch("/lib/api/trends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedYear }),
        });
        const data = await res.json();

        const parsedTrends = data.map((t: TrendsType) => ({
          totalRevenueThatDayInMillions: t.totalRevenueThatDayInMillions,
          year: t.year,
          month: t.month,
          day: t.day,
        }));

        setTrends(parsedTrends);
      };

      fetchTrends();
      console.log("Trends:", trends);
    } catch (e) {
      console.error(e);
    }
  }, [selectedYear]);

  return (
    <div className="flex min-h-screen flex-col">
      {trends ? (
        <>
          <div className="py-10">
            <div className="flex justify-center items-center text-center gap-2">
              <h1 className="flex justify-center text-3xl font-bold mb-4">
                Performance of Movie Industry in a Year
              </h1>
              <select
                id="yearSelect"
                className="text-white bg-black border rounded px-2 py-1"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <LineChart width={1450} height={450} data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => {
                  const months = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ];
                  return months[month - 1];
                }}
              />
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
                labelFormatter={(label, payload) => {
                  if (!payload || !payload.length) return "";

                  const { year, month, day } = payload[0].payload;
                  const months = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ];

                  return `${months[month - 1]} ${day}, ${year}`;
                }}
                formatter={(value: number) => [`${value}M`, "Revenue"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenueThatDayInMillions"
                stroke="#f3ce13"
                strokeWidth={2}
              />
            </LineChart>
          </div>
        </>
      ) : (
        <p className="flex text-2xl font-bold justify-center text-[#f3ce13] mt-6 animate-pulse">
          Loading...
        </p>
      )}
    </div>
  );
}
