import React, { useState, useEffect } from 'react';
import { getExpenseSummaryApi } from '../api/expenseApi';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/UI/Skeleton';
import ErrorAlert from '../components/common/ErrorAlert';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import { getCategoryConfig } from '../utils/categoryHelper';
import { Calendar, TrendingUp, Award, Layers, Calculator } from 'lucide-react';

const MonthlySummaryPage = () => {
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async (month) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExpenseSummaryApi(month);
      if (res.success) {
        setSummaryData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load monthly summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedMonth);
  }, [selectedMonth]);

  const {
    thisMonthSpending = 0,
    categorySummary = [],
    topCategory = { name: 'None', amount: 0 },
  } = summaryData || {};

  // Calculate Average Daily Spending
  const [yearStr, monthStr] = selectedMonth.split('-');
  const daysInMonth = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
  const avgDailySpending = Math.round(thisMonthSpending / (daysInMonth || 30));

  return (
    <div className="space-y-6">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Spending Summary</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aggregated category spending for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-600 uppercase">Month:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Financial Metrics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={() => fetchSummary(selectedMonth)} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-slate-800 text-indigo-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Spending
                </span>
                <div className="text-2xl font-extrabold text-white mt-0.5">
                  ₹{thisMonthSpending.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Avg. Daily Spending
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  ₹{avgDailySpending.toLocaleString('en-IN')}
                  <span className="text-xs text-slate-400 font-normal"> /day</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Highest Category
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {topCategory.name}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart Visual */}
            <Card
              title="Category Distribution"
              subtitle={`Visual spending proportions for ${selectedMonth}`}
            >
              <CategoryPieChart
                data={categorySummary}
                totalAmount={thisMonthSpending}
              />
            </Card>

            {/* Category Breakdown Table with Percentage */}
            <Card
              title="Category Analysis"
              subtitle="Breakdown of expenses with spending percentage"
            >
              {categorySummary.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  No spending recorded for this month.
                </div>
              ) : (
                <div className="space-y-4">
                  {categorySummary.map((item) => {
                    const catConfig = getCategoryConfig(item.category);
                    const CategoryIcon = catConfig.icon;

                    const percentage =
                      thisMonthSpending > 0
                        ? ((item.amount / thisMonthSpending) * 100).toFixed(1)
                        : 0;

                    return (
                      <div key={item.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-1.5 rounded-lg ${catConfig.iconBg}`}>
                              <CategoryIcon className="w-4 h-4" />
                            </div>
                            <span className="text-slate-900">{item.category}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({item.count} items)</span>
                          </div>
                          <div className="text-slate-900">
                            ₹{item.amount.toLocaleString('en-IN')}{' '}
                            <span className="text-indigo-600 font-extrabold ml-1">({percentage}%)</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: catConfig.hex,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlySummaryPage;
