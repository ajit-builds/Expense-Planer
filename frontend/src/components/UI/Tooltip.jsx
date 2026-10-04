import React, { useState } from 'react';

const Tooltip = ({ text, children, position = 'right', enabled = true }) => {
  const [show, setShow] = useState(false);

  if (!enabled || !text) return children;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap z-50 animate-tooltip pointer-events-none border border-slate-800">
          {text}
          {/* Arrow indicator */}
          <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-900"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
