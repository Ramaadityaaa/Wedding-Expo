import React, { useState, useEffect, useCallback } from 'react';
import { Archive, Package, Image, UserCog, MessageSquareText, LogOut, Crown, Save, Loader2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, setLogLevel } from 'firebase/firestore';

// Atur logging Firebase ke debug untuk memantau koneksi
setLogLevel('Debug');

// --- FIREBASE GLOBAL VARIABLES (MANDATORY) ---
// Pastikan variabel global digunakan sesuai aturan
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Data statis sebagai struktur awal/fallback
const DEFAULT_INITIAL_DATA = { 
    profile: { 
        vendorName: 'Vendor Baru (Default)', 
        description: 'Masukkan deskripsi profesional Anda di sini.',
        category: 'Fotografi' 
    },
    portfolio: [],
    packages: [],
    reviews: []
};

// --- KOMPONEN ALERT ---
const Alert = ({ type, message }) => {
    if (!message) return null;
    const baseClasses = "p-4 rounded-xl shadow-lg flex items-center transition-all duration-300";
    let typeClasses = '';

    switch (type) {
        case 'success':
            typeClasses = 'bg-green-100 text-green-800 border border-green-200';
            break;
        case 'error':
            typeClasses = 'bg-red-100 text-red-800 border border-red-200';
            break;
        case 'warning':
        default:
            typeClasses = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            break;
    }

    return (
        <div className={`${baseClasses} ${typeClasses}`} role="alert">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
};

// --- KOMPONEN HALAMAN: PROFILE PAGE (DINAMIS & TEROLEH FIREBASE) ---
const ProfilePage = ({ vendorData, db, userId, alertUser, appId }) => {
    // State lokal untuk formulir, diinisialisasi dari data vendor
    const [formData, setFormData] = useState(vendorData.profile);
    const [isSaving, setIsSaving] = useState(false);
    
    // Perbarui state lokal ketika data vendor dari Firestore berubah (real-time update)
    // Ini memastikan form selalu menampilkan nilai terbaru dari database
    useEffect(() => {
        setFormData(vendorData.profile);
    }, [vendorData.profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            alertUser('error', 'Sistem belum siap. Otentikasi atau koneksi Firebase hilang.');
            return;
        }

        setIsSaving(true);
        // Lokasi dokumen PRIVATE: /artifacts/{appId}/users/{userId}/vendor_data/profile
        // Semua data (profile, packages, portfolio) disimpan dalam satu dokumen 'profile'
        const docRef = doc(db, 'artifacts', appId, 'users', userId, 'vendor_data', 'profile');
        
        try {
            // setDoc dengan merge: true akan membuat dokumen jika belum ada, 
            // atau hanya memperbarui field 'profile' jika sudah ada (preserving packages/portfolio arrays).
            await setDoc(docRef, { profile: formData }, { merge: true });
            alertUser('success', 'Profil vendor berhasil disimpan. Perubahan terlihat di sidebar.');
        } catch (error) {
            console.error("Error saving document: ", error);
            alertUser('error', `Gagal menyimpan profil: Pastikan koneksi dan aturan keamanan Firebase sudah benar.`);
        } finally {
            setIsSaving(false);
        }
    };

    const categories = ['Fotografi', 'Videografi', 'Catering', 'Dekorasi', 'Gedung Pernikahan', 'EO'];

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-6 border-b pb-2">Edit Profil Vendor</h2>
            
            <form onSubmit={handleProfileSave} className="space-y-6">
                
                {/* Field Nama Vendor */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <label htmlFor="vendorName" className="font-semibold text-gray-700 pt-2">Nama Vendor</label>
                    <div className="md:col-span-2">
                        <input
                            id="vendorName"
                            name="vendorName"
                            type="text"
                            value={formData.vendorName || ''}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200/50 transition"
                        />
                    </div>
                </div>

                {/* Field Kategori */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <label htmlFor="category" className="font-semibold text-gray-700 pt-2">Kategori Layanan</label>
                    <div className="md:col-span-2">
                           <select
                            id="category"
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200/50 transition bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Field Deskripsi */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <label htmlFor="description" className="font-semibold text-gray-700 pt-2">Deskripsi Vendor</label>
                    <div className="md:col-span-2">
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200/50 transition"
                        ></textarea>
                        <p className="text-sm text-gray-500 mt-1">Jelaskan layanan Anda secara profesional (maks. 500 kata).</p>
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-end pt-4 border-t mt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center px-6 py-3 bg-amber-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-amber-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 mr-3" />
                        )}
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
                    </button>
                </div>
            </form>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mt-8 rounded-lg">
                <p className="font-bold">Info Data Real-Time:</p>
                <p className="text-sm">Data di atas disimpan ke Firestore pada path `artifacts/{appId}/users/{userId}/vendor_data/profile`. Nilai di sidebar akan otomatis disinkronkan berkat `onSnapshot`.</p>
            </div>
        </div>
    );
};

