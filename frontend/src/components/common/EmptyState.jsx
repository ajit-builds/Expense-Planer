import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No expenses found.',
  description = 'You haven\'t logged any expenses for this period yet.',
  actionText = 'Add Your First Expense',
  actionLink = '/expenses/new',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Wallet className="w-7 h-7 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
