import React from "react";

const SummaryCard = ({ title, count, icon, color }) => {
  return (
    <div className={`p-5 rounded-xl shadow-lg border border-gray-100 bg-white flex items-center justify-between transition-all duration-300 hover:shadow-xl`}>
      <div>
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <h2 className={`text-3xl font-bold mt-1 ${color}`}>{count ?? 0}</h2> 
      </div>
      <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('-600', '-100')}`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
      </div>
    </div>
  );
};

export default SummaryCard;
