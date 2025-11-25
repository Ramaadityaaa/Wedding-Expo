import React from 'react';
import ActionButton from '../components/ActionButton';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { PRIMARY_COLOR } from '../data/constants';

const UserManagement = ({ users = [], userView = 'Active', setUserView, handleUserAction }) => {
  const filteredUsers = users.filter(u => u.status === userView);
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const suspendedUsersCount = users.filter(u => u.status === 'Suspended').length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Pengguna</h1>
      <p className="text-gray-500 mb-6">Kelola status dan akun pengguna yang terdaftar di platform.</p>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setUserView('Active')} className={`px-6 py-2 rounded-full font-semibold ${userView === 'Active' ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}`}>Aktif ({activeUsersCount})</button>
        <button onClick={() => setUserView('Suspended')} className={`px-6 py-2 rounded-full font-semibold ${userView === 'Suspended' ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}`}>Ditangguhkan ({suspendedUsersCount})</button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Pengguna</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No. Telepon</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    {user.status !== 'Active' && <ActionButton icon={CheckCircle} title="Aktifkan" color="bg-green-500" onClick={() => handleUserAction(user.id, 'Active')} />}
                    {user.status !== 'Suspended' && <ActionButton icon={XCircle} title="Tangguhkan" color="bg-yellow-500" onClick={() => handleUserAction(user.id, 'Suspended')} />}
                    <ActionButton icon={Trash2} title="Hapus" color="bg-red-500" onClick={() => handleUserAction(user.id, 'delete')} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="text-center py-10 text-gray-500 italic">Tidak ada data pengguna di kategori <strong>{userView}</strong>.</p>}
      </div>
    </div>
  );
};

export default UserManagement;
