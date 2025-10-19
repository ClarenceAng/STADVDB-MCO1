"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { DirectorType } from "../lib/types/types";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export default function Directors() {
  const [directors, setDirectors] = useState<DirectorType[]>();

  useEffect(() => {
    try {
      const fetchDirectors = async () => {
        const res = await fetch("/lib/api/directors");
        const data = await res.json();

        console.log("Data: ", data);

        const parsedDirectors: DirectorType[] = data.map((d: DirectorType) => ({
          primaryName: d.primaryName,
          minPerMovieRevInMil: Number(d.minPerMovieRevenueInMillions),
          maxPerMovieRevInMil: Number(d.maxPerMovieRevenueInMillions),
          avgPerMovieInMil: Number(d.avgPerMovieRevenueInMillions),
          totalMovies: Number(d.totalMovies),
        }));

        setDirectors(parsedDirectors);
        console.log("Directors:", parsedDirectors);
      };

      fetchDirectors();
      //   console.log("Directors:", directors);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {directors ? (
        <div className="flex flex-col justify-center items-center text-center py-10">
          <h1 className="flex justify-center text-3xl font-bold mb-4">
            Top Directors in Terms of their Revenues
          </h1>
          <div className="relative w-full max-w-[1250px] h-[600px] overflow-y-auto border border-gray-300 rounded-lg shadow">
            <BarChart
              width={1250}
              height={directors ? directors.length * 60 : 1500}
              data={directors}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 15]} />
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
                formatter={(value, name, props) => {
                  const { payload } = props;
                  return [
                    `${value}M`,
                    name === "minPerMovieRevInMil"
                      ? "Min Rev"
                      : name === "avgPerMovieInMil"
                      ? "Avg Rev"
                      : name === "maxPerMovieRevInMil"
                      ? "Max Rev"
                      : name,
                  ];
                }}
                labelFormatter={(label, payload) => {
                  const extra = payload?.[0]?.payload;
                  return `${label} (${extra.totalMovies} movies)`; // <- additional info
                }}
              />
              <Legend />
              <Bar dataKey="minPerMovieRevInMil" fill="#FF0000" />
              <Bar dataKey="avgPerMovieInMil" fill="#FFA500" />
              <Bar dataKey="maxPerMovieRevInMil" fill="#FFFF00" />
            </BarChart>
          </div>
        </div>
      ) : (
        <p className="flex text-2xl font-bold justify-center">Loading...</p>
      )}
    </div>
  );
}
