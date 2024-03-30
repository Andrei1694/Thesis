import { useEffect, useState } from 'react';
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
} from 'recharts';


export default function RealTimeChart({data}) {
   
    const [zoomDomain, setZoomDomain] = useState(null);

    const handleZoom = (domain) => {
        setZoomDomain(domain);
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
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
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
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