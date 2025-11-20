import React, { useState, useEffect } from 'react';

// Mocking useForm untuk memungkinkan kompilasi di lingkungan terbatas.
const useForm = (initialData) => {
  const [data, setDataState] = useState(initialData);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const setData = (keyOrObject, value) => {
    if (typeof keyOrObject === 'object') {
      setDataState(prev => ({ ...prev, ...keyOrObject }));
    } else {
      setDataState(prev => ({ ...prev, [keyOrObject]: value }));
    }
  };

  const post = (url, options = {}) => {
    setProcessing(true);
    setErrors({});
    
    // --- LOKASI VALIDASI TAMBAHAN ---
    // Tambahkan simulasi validasi konfirmasi kata sandi di sini
    if (data.password !== data.password_confirmation) {
      setErrors({ password_confirmation: 'Konfirmasi kata sandi tidak cocok.' });
      setProcessing(false);
      return;
    }

    // Simulasi penundaan API dan logika dasar
    setTimeout(() => {
      if (data.company_name === 'error') {
        setErrors({ company_name: 'Nama perusahaan ini sudah terdaftar. (Simulasi Error)' });
        setProcessing(false);
        if (options.onError) options.onError(errors);
        return;
      }

      // Jika simulasi berhasil
      setProcessing(false);
      if (options.onSuccess) options.onSuccess();
    }, 1000);
  };

  const reset = () => {
    setDataState(initialData);
    setErrors({});
  };

  return {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
  };
};

// SVG Icon untuk Show/Hide Password
const EyeIcon = ({ onClick, isVisible }) => (
    <div 
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition"
        onClick={onClick}
    >
        {/* Ikon Lucide/Phosphor: Eye atau EyeOff */}
        {isVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.09 13.09 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
            </svg>
        )}
    </div>
);


const customStyles = {
  bodyBg: 'bg-white',
};

