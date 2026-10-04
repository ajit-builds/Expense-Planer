import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getExpenseByIdApi, updateExpenseApi } from '../api/expenseApi';
import { useNotifications } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Toast from '../components/UI/Toast';
import { CATEGORIES_CONFIG } from '../utils/categoryHelper';
import { Calendar, FileText, ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

const EditExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: '',
    note: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await getExpenseByIdApi(id);
        if (res.success && res.data) {
          const expense = res.data;
          const formattedDate = new Date(expense.date).toISOString().split('T')[0];
          setFormData({
            amount: expense.amount,
            category: expense.category,
            date: formattedDate,
            note: expense.note || '',
          });
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Expense not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (cat) => {
    setFormData((prev) => ({ ...prev, category: cat }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Amount must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await updateExpenseApi(id, {
        amount: amountNum,
        category: formData.category,
        date: formData.date,
        note: formData.note,
      });

      if (res.success) {
        addNotification({
          title: 'Expense Updated',
          message: `₹${amountNum} (${formData.category}) updated`,
          type: 'info',
        });
        setToastMessage('Expense updated successfully!');
        setTimeout(() => {
          navigate('/expenses');
        }, 600);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-slate-400 text-xs font-semibold">
        Loading transaction details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      <div className="flex items-center space-x-3">
        <Link
          to="/expenses"
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit Expense</h1>
          <p className="text-xs text-slate-500">Update transaction record</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Amount Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Amount Spent <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl bg-slate-50/80 border border-slate-200 p-4 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-extrabold text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full text-3xl font-extrabold text-slate-900 bg-transparent border-none focus:outline-none placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATEGORIES.map((cat) => {
                const config = CATEGORIES_CONFIG[cat];
                const IconComponent = config.icon;
                const isSelected = formData.category === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : config.iconBg
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                required
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Description / Note
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <FileText className="h-4 w-4" />
              </div>
              <textarea
                name="note"
                rows="3"
                value={formData.note}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-medium text-slate-900"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Link
              to="/expenses"
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditExpensePage;
