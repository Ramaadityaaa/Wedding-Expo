import React from 'react';
import { PRIMARY_COLOR } from '../data/constants';

const RoleEditor = ({ vendors = [], roleEdits = {}, setRoleEdits, handleSaveRoles }) => {
  const vendorsForTable = vendors.filter(v => v.status === 'Approved');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Edit Role Vendor / Membership</h1>
      <p className="text-gray-500 mb-6">Menampilkan vendor yang sudah <strong>Approved</strong>. Pilih role untuk masing-masing vendor.</p>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border border-amber-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">No. Telepon</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Pilih Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {vendorsForTable.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{v.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{v.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{v.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="inline-flex items-center space-x-2 bg-amber-50 p-1 rounded-full">
                    <button onClick={() => setRoleEdits(prev => ({ ...prev, [v.id]: 'Vendor' }))} className={`px-4 py-1 rounded-full text-sm font-semibold ${ (roleEdits[v.id] || v.role) === 'Vendor' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg' : 'bg-white text-amber-600 border border-amber-100'}`}>Vendor</button>
                    <button onClick={() => setRoleEdits(prev => ({ ...prev, [v.id]: 'Membership' }))} className={`px-4 py-1 rounded-full text-sm font-semibold ${ (roleEdits[v.id] || v.role) === 'Membership' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg' : 'bg-white text-amber-600 border border-amber-100'}`}>Membership</button>
                  </div>
                </td>
              </tr>
            ))}
            {vendorsForTable.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-500 italic">Belum ada vendor yang disetujui.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">Perubahan akan diterapkan ke vendor yang dipilih setelah klik Simpan.</div>
        <div className="flex space-x-3">
          <button onClick={() => setRoleEdits({})} className="py-2 px-4 rounded-full border border-amber-200 text-amber-700">Reset</button>
          <button onClick={handleSaveRoles} className="py-2 px-4 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400">Simpan Role</button>
        </div>
      </div>
    </div>
  );
};

export default RoleEditor;
