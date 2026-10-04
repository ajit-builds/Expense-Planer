import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading expenses...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 min-h-[250px]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
