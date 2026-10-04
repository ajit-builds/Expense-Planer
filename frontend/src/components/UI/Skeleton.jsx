import React from 'react';

export const Skeleton = ({ className = '', style }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`}
      style={style}
    ></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3.5 w-24" />
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="py-3.5 px-4 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
