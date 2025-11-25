import React from 'react';

const ActionButton = ({ icon: Icon, onClick, title, color }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-full ${color} text-white transition duration-200 shadow-md hover:opacity-80`}
  >
    <Icon size={18} />
  </button>
);

export default ActionButton;
