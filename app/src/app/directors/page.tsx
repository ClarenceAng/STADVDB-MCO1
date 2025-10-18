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
        <div className="py-10">
          <h1 className="flex justify-center text-3xl font-bold mb-4">
            Top 10 Directors in Terms of their Revenues
          </h1>
          <BarChart width={1450} height={600} data={directors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="primaryName" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props;
                return [
                  value,
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
      ) : (
        <p className="flex text-2xl font-bold justify-center">Loading...</p>
      )}
    </div>
  );
}
