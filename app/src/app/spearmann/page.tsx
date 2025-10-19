"use client";
import { useState, useEffect } from "react";

export default function Spearmann() {
  const [spearmann, setSpearmann] = useState<number | null>(null);
  const [genre, setGenre] = useState<string>("Horror");
  useEffect(() => {
    const fetchSpearmannn = async () => {
      try {
        setSpearmann(null);
        const res = await fetch("/lib/api/spearmann", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ genre }),
        });
        const data = await res.json();
        setSpearmann(data[0].spearmann);
      } catch (e) {
        console.error("Error fetching Spearmann:", e);
      }
    };
    fetchSpearmannn();
  }, [genre]);
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {spearmann != null ? (
          <>
            <div className="flex flex-col justify-center items-center text-center py-10">
              <div className="flex justify-center text-center items-center gap-2">
                <h1 className="flex justify-center text-3xl font-bold mb-4">
                  Ratings vs Revenue in Different Genres
                </h1>
                <select
                  id="selectGenre"
                  className="text-white bg-black border rounded px-2 py-1"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Animation">Animation</option>
                  <option value="Biography">Biography</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Crime">Crime</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Family">Family</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="History">History</option>
                  <option value="Horror">Horror</option>
                  <option value="Music">Music</option>
                  <option value="Musical">Musical</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Short">Short</option>
                  <option value="Sport">Sport</option>
                  <option value="Thriller">Thriller</option>
                  <option value="War">War</option>
                  <option value="Western">Western</option>
                </select>
              </div>
              <div className="flex flex-col">
                <p>
                  The Spearmann Correlation between ratings and revenue for{" "}
                  {genre} is...
                </p>
                <div>{spearmann}</div>
              </div>
            </div>
          </>
        ) : (
          <p className="flex text-2xl font-bold justify-center mt-10">
            Loading...
          </p>
        )}
      </div>
    </>
  );
}
