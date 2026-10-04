import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getExpensesApi, getExpenseSummaryApi, deleteExpenseApi } from '../api/expenseApi';
import StatCard from '../components/dashboard/StatCard';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import RecentExpensesList from '../components/dashboard/RecentExpensesList';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/UI/Skeleton';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/UI/Toast';
import { getCategoryConfig } from '../utils/categoryHelper';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Calendar,
  Hash,
  Award,
  Plus,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [summaryData, setSummaryData] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal & Toast state
  const [selectedExpenseForDelete, setSelectedExpenseForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, expensesRes] = await Promise.all([
        getExpenseSummaryApi(selectedMonth),
        getExpensesApi(),
      ]);

      if (summaryRes.success) {
        setSummaryData(summaryRes.data);
      }
      if (expensesRes.success) {
        setRecentExpenses(expensesRes.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth]);

  const handleDeleteConfirm = async () => {
    if (!selectedExpenseForDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteExpenseApi(selectedExpenseForDelete._id);
      if (res.success) {
        const deletedNote = selectedExpenseForDelete.note || selectedExpenseForDelete.category;
        setToastMessage(`Expense "${deletedNote}" deleted successfully.`);
        addNotification({
          title: 'Expense Deleted',
          message: `₹${selectedExpenseForDelete.amount} (${selectedExpenseForDelete.category}) removed`,
          type: 'warning',
        });
        setSelectedExpenseForDelete(null);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  const {
    totalSpending = 0,
    thisMonthSpending = 0,
    totalExpensesCount = 0,
    topCategory = { name: 'None', amount: 0 },
    categorySummary = [],
  } = summaryData || {};

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      {/* Hero Welcome & Month Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's your spending overview for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {/* Month Selector Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={fetchDashboardData}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            to="/expenses/new"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchDashboardData} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Spent"
            value={`₹${totalSpending.toLocaleString('en-IN')}`}
            subtitle="All-time accumulated spending"
            icon={Wallet}
            variant="primary"
          />
          <StatCard
            title="This Month"
            value={`₹${thisMonthSpending.toLocaleString('en-IN')}`}
            subtitle="Selected month spending"
            icon={Calendar}
            badge="Current"
          />
          <StatCard
            title="Transactions"
            value={totalExpensesCount}
            subtitle="Logged transactions count"
            icon={Hash}
          />
          <StatCard
            title="Top Category"
            value={topCategory.name}
            subtitle={`₹${(topCategory.amount || 0).toLocaleString('en-IN')} spent`}
            icon={Award}
          />
        </div>
      )}

      {/* Main Grid: Spending Donut & Progress Bars + Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart & Horizontal Progress Bars */}
        <Card
          title="Monthly Category Breakdown"
          subtitle="Spending distribution across categories"
          className="lg:col-span-1"
        >
          <CategoryPieChart
            data={categorySummary}
            totalAmount={thisMonthSpending}
          />

          {/* Category Progress Bars */}
          {categorySummary.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              {categorySummary.slice(0, 4).map((item) => {
                const config = getCategoryConfig(item.category);
                const percent =
                  thisMonthSpending > 0
                    ? Math.round((item.amount / thisMonthSpending) * 100)
                    : 0;

                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}{' '}
                        <span className="text-slate-400 font-normal">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: config.hex,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Expenses List */}
        <Card
          title="Recent Transactions"
          subtitle="Latest personal expenses recorded"
          action={
            <Link
              to="/expenses"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
          className="lg:col-span-2"
        >
          {recentExpenses.length === 0 ? (
            <EmptyState
              title="No expenses logged yet."
              description="Get started by logging your first expense to track your budget."
              actionText="Add Your First Expense"
              actionLink="/expenses/new"
            />
          ) : (
            <RecentExpensesList
              expenses={recentExpenses}
              onDeleteClick={(expense) => setSelectedExpenseForDelete(expense)}
            />
          )}
        </Card>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!selectedExpenseForDelete}
        title="Delete this expense?"
        message={`Are you sure you want to delete "${selectedExpenseForDelete?.note || selectedExpenseForDelete?.category}" for ₹${selectedExpenseForDelete?.amount}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedExpenseForDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;
