import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getCategoryConfig } from '../../utils/categoryHelper';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const catConfig = getCategoryConfig(data.category);
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs font-semibold border border-slate-800">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: catConfig.hex }}
          ></span>
          <span className="text-slate-200">{data.category}</span>
        </div>
        <div className="text-indigo-400 font-bold text-sm mt-1">
          ₹{data.amount.toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data = [], totalAmount = 0 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
        <span>No spending data logged for this month</span>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    category: item.category,
    amount: item.amount,
  }));

  return (
    <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
      {/* Center Donut Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Total Spent
        </span>
        <span className="text-lg font-extrabold text-slate-900">
          ₹{totalAmount.toLocaleString('en-IN')}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={4}
            dataKey="amount"
          >
            {chartData.map((entry) => {
              const config = getCategoryConfig(entry.category);
              return <Cell key={`cell-${entry.category}`} fill={config.hex} />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-700 ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
