import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createExpenseApi } from '../api/expenseApi';
import { useNotifications } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Toast from '../components/UI/Toast';
import { CATEGORIES_CONFIG } from '../utils/categoryHelper';
import { Calendar, FileText, ArrowLeft, Plus } from 'lucide-react';

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

const AddExpensePage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: today,
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

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
      setErrorMsg('Amount is required and must be greater than 0');
      return;
    }

    if (!formData.category) {
      setErrorMsg('Category is required');
      return;
    }

    if (!formData.date) {
      setErrorMsg('Date is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await createExpenseApi({
        amount: amountNum,
        category: formData.category,
        date: formData.date,
        note: formData.note,
      });

      if (res.success) {
        addNotification({
          title: 'Expense Added Successfully',
          message: `₹${amountNum} (${formData.category}) recorded`,
          type: 'success',
        });
        setToastMessage('Expense added successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      <div className="flex items-center space-x-3">
        <Link
          to="/dashboard"
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Record Expense</h1>
          <p className="text-xs text-slate-500">Log where your money went</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Prominent Amount Input Box */}
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

          {/* Category Selector Pills with Icons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Category <span className="text-rose-500">*</span>
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

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Transaction Date <span className="text-rose-500">*</span>
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

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Description / Note <span className="text-slate-400 font-normal">(Optional)</span>
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
                placeholder="Where did you spend this amount? (e.g. Cafe lunch with team)"
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-medium text-slate-900"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Add Expense'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpensePage;