// Nama komponen tetap RegisterPage
const RegisterPage = () => {
  
  // State untuk mengontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // PENTING: Menambahkan 'password_confirmation' ke useForm
  const { data, setData, post, processing, errors, reset } = useForm({
    // --- INFORMASI VENDOR ---
    'company_name': '', 
    'vendor_type': '', 
    'city_province': '', 
    'address': '', 
    'nib': '', 
    'siup_nib_file': null, 

    // --- INFORMASI KONTAK & AKUN ---
    'name': '', 
    'email': '',
    'whatsapp': '', 
    'password': '', 
    'password_confirmation': '', // <--- FIELD BARU: Konfirmasi Kata Sandi
    
    'terms': false,
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
    setData('siup_nib_file', file);
    
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
    post('vendor.store', { // Menggunakan string placeholder
      onSuccess: () => {
        setStatusModalOpen(true);
        resetForm();
      },
      onError: (errors) => {
        console.error("Registrasi gagal:", errors);
      },
    });
  };

  // Fungsi reset
  const resetForm = () => {
    reset(); // Reset dari useForm
    setPreviewUrl('');
    const fileInput = document.getElementById('siup_nib_file'); // ID disesuaikan
    if (fileInput) fileInput.value = '';
  };

  const closeStatusMessage = () => {
    setStatusModalOpen(false);
  };

  const isImage = data.siup_nib_file && data.siup_nib_file.type.startsWith('image/');
  const isPdf = data.siup_nib_file && data.siup_nib_file.type === 'application/pdf';

  return (
    <div className={`font-sans min-h-screen flex items-center justify-center p-4 ${customStyles.bodyBg}`}>
        

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
                <label htmlFor="company_name" className="block text-sm font-medium text-dark-text mb-1">Nama Perusahaan / Studio WO <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="company_name" name="company_name" required
                  placeholder="Contoh: Bunga Mawar Wedding Organizer"
                  value={data.company_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
              </div>
              <div>
                <label htmlFor="vendor_type" className="block text-sm font-medium text-dark-text mb-1">Jenis Layanan Utama <span className="text-red-500">*</span></label>
                <select 
                  id="vendor_type" name="vendor_type" required
                  value={data.vendor_type}
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
                {errors.vendor_type && <p className="text-red-500 text-xs mt-1">{errors.vendor_type}</p>}
              </div>
              <div>
                <label htmlFor="city_province" className="block text-sm font-medium text-dark-text mb-1">Kota/Provinsi Layanan <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="city_province" name="city_province" required
                  placeholder="Contoh: Jakarta, Bandung, Surabaya"
                  value={data.city_province}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.city_province && <p className="text-red-500 text-xs mt-1">{errors.city_province}</p>}
              </div>
              
              {/* Field Alamat (address) */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-dark-text mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
                <textarea 
                  id="address" name="address" required
                  placeholder="Masukkan alamat lengkap kantor/studio Anda"
                  value={data.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  rows="3"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Dokumen Legalitas */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                Dokumen Legalitas
              </h2>
              <div>
                <label htmlFor="nib" className="block text-sm font-medium text-dark-text mb-1">Nomor Izin Usaha (NIB/SIUP) <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="nib" name="nib" required
                  placeholder="Masukkan Nomor Izin Usaha Anda (cth: NIB 123456789)"
                  value={data.nib}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.nib && <p className="text-red-500 text-xs mt-1">{errors.nib}</p>}
              </div>
              <div>
                <label htmlFor="siup_nib_file" className="block text-sm font-medium text-dark-text mb-1">Upload Foto Surat Izin Usaha (SIUP/NIB) <span className="text-red-500">*</span></label>
                <input 
                  type="file" id="siup_nib_file" name="siup_nib_file" accept="image/png, image/jpeg, application/pdf" required
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
                {errors.siup_nib_file && <p className="text-red-500 text-xs mt-1">{errors.siup_nib_file}</p>}
                
                {/* Pratinjau Dokumen */}
                {data.siup_nib_file && (
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
                        File PDF telah dipilih: <span id="pdfFileName" className="font-semibold">{data.siup_nib_file.name}</span>
                      </p>
                    )}
                    {!isImage && !isPdf && data.siup_nib_file && (
                         <p id="uploadedPdfPreview" className="text-sm text-gray-600 mt-2 text-center">
                            File dipilih: <span id="pdfFileName" className="font-semibold">{data.siup_nib_file.name}</span>
                        </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Informasi Kontak & Akun */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                Informasi Kontak & Akun
              </h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-1">Nama Kontak Person <span className="text-red-500">*</span></label>
                <input 
                  type="text" id="name" name="name" required
                  placeholder="Nama lengkap PIC"
                  value={data.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" id="email" name="email" required
                  placeholder="Email aktif untuk notifikasi"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Field Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-1">Kata Sandi Akun <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" name="password" required
                    placeholder="Minimal 8 karakter"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150 pr-10"
                    style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                  />
                  <EyeIcon onClick={() => setShowPassword(!showPassword)} isVisible={!showPassword} />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* FIELD BARU: Konfirmasi Password */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-dark-text mb-1">Konfirmasi Kata Sandi <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    id="password_confirmation" name="password_confirmation" required
                    placeholder="Ulangi Kata Sandi"
                    value={data.password_confirmation}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150 pr-10"
                    style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                  />
                  <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} isVisible={!showConfirmPassword} />
                </div>
                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-dark-text mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <input 
                  type="tel" id="whatsapp" name="whatsapp" required
                  placeholder="Contoh: 0812xxxxxx"
                  value={data.whatsapp}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                  style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                />
                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
              </div>
            </div>
            
            {/* Submit */}
            <div className="mt-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input 
                    id="terms" name="terms" type="checkbox" required
                    checked={data.terms}
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
              className={`w-full mt-6 py-3 rounded-xl text-lg text-white font-semibold transition duration-300 ease-in-out 
              ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:shadow-xl'}`}
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
                <button onClick={closeStatusMessage} className={`w-full py-2 rounded-lg text-sm text-white bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-500 hover:to-yellow-700 shadow-lg`}>Tutup</button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default RegisterPage;