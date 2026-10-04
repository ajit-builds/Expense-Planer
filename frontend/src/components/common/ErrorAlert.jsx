import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message = 'Unable to load expenses.', onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 my-4">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-900">Error</h4>
        <p className="text-sm text-red-700 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-red-800 hover:text-red-900 underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
