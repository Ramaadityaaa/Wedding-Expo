import React from 'react';
import ReviewCard from '../components/ReviewCard';
import { PRIMARY_COLOR } from '../data/constants';

const ReviewModeration = ({ reviews = [], reviewView = 'Pending', setReviewView, handleReviewAction }) => {
  const filtered = reviews.filter(r => r.status === reviewView);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Moderasi Ulasan</h1>
      <p className="text-gray-500 mb-6">Kelola ulasan vendor yang masuk dan tentukan mana yang akan dipublikasikan.</p>

      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {['Pending', 'Approved', 'Rejected'].map(status => {
          const count = reviews.filter(r => r.status === status).length;
          return (
            <button key={status} onClick={() => setReviewView(status)} className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold ${reviewView === status ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}`}>
              {status.replace('Pending','Menunggu').replace('Approved','Disetujui').replace('Rejected','Ditolak')} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? filtered.map(r => <ReviewCard key={r.id} review={r} onAction={handleReviewAction} />) : (
          <div className="md:col-span-3 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
            <p className="text-center text-gray-500 italic">Tidak ada ulasan dengan status <strong>{reviewView}</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModeration;
