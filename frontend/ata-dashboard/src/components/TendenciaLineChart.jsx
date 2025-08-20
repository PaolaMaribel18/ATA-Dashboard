import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Jan', value: 10 },
  { month: 'Feb', value: 25 },
  { month: 'Mar', value: 45 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 50 },
  { month: 'Jun', value: 30 },
  { month: 'Jul', value: 40 },
  { month: 'Aug', value: 55 },
  { month: 'Sep', value: 95 }, // pico
  { month: 'Oct', value: 70 },
  { month: 'Nov', value: 50 },
  { month: 'Dec', value: 60 },
];

const TendenciaLineChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Tendencia</h3>
        <select className="text-sm text-gray-600 border-none outline-none bg-transparent">
          <option>Enero</option>
          {/* otros meses si gustas */}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#4338ca', color: '#fff', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => `${value}%`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7, stroke: '#4338ca', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TendenciaLineChart;