// --- KOMPONEN HALAMAN: PLACEHOLDER UNTUK PAKET ---
const PackagePagePlaceholder = ({ vendorData, alertUser }) => {
    const packages = vendorData.packages || [];

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-[50vh]">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-6 border-b pb-2">Paket Harga Layanan ({packages.length} Paket)</h2>
            
            <div className="flex justify-end mb-6">
                   <button
                    onClick={() => alertUser('warning', 'Fitur tambah paket akan diaktifkan di langkah selanjutnya. Kita akan menggunakan array `packages` dalam dokumen Firestore yang sama.')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    + Tambah Paket Baru
                </button>
            </div>

            {packages.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 border border-dashed rounded-xl text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">Belum ada paket harga yang ditambahkan.</p>
                    <p className="text-sm mt-1">Langkah selanjutnya adalah membuat halaman ini dinamis, mengelola array `packages` dalam dokumen Firestore.</p>
                </div>
            ) : (
                   <p>Daftar paket akan muncul di sini.</p>
            )}
            
        </div>
    );
};

// --- KOMPONEN HALAMAN: PLACEHOLDER UNTUK PORTOFOLIO ---
const PortfolioPagePlaceholder = () => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-[50vh]">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-6 border-b pb-2">Portofolio (Galeri Foto)</h2>
        
        <div className="text-center p-12 bg-gray-50 border border-dashed rounded-xl text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Pengelolaan portofolio (kumpulan URL gambar) akan diimplementasikan di sini.</p>
            <p className="text-sm mt-1">Kita akan menggunakan field array `portfolio` dalam dokumen yang sama (`/vendor_data/profile`) untuk menyimpan data ini.</p>
        </div>
    </div>
);

// --- KOMPONEN HALAMAN: PLACEHOLDER UNTUK REVIEW ---
const ReviewPagePlaceholder = () => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-[50vh]">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-6 border-b pb-2">Tinjau Ulasan & Rating</h2>
        
        <div className="text-center p-12 bg-gray-50 border border-dashed rounded-xl text-gray-500">
            <MessageSquareText className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Ulasan membutuhkan koleksi publik.</p>
            <p className="text-sm mt-1">Kita akan mengakses data dari koleksi **publik** (`/artifacts/{appId}/public/data/reviews`) di langkah selanjutnya agar dapat diakses oleh semua pengguna.</p>
        </div>
    </div>
);


// --- FUNGSI UTILITY ---
const getInitialTab = () => {
    // Fungsi untuk membaca tab dari URL path (misalnya /dashboard/packages -> packages)
    const path = window.location.pathname; 
    const segments = path.split('/');
    let urlTab = segments[segments.length - 1]; 
    urlTab = urlTab.split('?')[0]; 
    // Menggunakan 'profile' sebagai default tab jika path adalah 'dashboard' atau kosong
    return (urlTab === 'dashboard' || urlTab === '') ? 'profile' : urlTab; 
};


