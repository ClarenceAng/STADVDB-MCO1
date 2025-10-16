"use client";
import Header from "@/components/Header";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function Audience() {
  return <div className="flex min-h-screen flex-col max-w-md">
    <LineChart width={500} height={300} data={[1,2,3,3,4,2,3,4,5,4,5,6,7]}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
      <XAxis dataKey="name"/>
      <YAxis/>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
    </LineChart>
  </div>;
}
