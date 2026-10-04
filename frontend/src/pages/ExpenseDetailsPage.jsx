import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getExpenseByIdApi, deleteExpenseApi } from '../api/expenseApi';
import { useNotifications } from '../context/NotificationContext';
import Card from '../components/common/Card';
import ConfirmModal from '../components/common/ConfirmModal';
import ErrorAlert from '../components/common/ErrorAlert';
import Toast from '../components/UI/Toast';
import { getCategoryConfig } from '../utils/categoryHelper';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  FileText,
  Clock,
} from 'lucide-react';

const ExpenseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getExpenseByIdApi(id);
        if (res.success) {
          setExpense(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Expense not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteExpenseApi(id);
      if (res.success) {
        addNotification({
          title: 'Expense Deleted',
          message: `₹${expense.amount} (${expense.category}) removed`,
          type: 'warning',
        });
        setToastMessage('Expense deleted successfully.');
        setTimeout(() => {
          navigate('/expenses');
        }, 600);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-slate-400 text-xs font-semibold">
        Fetching transaction summary...
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <ErrorAlert message={error || 'Expense not found.'} />
        <Link
          to="/expenses"
          className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-500 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transactions</span>
        </Link>
      </div>
    );
  }

  const catConfig = getCategoryConfig(expense.category);
  const CategoryIcon = catConfig.icon;

  const formattedDate = new Date(expense.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedCreated = new Date(expense.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/expenses"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Transaction Summary</h1>
            <p className="text-xs text-slate-500">Record ID: {expense._id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/expenses/edit/${expense._id}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Header Amount & Category Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amount Paid
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                ₹{expense.amount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-xl ${catConfig.iconBg}`}>
                <CategoryIcon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
              >
                {expense.category}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="p-2 rounded-lg bg-white text-slate-500 shadow-2xs">
                <CategoryIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Category</span>
                <span className="text-xs font-bold text-slate-900">{expense.category}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="p-2 rounded-lg bg-white text-slate-500 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Expense Date</span>
                <span className="text-xs font-bold text-slate-900">{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 sm:col-span-2">
              <div className="p-2 rounded-lg bg-white text-slate-500 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Description / Note</span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5 whitespace-pre-wrap">
                  {expense.note || 'No note attached.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="p-2 rounded-lg bg-white text-slate-500 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Created On</span>
                <span className="text-xs font-semibold text-slate-700">{formattedCreated}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete this expense?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExpenseDetailsPage;
