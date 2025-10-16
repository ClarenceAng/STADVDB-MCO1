"use client";
import Header from "@/components/Header";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function Audience() {
  return <div className="flex min-h-screen flex-col max-w-md">
    <LineChart width={500} height={300} data={[{name: 'a', value: [1, 2, 3, 4, 3, 4, 5, 2, 3, 6, 7, 5, 6, 9 ]}]}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
      <XAxis dataKey="name"/>
      <YAxis/>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
    </LineChart>
  </div>;
}
