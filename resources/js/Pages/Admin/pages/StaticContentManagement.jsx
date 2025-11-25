import React from 'react';
import { PRIMARY_COLOR, HOVER_COLOR, ACCENT_COLOR } from '../data/constants';
import { Edit } from 'lucide-react';

const StaticContentManagement = ({ staticContent = {}, setEditingContent, setEditorValue, editingContent }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Konten Statis</h1>
      <p className="text-gray-500 mb-8">Kelola konten halaman non-dinamis seperti 'Tentang Kami', 'Kontak Kami', dan 'FAQ'.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.keys(staticContent).map(key => (
          <div key={key} className="bg-white p-6 rounded-2xl shadow-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 flex flex-col justify-between">
            <div>
              <h2 className={`text-xl font-bold mb-2 ${ACCENT_COLOR}`}>{key}</h2>
              <p className="text-gray-600 text-sm italic h-16 overflow-hidden leading-relaxed">{staticContent[key].substring(0,150)}{staticContent[key].length > 150 ? '...' : ''}</p>
            </div>
            <button onClick={() => { setEditingContent(key); setEditorValue(staticContent[key]); }} className={`mt-4 py-2 px-4 rounded-full text-white text-sm font-medium ${PRIMARY_COLOR} ${HOVER_COLOR} flex items-center justify-center`}>
              <Edit size={16} className="mr-2"/> Edit Konten
            </button>
          </div>
        ))}
      </div>

      {editingContent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
          {/* Editor modal handled in Dashboard.jsx main for state actions */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl border-t-4 border-amber-500">
            <p>Editor muncul via state di Dashboard utama.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticContentManagement;
