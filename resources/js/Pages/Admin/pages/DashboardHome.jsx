import React, { useMemo } from 'react';
import SummaryCard from '../components/SummaryCard';
import { Clock, MessageSquare, FileBadge, CheckCircle, Users, UserCheck, UserX } from 'lucide-react';
import { GRADIENT_CLASS } from '../data/constants';

const DashboardHome = ({ vendors = [], users = [], reviews = [] }) => {
  const pendingVendors = useMemo(() => vendors.filter(v => v.status === 'Pending').length, [vendors]);
  const approvedVendors = useMemo(() => vendors.filter(v => v.status === 'Approved').length, [vendors]);
  const pendingReviews = useMemo(() => reviews.filter(r => r.status === 'Pending').length, [reviews]);

  // 🔥 Data User Lengkap
  const totalUsers = useMemo(() => users.length, [users]);
  const activeUsers = useMemo(() => users.filter(u => u.status === 'Active').length, [users]);
  const suspendedUsers = useMemo(() => users.filter(u => u.status === 'Suspended').length, [users]);

  const activeVendorList = vendors.filter(v => v.status === 'Approved').slice(0, 5);
  const activeUserList = users.filter(u => u.status === 'Active').slice(0, 5);
  const pendingVendorList = vendors.filter(v => v.status === 'Pending').slice(0, 5);
  const pendingReviewList = reviews.filter(r => r.status === 'Pending').slice(0, 5);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-extrabold text-gray-800">Panel Kontrol Utama</h1>
      <p className="text-gray-500">Selamat datang kembali, Super Admin. Ini adalah ringkasan aktivitas platform Anda.</p>

      {/* ⭐ SECTION BARU – Statistik User */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard icon={Users} title="Total Pengguna" value={totalUsers} colorClass={GRADIENT_CLASS} />
        <SummaryCard icon={UserCheck} title="Pengguna Aktif" value={activeUsers} colorClass={GRADIENT_CLASS} />
        <SummaryCard icon={UserX} title="Pengguna Suspend" value={suspendedUsers} colorClass={GRADIENT_CLASS} />
        <SummaryCard icon={FileBadge} title="Vendor Disetujui" value={approvedVendors} colorClass={GRADIENT_CLASS} />
      </div>

      {/* ⭐ Statistik Vendor & Review (yang lama tetap ada) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard icon={Clock} title="Vendor Tertunda" value={pendingVendors} colorClass={GRADIENT_CLASS} />
        <SummaryCard icon={MessageSquare} title="Ulasan Menunggu" value={pendingReviews} colorClass={GRADIENT_CLASS} />
        <SummaryCard icon={FileBadge} title="Vendor Disetujui" value={approvedVendors} colorClass={GRADIENT_CLASS} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🔥 LIST Vendor & User Aktif */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <CheckCircle size={20} className="text-green-500 mr-2" />
            Pengguna & Vendor Aktif
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-amber-600 mb-2 border-b border-amber-100 pb-1">Vendor Aktif ({approvedVendors})</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {activeVendorList.length > 0 ? activeVendorList.map(v => (
                  <li key={v.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium truncate">{v.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{v.email}</span>
                  </li>
                )) : <li className="italic text-gray-500">Tidak ada vendor aktif.</li>}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-blue-600 mb-2 border-b border-blue-100 pb-1">Pengguna Terdaftar Aktif ({activeUsers})</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {activeUserList.length > 0 ? activeUserList.map(u => (
                  <li key={u.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium truncate">{	u.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{u.email}</span>
                  </li>
                )) : <li className="italic text-gray-500">Tidak ada pengguna aktif.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* 🔥 Aktivitas terbaru */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <MessageSquare size={20} className="text-amber-500 mr-2" />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            {pendingVendorList.map(v => (
              <div key={v.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="text-sm text-gray-800"><span className="font-bold text-red-600">Vendor Baru:</span> <strong>{v.name}</strong> menunggu persetujuan.</p>
                <p className="text-xs text-gray-500 mt-1">Email: {v.email}</p>
              </div>
            ))}
            {pendingReviewList.map(r => (
              <div key={r.id} className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <p className="text-sm text-gray-800"><span className="font-bold text-amber-600">Ulasan Baru:</span> Dari {r.userName} untuk <strong>{r.vendorName}</strong> menunggu moderasi.</p>
                <p className="text-xs text-gray-500 mt-1">Ulasan: "{r.content.substring(0, 40)}..."</p>
              </div>
            ))}

            {(pendingVendorList.length === 0 && pendingReviewList.length === 0) && (
              <p className="text-sm text-gray-500 italic p-4 text-center">Tidak ada aktivitas baru yang perlu dimoderasi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
