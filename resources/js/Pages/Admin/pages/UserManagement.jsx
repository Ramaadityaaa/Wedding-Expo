import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Trash2, Users } from 'lucide-react';

// --- Global Constants ---
const PRIMARY_COLOR = 'bg-amber-600 hover:bg-amber-700';

// --- Component ActionButton ---
// Komponen tombol kecil yang reusable untuk aksi di tabel
const ActionButton = ({ icon: Icon, title, color, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-2 rounded-full text-white transition duration-200 ease-in-out shadow-md ${color} hover:opacity-90 active:scale-95`}
  >
    <Icon size={16} />
  </button>
);

// --- Dummy Data ---
const initialUsers = [
  { id: 1, name: "Budi Santoso", email: "budi.s@mail.com", phone: "081234567890", status: "Active" },
  { id: 2, name: "Siti Rahayu", email: "siti.r@mail.com", phone: "081987654321", status: "Active" },
  { id: 3, name: "Joko Pranata", email: "joko.p@mail.com", phone: "085566778899", status: "Suspended" },
  { id: 4, name: "Dewi Lestari", email: "dewi.l@mail.com", phone: "087788990011", status: "Active" },
  { id: 5, name: "Ahmad Fauzi", email: "ahmad.f@mail.com", phone: "082345678901", status: "Suspended" },
];

// --- UserManagement Component (as provided, integrated here) ---
const UserManagement = ({ users, userView, setUserView, handleUserAction }) => {
  const filteredUsers = users.filter(u => u.status === userView);
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const suspendedUsersCount = users.filter(u => u.status === 'Suspended').length;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
          <Users size={32} className="mr-3 text-amber-600" />
          Manajemen Pengguna
        </h1>
        <p className="text-gray-500 mb-8">Kelola status dan akun pengguna yang terdaftar di platform Anda.</p>

        {/* Tab Navigation */}
        <div className="flex space-x-3 mb-8">
          <button 
            onClick={() => setUserView('Active')} 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              userView === 'Active' ? `${PRIMARY_COLOR} text-white shadow-lg shadow-amber-300/50` : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            Aktif ({activeUsersCount})
          </button>
          <button 
            onClick={() => setUserView('Suspended')} 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              userView === 'Suspended' ? `${PRIMARY_COLOR} text-white shadow-lg shadow-amber-300/50` : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            Ditangguhkan ({suspendedUsersCount})
          </button>
        </div>

        {/* User Table */}
        <div className="overflow-hidden shadow-xl ring-1 ring-black ring-opacity-5 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Pengguna</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">No. Telepon</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-4 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800 ring-1 ring-green-300' 
                          : 'bg-red-100 text-red-800 ring-1 ring-red-300'
                      }`}>
                        {user.status === 'Active' ? 'Aktif' : 'Ditangguhkan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        {/* Activate Button */}
                        {user.status !== 'Active' && (
                          <ActionButton 
                            icon={CheckCircle} 
                            title="Aktifkan" 
                            color="bg-green-600 hover:bg-green-700" 
                            onClick={() => handleUserAction(user.id, 'Active')} 
                          />
                        )}
                        {/* Suspend Button */}
                        {user.status !== 'Suspended' && (
                          <ActionButton 
                            icon={XCircle} 
                            title="Tangguhkan" 
                            color="bg-yellow-600 hover:bg-yellow-700" 
                            onClick={() => handleUserAction(user.id, 'Suspended')} 
                          />
                        )}
                        {/* Delete Button */}
                        <ActionButton 
                          icon={Trash2} 
                          title="Hapus Permanen" 
                          color="bg-red-600 hover:bg-red-700" 
                          onClick={() => handleUserAction(user.id, 'delete')} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <p className="text-center py-12 text-lg text-gray-500 italic bg-white">
              Tidak ada data pengguna di kategori 
              <strong className='text-amber-600 ml-1'>{userView === 'Active' ? 'Aktif' : 'Ditangguhkan'}</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Application Component (App) ---
const App = () => {
  const [users, setUsers] = useState(initialUsers);
  const [userView, setUserView] = useState('Active'); // State for current view

  // Handler for user actions (Activate, Suspend, Delete)
  const handleUserAction = useCallback((id, action) => {
    setUsers(prevUsers => {
      if (action === 'delete') {
        // Hapus pengguna
        return prevUsers.filter(user => user.id !== id);
      } else {
        // Aktifkan atau Tangguhkan
        return prevUsers.map(user => 
          user.id === id ? { ...user, status: action } : user
        );
      }
    });
  }, []);

  return (
    <div className="font-sans antialiased">
      <UserManagement 
        users={users} 
        userView={userView} 
        setUserView={setUserView} 
        handleUserAction={handleUserAction} 
      />
    </div>
  );
};

export default App;