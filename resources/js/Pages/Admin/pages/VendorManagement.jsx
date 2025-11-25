import React from 'react';
import ActionButton from '../components/ActionButton';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { PRIMARY_COLOR, HOVER_COLOR } from '../data/constants';

const VendorManagement = ({ vendors = [], vendorView = 'Pending', setVendorView, handleVendorAction, pendingVendors = 0, approvedVendors = 0 }) => {
  const filteredVendors = vendors.filter(v => v.status === vendorView);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Vendor</h1>
      <p className="text-gray-500 mb-6">Kelola persetujuan dan status akun Vendor di platform.</p>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setVendorView('Pending')} className={`px-6 py-2 rounded-full font-semibold ${vendorView === 'Pending' ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}`}>Menunggu Persetujuan ({pendingVendors})</button>
        <button onClick={() => setVendorView('Approved')} className={`px-6 py-2 rounded-full font-semibold ${vendorView === 'Approved' ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}`}>Disetujui ({approvedVendors})</button>
        <button onClick={() => setVendorView('Rejected')} className={`px-6 py-2 rounded-full font-semibold ${vendorView === 'Rejected' ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}`}>Ditolak ({vendors.filter(v => v.status === 'Rejected').length})</button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No. Telepon</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredVendors.map(vendor => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'Approved' ? 'bg-green-100 text-green-800' : vendor.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{vendor.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    {vendor.status !== 'Approved' && <ActionButton icon={CheckCircle} title="Setujui" color="bg-green-500" onClick={() => handleVendorAction(vendor.id, 'Approved')} />}
                    {vendor.status !== 'Rejected' && <ActionButton icon={XCircle} title="Tolak" color="bg-yellow-500" onClick={() => handleVendorAction(vendor.id, 'Rejected')} />}
                    <ActionButton icon={Trash2} title="Hapus" color="bg-red-500" onClick={() => handleVendorAction(vendor.id, 'delete')} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVendors.length === 0 && <p className="text-center py-10 text-gray-500 italic">Tidak ada data vendor di kategori <strong>{vendorView}</strong>.</p>}
      </div>
    </div>
  );
};

export default VendorManagement;