// --- KOMPONEN UTAMA APLIKASI ---
const App = () => {
    const [vendorData, setVendorData] = useState(DEFAULT_INITIAL_DATA);
    // Menggunakan fungsi untuk inisialisasi state dari URL
    const [currentTab, setCurrentTab] = useState(getInitialTab); 
    
    // FIREBASE STATE
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null); 
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const alertUser = useCallback((type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    }, []);

    // 1. INICIALISASI FIREBASE, AUTENTIKASI & DATA FETCHING
    useEffect(() => {
        const initializeFirebase = async () => {
            
            if (Object.keys(firebaseConfig).length === 0 || !appId) {
                alertUser('error', 'Firebase config atau App ID tidak ditemukan. Menampilkan data fallback.');
                setIsAuthReady(true); 
                setIsLoading(false); 
                return;
            }

            let app, firestore, authService;
            try {
                // Inisialisasi Firebase Services
                app = initializeApp(firebaseConfig);
                firestore = getFirestore(app);
                authService = getAuth(app);
                setDb(firestore);

            } catch (initError) {
                console.error("Firebase Init Error:", initError);
                alertUser('error', `Gagal inisialisasi Firebase: ${initError.message}`);
                setIsAuthReady(true); 
                setIsLoading(false);
                return;
            }

            let currentUserId;
            try {
                // Otentikasi menggunakan token kustom atau anonim
                if (initialAuthToken) {
                    const credential = await signInWithCustomToken(authService, initialAuthToken);
                    currentUserId = credential.user.uid;
                } else {
                    const credential = await signInAnonymously(authService);
                    currentUserId = credential.user.uid;
                }
                setUserId(currentUserId);
                alertUser('success', `Berhasil otentikasi. User ID: ${currentUserId.substring(0, 8)}...`);

            } catch (authError) {
                // Fallback: Jika otentikasi gagal, gunakan ID acak.
                currentUserId = crypto.randomUUID();
                setUserId(currentUserId);
                alertUser('warning', `Otentikasi anonim/gagal. Menggunakan ID acak: ${currentUserId.substring(0, 8)}...`);
                console.error("Firebase Auth Error:", authError);
            }

            setIsAuthReady(true); 

            // 4. Mulai Listener Data Real-Time untuk dokumen profile
            // Path: /artifacts/{appId}/users/{userId}/vendor_data/profile
            const docRef = doc(firestore, 'artifacts', appId, 'users', currentUserId, 'vendor_data', 'profile');
            let unsubscribeSnapshot = () => {}; 

            unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const fetchedData = docSnap.data();
                    setVendorData({
                        // Pastikan field diinisialisasi dari data yang diambil atau default
                        profile: fetchedData.profile || DEFAULT_INITIAL_DATA.profile,
                        portfolio: fetchedData.portfolio || DEFAULT_INITIAL_DATA.portfolio,
                        packages: fetchedData.packages || DEFAULT_INITIAL_DATA.packages,
                        reviews: fetchedData.reviews || DEFAULT_INITIAL_DATA.reviews,
                    });
                    // Hanya tampilkan alert update setelah proses loading awal selesai
                    if (!isLoading) {
                        alertUser('success', 'Data vendor berhasil diperbarui secara real-time!');
                    }
                } else {
                    // Dokumen tidak ada, gunakan data default
                    setVendorData(DEFAULT_INITIAL_DATA);
                    if (isLoading) { 
                        alertUser('warning', 'Dokumen vendor tidak ditemukan. Data awal dimuat.');
                    }
                }
                setIsLoading(false);
            }, (error) => {
                console.error("Error listening to Firestore:", error);
                alertUser('error', `Gagal memuat data dari Firestore: ${error.message}.`);
                setVendorData(DEFAULT_INITIAL_DATA); 
                setIsLoading(false); 
            });
            
            // Cleanup function untuk menghentikan listener saat komponen dilepas
            return () => {
                unsubscribeSnapshot();
            };
        };

        initializeFirebase();
    }, [alertUser]); // alertUser adalah dependency karena didefinisikan di luar useEffect

    // FUNGSI HANDLER NAVIGASI (PATH-BASED)
    const handleTabChange = useCallback((tab) => {
        setCurrentTab(tab); 
        // Logic untuk memperbarui URL di browser tanpa reload
        const pathSegments = window.location.pathname.split('/dashboard');
        const baseUrl = pathSegments[0]; 
        let newUrlPath = `${baseUrl}/dashboard`;
        if (tab !== 'profile') {
            newUrlPath = `${baseUrl}/dashboard/${tab}`;
        }
        window.history.pushState({ tab: tab }, '', newUrlPath);
    }, []);

    const renderContent = () => {
        const commonProps = { vendorData, db, userId, alertUser, appId };
        
        if (!vendorData) return null;

        switch (currentTab) {
            case 'profile':
                return <ProfilePage {...commonProps} />;
            case 'portfolio':
                return <PortfolioPagePlaceholder {...commonProps} />; 
            case 'packages':
                return <PackagePagePlaceholder {...commonProps} />;
            case 'reviews':
                return <ReviewPagePlaceholder {...commonProps} />;
            case 'public-preview':
                return (
                    <div className="p-6 bg-white rounded-xl shadow-lg min-h-[50vh]">
                        <h2 className="text-3xl font-extrabold text-amber-600 mb-4 border-b pb-2">Pratinjau Publik</h2>
                        <p className="text-gray-600">
                            Halaman ini akan menampilkan bagaimana profil Anda terlihat di mata calon klien.
                        </p>
                    </div>
                );
            default:
                return <ProfilePage {...commonProps} />;
        }
    };
    
    // Helper component untuk item navigasi
    const NavItem = ({ tab, icon: Icon, label }) => {
        const isActive = currentTab === tab;
        return (
            <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center p-3 rounded-xl transition duration-150 w-full text-left 
                    ${isActive 
                        ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-900/50' 
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
            >
                <Icon className="w-5 h-5 mr-3" /> {label}
            </button>
        );
    };

    return (
        <div className="h-screen flex bg-gray-100 overflow-hidden font-sans">
            {/* START: SIDEBAR (ADMIN STYLE) */}
            <div className="w-64 h-screen bg-slate-900 border-r border-gray-700 flex-shrink-0 flex flex-col shadow-2xl">
                
                {/* Logo & Header Block */}
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-3xl font-extrabold text-white">Wedding<span className="text-amber-500">Expo</span></h1>
                    <p className="text-xs text-amber-300 font-medium mt-1">DASHBOARD VENDOR</p>
                    <p className="text-sm text-gray-400 mt-2 truncate">
                        {/* Nama Vendor diambil dari data real-time Firestore */}
                        {vendorData.profile.vendorName || 'Memuat Nama Vendor...'} 
                    </p>
                </div>

                {/* Navigation Items */}
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    
                    <div className="pt-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">Pengaturan Utama</div>

                    <NavItem tab="profile" icon={UserCog} label="Edit Profil" />
                    
                    <div className="pt-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Konten Bisnis</div>

                    <NavItem tab="portfolio" icon={Image} label="Portofolio" />
                    <NavItem tab="packages" icon={Package} label="Paket Harga" />
                    <NavItem tab="reviews" icon={MessageSquareText} label="Tinjau Ulasan" />
                    <NavItem tab="public-preview" icon={Archive} label="Pratinjau Publik" />
                    
                    <div className="pt-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Akun</div>

                    <button
                        onClick={() => alertUser('warning', 'Fitur Membership belum diimplementasikan.')}
                        className="flex items-center p-3 rounded-xl transition duration-150 w-full text-left text-yellow-500 hover:bg-gray-700/50"
                    >
                        <Crown className="w-5 h-5 mr-3" />
                        Membership
                    </button>
                </nav>

                {/* Footer and Logout */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center mb-4">
                        <div className="bg-gray-700 p-2 rounded-full mr-3 text-white uppercase text-sm font-bold">
                            {vendorData.profile.vendorName ? vendorData.profile.vendorName.charAt(0) : 'V'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Vendor User</p>
                            {/* Menampilkan User ID lengkap (Wajib untuk multi-user app) */}
                            <p className="text-[10px] text-gray-400 break-all">{userId || 'Memuat ID...'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => alertUser('warning', 'Simulasi Logout: Diimplementasikan di langkah selanjutnya.')} 
                        className="flex items-center w-full p-3 text-red-400 rounded-xl hover:bg-gray-700 transition duration-150"
                    >
                        <LogOut className="w-5 h-5 mr-3" /> Keluar
                    </button>
                    <p className="text-xs text-gray-600 mt-3 text-center">Versi WO 2.1 (React/Firebase)</p>
                </div>
            </div>
            {/* END: SIDEBAR */}

            {/* START: MAIN CONTENT AREA */}
            <div id="main-content" className="flex-1 p-8 overflow-y-auto">
                {/* Fixed Alert container */}
                <div className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-2">
                    <Alert type={alert.type} message={alert.message} />
                </div>
                
                {/* Kondisi Loading Utama */}
                {isLoading || !isAuthReady ? (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex justify-center items-center z-40">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                            <p className="mt-4 text-lg text-gray-600">Memuat Dashboard Vendor & Otentikasi...</p>
                        </div>
                    </div>
                ) : (
                    // Konten Dashboard yang sudah dimuat
                    <>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            {currentTab === 'profile' ? 'Edit Profil' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1).replace('-', ' ')}
                        </h1>
                        {renderContent()}
                    </>
                )}
            </div>
            {/* END: MAIN CONTENT AREA */}
        </div>
    );
};

export default App;