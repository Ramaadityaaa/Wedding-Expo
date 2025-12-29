import React, { useMemo, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Edit, Save, X, FileText, Loader2 } from "lucide-react";

export default function StaticContentManagement({ initialContent }) {
  const { auth } = usePage().props;

  // HANYA FOOTER YANG DITAMPILKAN
  const defaultFooterContent = useMemo(
    () => ({
      "Footer - Deskripsi":
        "Platform direktori wedding organizer terlengkap di Indonesia.",
      "Footer - Email": "info@weddingexpo.id",
      "Footer - Telepon": "+62 21 1234 5678",
      "Footer - Lokasi": "Jakarta, Indonesia",
    }),
    []
  );

  // Merge: default + DB (DB override)
  const merged = useMemo(() => {
    return { ...defaultFooterContent, ...(initialContent || {}) };
  }, [defaultFooterContent, initialContent]);

  // Allowlist: pastikan yang tampil cuma key footer di atas
  const allowedKeys = useMemo(
    () => [
      "Footer - Deskripsi",
      "Footer - Email",
      "Footer - Telepon",
      "Footer - Lokasi",
    ],
    []
  );

  const contentData = useMemo(() => {
    const filtered = {};
    allowedKeys.forEach((k) => {
      filtered[k] = merged[k] ?? defaultFooterContent[k] ?? "";
    });
    return filtered;
  }, [allowedKeys, merged, defaultFooterContent]);

  // State Lokal
  const [editingKey, setEditingKey] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = (key, value) => {
    setEditingKey(key);
    setEditorValue(value ?? "");
  };

  const handleSave = () => {
    if (!editingKey) return;

    setIsProcessing(true);

    router.post(
      route("admin.static-content.update"),
      {
        key: editingKey,
        value: editorValue,
      },
      {
        onSuccess: () => {
          setEditingKey(null);
          setIsProcessing(false);
        },
        onError: () => {
          alert("Gagal menyimpan konten.");
          setIsProcessing(false);
        },
        preserveScroll: true,
      }
    );
  };

  return (
    <AdminLayout user={auth?.user} header="Manajemen Konten Statis">
      <Head title="Konten Statis" />

      <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Manajemen Konten Footer
          </h1>
          <p className="text-gray-500">
            Edit konten footer yang tampil di halaman publik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(contentData).map(([key, value]) => (
            <div
              key={key}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-lg mr-4">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{key}</h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-600 text-sm leading-relaxed min-h-[100px] whitespace-pre-wrap">
                  {value && value.length > 220 ? value.substring(0, 220) + "..." : value}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => handleEdit(key, value)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Konten
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL EDITOR */}
        {editingKey && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Edit size={18} className="mr-2 text-indigo-600" />
                  Edit: {editingKey}
                </h3>
                <button
                  onClick={() => setEditingKey(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Isi Konten
                </label>
                <textarea
                  className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-gray-700 leading-relaxed"
                  value={editorValue}
                  onChange={(e) => setEditorValue(e.target.value)}
                  placeholder="Tulis konten di sini..."
                ></textarea>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingKey(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                  disabled={isProcessing}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition flex items-center"
                >
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
