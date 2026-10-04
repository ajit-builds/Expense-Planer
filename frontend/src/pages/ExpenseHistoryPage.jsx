import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpensesApi, deleteExpenseApi } from '../api/expenseApi';
import { useNotifications } from '../context/NotificationContext';
import Card from '../components/common/Card';
import { TableRowSkeleton } from '../components/UI/Skeleton';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/UI/Toast';
import { getCategoryConfig } from '../utils/categoryHelper';
import {
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RotateCcw,
  Search,
  Calendar,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ExpenseHistoryPage = () => {
  const { addNotification } = useNotifications();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);

    const params = {};
    if (selectedCategory && selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    if (dateFrom) {
      params.from = dateFrom;
    }
    if (dateTo) {
      params.to = dateTo;
    }

    try {
      const res = await getExpensesApi(params);
      if (res.success) {
        setExpenses(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
    getExpensesApi({}).then((res) => {
      if (res.success) setExpenses(res.data);
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteExpenseApi(selectedForDelete._id);
      if (res.success) {
        setToastMessage('Expense deleted successfully.');
        addNotification({
          title: 'Expense Deleted',
          message: `₹${selectedForDelete.amount} (${selectedForDelete.category}) removed`,
          type: 'warning',
        });
        setSelectedForDelete(null);
        fetchExpenses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Local search filter
  const filteredExpenses = expenses.filter((exp) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (exp.note && exp.note.toLowerCase().includes(term)) ||
      (exp.category && exp.category.toLowerCase().includes(term)) ||
      exp.amount.toString().includes(term)
    );
  });

  const totalFilteredAmount = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  return (
    <div className="space-y-6">
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track, filter, and manage all your logged transactions.
          </p>
        </div>
        <Link
          to="/expenses/new"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </Link>
      </div>

      {/* Compact Toolbar Filters */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleApplyFilters} className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Search & Filter Toolbar</span>
            </div>
            {(selectedCategory !== 'All' || dateFrom || dateTo || searchTerm) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-indigo-600 hover:text-indigo-700 text-[11px] font-bold lowercase flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>reset filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300/80 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300/80 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300/80 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            {/* Search Note */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Search Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-300/80 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Transaction Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
        <div>
          Showing <span className="text-slate-900 font-extrabold">{filteredExpenses.length}</span> transaction(s)
        </div>
        <div className="text-slate-900">
          Filtered Sum: <span className="text-indigo-600 font-extrabold text-sm">₹{totalFilteredAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Main Expense Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchExpenses} />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState
          title="No expenses match your criteria."
          description="Try clearing date filters or searching for another keyword."
          actionText="Add New Expense"
          actionLink="/expenses/new"
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Transaction / Category</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5 text-right">Amount</th>
                  <th className="py-3.5 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredExpenses.map((expense) => {
                  const catConfig = getCategoryConfig(expense.category);
                  const IconComponent = catConfig.icon;

                  return (
                    <tr
                      key={expense._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${catConfig.iconBg}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {expense.note || expense.category}
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                              <span
                                className={`font-semibold px-2 py-0.5 rounded-md border text-[10px] ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
                              >
                                {expense.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-slate-600 font-medium whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>

                      <td className="py-3.5 px-5 text-right font-extrabold text-slate-900 text-sm whitespace-nowrap">
                        ₹{expense.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5 opacity-80 group-hover:opacity-100">
                          <Link
                            to={`/expenses/${expense._id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/expenses/edit/${expense._id}`}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setSelectedForDelete(expense)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="md:hidden space-y-3">
            {filteredExpenses.map((expense) => {
              const catConfig = getCategoryConfig(expense.category);
              const IconComponent = catConfig.icon;

              return (
                <div
                  key={expense._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${catConfig.iconBg}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDate(expense.date)}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div className="text-xs font-bold text-slate-900">
                      {expense.note || expense.category}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100 text-xs font-bold">
                    <Link
                      to={`/expenses/${expense._id}`}
                      className="text-slate-600 hover:text-indigo-600 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                    <Link
                      to={`/expenses/edit/${expense._id}`}
                      className="text-sky-600 hover:text-sky-700 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setSelectedForDelete(expense)}
                      className="text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!selectedForDelete}
        title="Delete this expense?"
        message={`Are you sure you want to delete "${selectedForDelete?.note || selectedForDelete?.category}" for ₹${selectedForDelete?.amount}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedForDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExpenseHistoryPage;
