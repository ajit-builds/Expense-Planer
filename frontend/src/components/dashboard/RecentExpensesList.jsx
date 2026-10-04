import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { getCategoryConfig } from '../../utils/categoryHelper';

const formatDateRelative = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
};

const RecentExpensesList = ({ expenses = [], onDeleteClick }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="py-10 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
        No recent expenses logged.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {expenses.map((expense) => {
        const catConfig = getCategoryConfig(expense.category);
        const IconComponent = catConfig.icon;

        return (
          <div
            key={expense._id}
            className="py-3 px-3 flex items-center justify-between hover:bg-slate-50/80 rounded-xl transition-all group"
          >
            {/* Category Icon & Details */}
            <div className="flex items-center space-x-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${catConfig.iconBg}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {expense.note || expense.category}
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="font-medium">{expense.category}</span>
                  <span>•</span>
                  <span>{formatDateRelative(expense.date)}</span>
                </div>
              </div>
            </div>

            {/* Amount & Actions */}
            <div className="flex items-center space-x-4">
              <div className="text-sm font-extrabold text-slate-900">
                ₹{expense.amount.toLocaleString('en-IN')}
              </div>

              <div className="flex items-center space-x-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/expenses/${expense._id}`}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/expenses/edit/${expense._id}`}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  title="Edit expense"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onDeleteClick(expense)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentExpensesList;
