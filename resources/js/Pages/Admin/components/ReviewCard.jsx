import React from 'react';
import { Users, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import ActionButton from './ActionButton';

const ReviewCard = ({ review, onAction }) => {
  const statusBg = review.status === 'Approved' ? 'bg-green-100 text-green-800' : review.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
  const borderColor = review.status === 'Approved' ? 'border-green-300' : review.status === 'Pending' ? 'border-amber-500' : 'border-red-300';

  return (
    <div className={`bg-white p-5 rounded-xl shadow-lg border-t-4 ${borderColor} flex flex-col justify-between transition duration-300 hover:shadow-xl`}>
      <div className="flex justify-between items-start mb-3 border-b pb-2">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">Vendor</p>
          <p className="text-lg font-bold text-gray-800 truncate" title={review.vendorName}>{review.vendorName}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBg}`}>{review.status}</span>
      </div>

      <p className="text-sm italic text-gray-700 mb-4 h-16 overflow-y-auto leading-relaxed">"{review.content}"</p>

      <div className="flex justify-between items-center pt-2 border-t">
        <p className="text-sm font-medium text-gray-500 flex items-center">
          <Users size={14} className="mr-1" />
          Oleh: {review.userName}
        </p>
        <div className="flex space-x-2">
          {review.status !== 'Approved' && (
            <ActionButton icon={CheckCircle} title="Setujui Ulasan" color="bg-green-500" onClick={() => onAction(review.id, 'Approved')} />
          )}
          {review.status !== 'Rejected' && review.status !== 'Pending' && (
            <ActionButton icon={XCircle} title="Tolak Ulasan" color="bg-yellow-500" onClick={() => onAction(review.id, 'Rejected')} />
          )}
          <ActionButton icon={Trash2} title="Hapus Permanen" color="bg-red-500" onClick={() => onAction(review.id, 'delete')} />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
