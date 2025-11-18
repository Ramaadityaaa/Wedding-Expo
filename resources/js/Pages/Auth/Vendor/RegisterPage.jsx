import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react'; // <-- PENTING: Menggunakan hook Inertia

const customStyles = {
  bodyBg: 'bg-white',
};

// Nama komponen diubah agar sesuai nama file
const RegisterPage = () => {
  
  // Menggunakan useForm untuk koneksi otomatis ke backend Laravel
  const { data, setData, post, processing, errors, reset } = useForm({
    companyName: '',
    vendorType: '',
    city: '',
    permitNumber: '',
    fullName: '',
    email: '',
    phone: '',
    terms: false,
    permitImage: null,
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  
  const colors = {
    'primary-gold': '#A3844C',
    'secondary-orange': '#FFBB00',
    'dark-text': '#524330',
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handler change yang terhubung ke useForm
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(name, type === 'checkbox' ? checked : value);
  };

  // Handler file yang terhubung ke useForm
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData('permitImage', file);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  // Handler submit yang terhubung ke Inertia
  const handleRegistration = (e) => {
    e.preventDefault();
    // Mengirim data ke rute 'vendor.store' (POST /register/vendor)
    post(route('vendor.store'), {
      onSuccess: () => {
        setStatusModalOpen(true);
        resetForm();
      },
      onError: (errors) => {
        console.error("Registrasi gagal:", errors);
      },
      forceFormData: true, // Wajib untuk upload file
    });
  };

  // Fungsi reset
  const resetForm = () => {
    reset(); // Reset dari useForm
    setPreviewUrl('');
    const fileInput = document.getElementById('permitImage');
    if (fileInput) fileInput.value = '';
  };

  const closeStatusMessage = () => {
    setStatusModalOpen(false);
  };

  const isImage = data.permitImage && data.permitImage.type.startsWith('image/');
  const isPdf = data.permitImage && data.permitImage.type === 'application/pdf';

  return (
    <div className={`font-sans min-h-screen flex items-center justify-center p-4 ${customStyles.bodyBg}`}>
        <style jsx="true">{`
          @keyframes shine-anim { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .btn-gold-shine-base { background-image: linear-gradient(90deg, #A3844C 0%, #FFBB00 50%, #A3844C 100%); background-size: 200% 100%; transition: box-shadow 0.3s ease-in-out; box-shadow: 0 4px 15px rgba(163, 132, 76, 0.4); }
          .continuous-shine-hover:hover { animation: shine-anim 1.5s linear infinite; box-shadow: 0 6px 20px rgba(255, 187, 0, 0.6); }
        `}</style>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 md:p-12 border-t-8" style={{borderColor: colors['primary-gold']}}>
          
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 text-lg font-bold text-dark-text bg-opacity-10 rounded-full border" style={{backgroundColor: colors['secondary-orange'] + '1A', borderColor: colors['secondary-orange'], color: colors['dark-text']}}>
              Wedding<span style={{color: colors['primary-gold']}}>Expo</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-3" style={{color: colors['primary-gold']}}>
              Daftar Vendor Baru
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Bergabunglah dengan direktori Wedding Organizer terbaik.
            </p>
          </div>

          <form onSubmit={handleRegistration} className="space-y-8">
            
            {/* Informasi Vendor */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                Informasi Vendor
              </h2>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-dark-text mb-1">Nama Perusahaan / Studio WO <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="companyName" name="companyName" required
                  placeholder="Contoh: Bunga Mawar Wedding Organizer"
                  value={data.companyName} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label htmlFor="vendorType" className="block text-sm font-medium text-dark-text mb-1">Jenis Layanan Utama <span className="text-red-500">*</span></label>
                <select 
                  id="vendorType" name="vendorType" required
                  value={data.vendorType} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150 appearance-none bg-white"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                >
                  <option value="" disabled>Pilih salah satu...</option>
                  <option value="wo">Wedding Organizer (WO) & Planner</option>
                  <option value="decoration">Dekorasi & Pelaminan</option>
                  <option value="catering">Katering Pernikahan</option>
                  <option value="photography">Fotografi & Videografi</option>
                  <option value="mua">MUA & Busana Pengantin</option>
                </select>
                {errors.vendorType && <p className="text-red-500 text-xs mt-1">{errors.vendorType}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-dark-text mb-1">Kota/Provinsi Layanan <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="city" name="city" required
                  placeholder="Contoh: Jakarta, Bandung, Surabaya"
                  value={data.city} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Dokumen Legalitas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                Dokumen Legalitas
              </h2>
              <div>
                <label htmlFor="permitNumber" className="block text-sm font-medium text-dark-text mb-1">Nomor Izin Usaha (NIB/SIUP) <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="permitNumber" name="permitNumber" required
                  placeholder="Masukkan Nomor Izin Usaha Anda (cth: NIB 123456789)"
                  value={data.permitNumber} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.permitNumber && <p className="text-red-500 text-xs mt-1">{errors.permitNumber}</p>}
              </div>
              <div>
                <label htmlFor="permitImage" className="block text-sm font-medium text-dark-text mb-1">Upload Foto Surat Izin Usaha (SIUP/NIB) <span className="text-red-500">*</span></label>
                <input 
                  type="file" id="permitImage" name="permitImage" accept="image/png, image/jpeg, application/pdf" required
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:transition duration-150 pt-2"
                  style={{
                    '--tw-file-bg': colors['secondary-orange'] + '33',
                    '--tw-file-text': colors['primary-gold'],
                    '--tw-file-hover-bg': colors['secondary-orange'] + '4D',
                    backgroundColor: 'transparent'
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Maksimum ukuran file 5MB. Format: JPG, PNG, atau PDF.</p>
                {errors.permitImage && <p className="text-red-500 text-xs mt-1">{errors.permitImage}</p>}
                
                {data.permitImage && (
                  <div id="imagePreviewContainer" className="mt-4">
                    <p className="text-sm font-medium text-dark-text mb-2">Pratinjau Dokumen:</p>
                    {isImage && previewUrl && (
                      <img 
                        id="uploadedImagePreview" 
                        src={previewUrl} 
                        alt="Pratinjau Surat Izin Usaha" 
                        className="max-w-xs h-auto max-h-64 rounded-lg shadow-md border border-gray-200 mx-auto block object-contain"
                      />
                    )}
                    {isPdf && (
                      <p id="uploadedPdfPreview" className="text-sm text-gray-600 mt-2 text-center">
                        File PDF telah dipilih: <span id="pdfFileName" className="font-semibold">{data.permitImage.name}</span>
                      </p>
                    )}
                    {!isImage && !isPdf && data.permitImage && (
                         <p id="uploadedPdfPreview" className="text-sm text-gray-600 mt-2 text-center">
                            File dipilih: <span id="pdfFileName" className="font-semibold">{data.permitImage.name}</span>
                        </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Informasi Kontak */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                Informasi Kontak & Akun
              </h2>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-dark-text mb-1">Nama Kontak Person <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="fullName" name="fullName" required
                  placeholder="Nama lengkap PIC"
                  value={data.fullName} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" id="email" name="email" required
                  placeholder="Email aktif untuk notifikasi"
                  value={data.email} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark-text mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <input 
                  type="tel" id="phone" name="phone" required
                  placeholder="Contoh: 0812xxxxxx"
                  value={data.phone} // Menggunakan 'data' dari useForm
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            
            {/* Submit */}
            <div className="mt-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input 
                    id="terms" name="terms" type="checkbox" required
                    checked={data.terms} // Menggunakan 'data' dari useForm
                    onChange={handleChange}
                    className="focus:ring-secondary-orange h-4 w-4 border-gray-300 rounded"
                    style={{color: colors['primary-gold'], '--tw-ring-color': colors['secondary-orange']}}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">Saya setuju dengan <a href="#" className="hover:underline" style={{color: colors['primary-gold']}}>Syarat dan Ketentuan</a> vendor.</label>
                </div>
              </div>
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
            </div>

            {/* Tombol submit dengan status 'processing' */}
            <button type="submit" 
              className={`w-full mt-6 py-3 rounded-xl text-lg text-white btn-gold-shine-base continuous-shine-hover ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={processing}
            >
              {processing ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
            
          </form>

          {/* Modal Status */}
          {statusModalOpen && (
            <div id="statusMessage" className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                <h3 id="messageTitle" className="text-2xl font-bold mb-4" style={{color: colors['primary-gold']}}>Pendaftaran Berhasil!</h3>
                <p id="messageText" className="text-gray-600 mb-6">Terima kasih telah mendaftar. Kami akan segera memverifikasi data Anda dan mengirimkan email konfirmasi.</p>
                <button onClick={closeStatusMessage} className={`w-full py-2 rounded-lg text-sm text-white btn-gold-shine-base`}>Tutup</button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default RegisterPage; // Nama komponen diubah