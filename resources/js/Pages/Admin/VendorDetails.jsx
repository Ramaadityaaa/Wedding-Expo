import { useForm } from '@inertiajs/react';

// Di dalam komponen React Anda
// Misal Anda punya data 'vendor' dari props
function VendorDetailsPage({ vendor }) {
  
  // Gunakan 'patch' karena route kita menggunakan Route::patch
  // 'processing' adalah state untuk loading
  const { patch, processing } = useForm({});

  const handleApproveClick = () => {
    // 'route' adalah helper dari Ziggy (disediakan Breeze)
    // Ini akan memanggil route 'admin.vendors.approve'
    patch(route('admin.vendors.approve', { vendor: vendor.id }), {
      preserveScroll: true, // Agar halaman tidak loncat ke atas
      onSuccess: () => {
        // Pesan sukses ('success') akan otomatis diterima
        // oleh komponen Layout Anda untuk ditampilkan.
        // Anda juga bisa tampilkan toast di sini.
      }
    });
  };

  return (
    <div>
      <h1>{vendor.name}</h1>
      {/* ... detail vendor ... */}
      
      <button 
        onClick={handleApproveClick} 
        disabled={processing} // Tombol disable saat loading
      >
        {processing ? 'Approving...' : 'Approve Vendor'}
      </button>
    </div>
  );
}