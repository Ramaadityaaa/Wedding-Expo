import React from 'react';

const SummaryCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className={`p-5 rounded-xl text-white flex flex-col justify-between ${colorClass} shadow-lg transform transition hover:scale-[1.05] min-h-40`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <Icon size={28} strokeWidth={2} className="opacity-90" />
    </div>
    <p className="mt-4 text-4xl font-extrabold">{value}</p>
  </div>
);

export default SummaryCard;
