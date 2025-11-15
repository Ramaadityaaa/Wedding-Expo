import React, { useState, useEffect } from 'react';
// Catatan: Asumsi Tailwind CSS sudah terpasang dan dikonfigurasi dalam proyek React Anda.

// Gaya CSS kustom yang diambil dari file HTML sebelumnya
const customStyles = {
    // Mengatur latar belakang halaman agar ada gradasi halus
    bodyBg: 'bg-white', // Disesuaikan untuk body React agar tidak mengganggu latar belakang Canvas
    
    // Properti btnGoldShine dihapus dari sini dan digantikan oleh CSS kustom di bawah
};

const App = () => {
    // 1. State untuk data formulir
    const [formData, setFormData] = useState({
        companyName: '',
        vendorType: '',
        city: '',
        permitNumber: '',
        fullName: '',
        email: '',
        phone: '',
        terms: false,
    });

    // 2. State untuk file dan pratinjau
    const [permitFile, setPermitFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // 3. State untuk modal/pesan status
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    
    // Warna kustom Tailwind (untuk referensi visual di JSX)
    const colors = {
        'primary-gold': '#A3844C',
        'secondary-orange': '#FFBB00',
        'dark-text': '#524330',
    };

    // Efek samping untuk membersihkan URL objek pratinjau ketika komponen dilepas atau file diubah
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    // Handler perubahan input teks
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handler perubahan input file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPermitFile(file);
        
        // Membersihkan URL pratinjau sebelumnya jika ada
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            // Membuat URL objek untuk pratinjau gambar
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl('');
        }
    };

    // Handler pengiriman formulir (simulasi kirim ke Laravel)
    const handleRegistration = async (e) => {
        e.preventDefault();

        // 1. Persiapan data untuk Laravel (Simulasi)
        const registrationData = new FormData();
        
        // Menambahkan data teks
        Object.keys(formData).forEach(key => {
            registrationData.append(key, formData[key]);
        });
        
        // Menambahkan file
        if (permitFile) {
            registrationData.append('permitImage', permitFile);
        }

        console.log("Simulasi data yang akan dikirim ke API Laravel:");
        for (let pair of registrationData.entries()) {
            console.log(pair[0] + ': ' + (typeof pair[1] === 'object' ? pair[1].name : pair[1]));
        }

        // --- Di sini adalah tempat Anda akan memanggil API Laravel ---
        // try {
        //     const response = await fetch('YOUR_LARAVEL_API_ENDPOINT', {
        //         method: 'POST',
        //         body: registrationData,
        //         // Pastikan Laravel memiliki CORS yang dikonfigurasi dengan benar
        //     // });
        //     const result = await response.json();
        //     if (response.ok) {
        //         setStatusModalOpen(true);
        //         // Reset form setelah sukses
        //         resetForm();
        //     } else {
        //         console.error("Registrasi gagal:", result);
        //         // Tampilkan pesan error kepada pengguna
        //     }
        // } catch (error) {
        //     console.error("Terjadi kesalahan jaringan:", error);
        //     // Tampilkan pesan error kepada pengguna
        // }

        // Simulasi sukses
        setStatusModalOpen(true);
        resetForm();
    };

    // Fungsi untuk mereset formulir
    const resetForm = () => {
        setFormData({
            companyName: '',
            vendorType: '',
            city: '',
            permitNumber: '',
            fullName: '',
            email: '',
            phone: '',
            terms: false,
        });
        setPermitFile(null);
        setPreviewUrl('');
        // Secara opsional, reset input file secara manual jika diperlukan (DOM-level)
        const fileInput = document.getElementById('permitImage');
        if (fileInput) fileInput.value = '';
    };

    // Fungsi untuk menutup modal
    const closeStatusMessage = () => {
        setStatusModalOpen(false);
    };

    // Logika untuk menentukan apakah file adalah gambar atau PDF
    const isImage = permitFile && permitFile.type.startsWith('image/');
    const isPdf = permitFile && permitFile.type === 'application/pdf';

    return (
        <div className={`font-sans min-h-screen flex items-center justify-center p-4 ${customStyles.bodyBg}`}>

            {/* Injeksi CSS untuk efek berkilau (Continuous Shine) pada tombol */}
            <style jsx="true">{`
                @keyframes shine-anim {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                /* Class dasar untuk gradien emas */
                .btn-gold-shine-base {
                    background-image: linear-gradient(90deg, #A3844C 0%, #FFBB00 50%, #A3844C 100%);
                    background-size: 200% 100%;
                    transition: box-shadow 0.3s ease-in-out; /* Transisi hanya untuk shadow */
                    box-shadow: 0 4px 15px rgba(163, 132, 76, 0.4);
                }

                /* Menambahkan animasi continuous shine saat di-hover */
                .continuous-shine-hover:hover {
                    animation: shine-anim 1.5s linear infinite;
                    box-shadow: 0 6px 20px rgba(255, 187, 0, 0.6); /* Shadow lebih kuat saat berkilau */
                }
            `}</style>

            {/* Card Registrasi Utama */}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 md:p-12 border-t-8" style={{borderColor: colors['primary-gold']}}>
                
                {/* Header / Logo Area */}
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

                {/* Formulir Registrasi */}
                <form onSubmit={handleRegistration} className="space-y-8">
                    
                    {/* Bagian Informasi Vendor */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                            Informasi Vendor
                        </h2>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-dark-text mb-1">Nama Perusahaan / Studio WO <span className="text-red-500">*</span></label>
                            <input 
                                type="text" id="companyName" name="companyName" required
                                placeholder="Contoh: Bunga Mawar Wedding Organizer"
                                value={formData.companyName} onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                                style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                            />
                        </div>

                        <div>
                            <label htmlFor="vendorType" className="block text-sm font-medium text-dark-text mb-1">Jenis Layanan Utama <span className="text-red-500">*</span></label>
                            <select 
                                id="vendorType" name="vendorType" required
                                value={formData.vendorType} onChange={handleChange}
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
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-dark-text mb-1">Kota/Provinsi Layanan <span className="text-red-500">*</span></label>
                            <input 
                                type="text" id="city" name="city" required
                                placeholder="Contoh: Jakarta, Bandung, Surabaya"
                                value={formData.city} onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                                style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                            />
                        </div>
                    </div>

                    {/* Bagian Dokumen Legalitas */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                            Dokumen Legalitas
                        </h2>

                        {/* Nomor Izin Usaha */}
                        <div>
                            <label htmlFor="permitNumber" className="block text-sm font-medium text-dark-text mb-1">Nomor Izin Usaha (NIB/SIUP) <span className="text-red-500">*</span></label>
                            <input 
                                type="text" id="permitNumber" name="permitNumber" required
                                placeholder="Masukkan Nomor Izin Usaha Anda (cth: NIB 123456789)"
                                value={formData.permitNumber} onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                                style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                            />
                        </div>

                        {/* Upload Surat Izin Usaha dengan Pratinjau Gambar */}
                        <div>
                            <label htmlFor="permitImage" className="block text-sm font-medium text-dark-text mb-1">Upload Foto Surat Izin Usaha (SIUP/NIB) <span className="text-red-500">*</span></label>
                            <input 
                                type="file" id="permitImage" name="permitImage" accept="image/png, image/jpeg, application/pdf" required
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-full file:border-0
                                       file:text-sm file:font-semibold
                                       file:transition duration-150
                                       pt-2"
                                style={{
                                    '--tw-file-bg': colors['secondary-orange'] + '33', // bg-secondary-orange/20
                                    '--tw-file-text': colors['primary-gold'], // text-primary-gold
                                    '--tw-file-hover-bg': colors['secondary-orange'] + '4D', // hover:file:bg-secondary-orange/30
                                    backgroundColor: 'transparent'
                                }}
                            />
                            <p className="mt-1 text-xs text-gray-500">Maksimum ukuran file 5MB. Format: JPG, PNG, atau PDF.</p>
                            
                            {/* Pratinjau Gambar/PDF */}
                            {permitFile && (
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
                                            File PDF telah dipilih: <span id="pdfFileName" className="font-semibold">{permitFile.name}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Bagian Informasi Kontak */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-dark-text border-b pb-2" style={{borderColor: colors['primary-gold'] + '4D'}}>
                            Informasi Kontak & Akun
                        </h2>

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-dark-text mb-1">Nama Kontak Person <span className="text-red-500">*</span></label>
                            <input 
                                type="text" id="fullName" name="fullName" required
                                placeholder="Nama lengkap PIC"
                                value={formData.fullName} onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                                style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">Email <span className="text-red-500">*</span></label>
                            <input 
                                type="email" id="email" name="email" required
                                placeholder="Email aktif untuk notifikasi"
                                value={formData.email} onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                                style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-dark-text mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                            <input 
                                type="tel" id="phone" name="phone" required
                                placeholder="Contoh: 0812xxxxxx"
                                value={formData.phone} onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary-orange focus:border-secondary-orange transition duration-150"
                                style={{'--tw-ring-color': colors['secondary-orange'], '--tw-border-color': colors['secondary-orange']}}
                            />
                        </div>
                    </div>
                    
                    {/* Persetujuan dan Tombol Submit */}
                    <div className="mt-8">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input 
                                    id="terms" name="terms" type="checkbox" required
                                    checked={formData.terms} onChange={handleChange}
                                    className="focus:ring-secondary-orange h-4 w-4 border-gray-300 rounded"
                                    style={{color: colors['primary-gold'], '--tw-ring-color': colors['secondary-orange']}}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">Saya setuju dengan <a href="#" className="hover:underline" style={{color: colors['primary-gold']}}>Syarat dan Ketentuan</a> vendor.</label>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Submit dengan Efek Emas Berkilau */}
                    <button type="submit" 
                        className={`w-full mt-6 py-3 rounded-xl text-lg text-white btn-gold-shine-base continuous-shine-hover`}
                    >
                        Daftar Sekarang
                    </button>
                    
                </form>

                {/* Pesan Status (Modal) */}
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

export default App;