import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from "recharts";
import io from "socket.io-client";

const generateData = (amount = 100) => {
  const data = [];
  const startDate = new Date(2023, 0, 1); // Start from January 1, 2023

  for (let i = 0; i < amount; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const entry = {
      name: date.toISOString().slice(0, 10),
      uv: Math.floor(Math.random() * 1000),
      pv: Math.floor(Math.random() * 5000),
    };

    data.push(entry);
  }

  return data;
};
const socket = io("http://localhost:4000", {
  transports: ["webscoket", "polling"],
});
export default function RealTimeChart() {
  const [data, setData] = useState([]);
  const [zoomDomain, setZoomDomain] = useState(null);
  useEffect(() => {
    socket.on("cpu_usage", (cpuPercent) => {
      console.log(cpuPercent);
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const seconds = currentTime.getSeconds().toString().padStart(2, "0");
      const name = `${hours}:${minutes}:${seconds}`;
      setData((prevData) => [...prevData, { name, uv: cpuPercent }]);
    });
  }, []);
  const handleZoom = (domain) => {
    setZoomDomain(domain);
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" domain={zoomDomain?.name} />
          <YAxis domain={zoomDomain?.uv} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Brush
            dataKey="name"
            height={30}
            stroke="#8884d8"
            onChange={handleZoom}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
