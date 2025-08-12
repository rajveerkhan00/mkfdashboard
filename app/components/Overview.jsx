"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    visits: 400,
    sales: 240,
  },
  {
    name: "Feb",
    visits: 300,
    sales: 139,
  },
  {
    name: "Mar",
    visits: 200,
    sales: 980,
  },
  {
    name: "Apr",
    visits: 278,
    sales: 390,
  },
  {
    name: "May",
    visits: 189,
    sales: 480,
  },
  {
    name: "Jun",
    visits: 239,
    sales: 380,
  },
  {
    name: "Jul",
    visits: 349,
    sales: 430,
  },
]

export default function Overview() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 h-full">
        <ResponsiveContainer width="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip />
            <Bar dataKey="visits" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            <Bar dataKey="sales" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary/30" />
          </BarChart>
        </ResponsiveContainer>

    </div>
      )
}
