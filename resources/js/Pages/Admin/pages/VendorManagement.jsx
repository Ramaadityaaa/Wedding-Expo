import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc, 
    getDoc,
    setDoc
} from 'firebase/firestore';
import { Loader2, Clock, CheckCircle, XCircle, FileText, Info, Trash2 } from 'lucide-react';

// --- MOCK / ENVIRONMENT SETUP ---
// NOTE: Global variables are automatically provided by the execution environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'vendor-management-app';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// FIREBASE REFERENCES (Akan diisi di useEffect)
let app;
let db;
let auth;

// MOCK utility for date formatting (using a simplified approach for demonstration)
const moment = { 
    format: (date) => {
        if (!date) return '-';
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj)) return '-';
            // Menggunakan 'id-ID' untuk format Bahasa Indonesia
            return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            console.error("Date formatting error:", e);
            return '-';
        }
    }
};

const Head = ({ title }) => <title>{title}</title>; 
const PRIMARY_COLOR = 'bg-amber-500 hover:bg-amber-600';

// --- Helper Components ---
const ToastNotification = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!isVisible) return null;

    // Use responsive positioning: slightly smaller bottom/right on mobile
    const baseStyle = "fixed bottom-4 right-4 sm:bottom-5 sm:right-5 p-4 rounded-xl shadow-2xl transition-opacity duration-300 z-50 transform";
    const typeStyles = {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type] || 'bg-gray-700 text-white'} w-11/12 sm:w-auto max-w-sm`}>
            <p className="font-semibold text-sm sm:text-base">{message}</p>
        </div>
    );
};

const StatusCard = ({ title, count, colorClass, icon: Icon }) => (
    // Responsive padding and font size for mobile
    <div className={`p-4 sm:p-5 bg-white rounded-xl shadow-lg border-l-4 ${colorClass}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{count}</p>
            </div>
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, title, color, onClick, disabled }) => (
    // Larger touch target (p-2 is sufficient)
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-2 rounded-full text-white transition duration-150 ease-in-out ${color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
    >
        <Icon className="w-5 h-5" />
    </button>
);

const ModalBase = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity" 
            onClick={onClose}
        >
            <div 
                // Full width on mobile, max-w-lg on larger screens
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
                <div className="p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, title, message, confirmText, confirmColor, onCancel, onConfirm }) => (
    <ModalBase isOpen={isOpen} title={title} onClose={onCancel}>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">{message}</p>
        <div className="flex justify-end space-x-3">
            <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
                Batal
            </button>
            <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-full transition ${confirmColor || 'bg-indigo-600'} hover:opacity-90`}
            >
                {confirmText}
            </button>
        </div>
    </ModalBase>
);

const VendorDetailModal = ({ isOpen, vendor, onClose, isLoadingDetail }) => (
    <ModalBase isOpen={isOpen} title="Detail Vendor" onClose={onClose}>
        {isLoadingDetail ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-3" /> Memuat detail...
            </div>
        ) : vendor ? (
            <div className="space-y-4">
                <DetailItem label="Nama Vendor" value={vendor.name} />
                <DetailItem label="Email" value={vendor.email} />
                <DetailItem label="Nomor Telepon" value={vendor.phone || '-'} />
                <DetailItem label="Alamat Bisnis" value={vendor.address || 'Belum diisi'} />
                <DetailItem label="Status Verifikasi" value={vendor.status_verifikasi} color={vendor.status_verifikasi === 'APPROVED' ? 'text-green-600' : vendor.status_verifikasi === 'PENDING' ? 'text-amber-600' : 'text-red-600'} />
                <DetailItem label="Tanggal Bergabung" value={moment.format(vendor.created_at)} />
            </div>
        ) : (
            <p className="text-gray-500">Detail vendor tidak ditemukan.</p>
        )}
    </ModalBase>
);

const DetailItem = ({ label, value, color }) => (
    <div className="border-b pb-2">
        <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
        <p className={`text-sm sm:text-base font-semibold text-gray-900 ${color || ''}`}>{value}</p>
    </div>
);


const MOCK_VENDORS = [
    { id: 'v1', name: 'Vendor Kreatif Jaya', email: 'vkj@mail.com', phone: '081234567890', address: 'Jl. Merdeka No. 10', status_verifikasi: 'PENDING', created_at: Date.now() - 86400000 * 5 },
    { id: 'v2', name: 'Toko Elektronik Super', email: 'tes@mail.com', phone: '081234567891', address: 'Jl. Sudirman No. 20', status_verifikasi: 'APPROVED', created_at: Date.now() - 86400000 * 10 },
    { id: 'v3', name: 'Jasa Katering Mantap', email: 'jkm@mail.com', phone: '081234567892', address: 'Jl. Asia Afrika No. 30', status_verifikasi: 'REJECTED', created_at: Date.now() - 86400000 * 2 },
    { id: 'v4', name: 'Bengkel Mobil Cepat', email: 'bmc@mail.com', phone: '081234567893', address: 'Jl. Pahlawan No. 40', status_verifikasi: 'PENDING', created_at: Date.now() - 86400000 * 1 },
    { id: 'v5', name: 'Peralatan Kantor Mega', email: 'pkm@mail.com', phone: '081234567894', address: 'Jl. Kartini No. 50', status_verifikasi: 'PENDING', created_at: Date.now() - 86400000 * 7 },
];

const getInMemoryMockVendors = () => {
    console.warn("Menggunakan data mock in-memory karena kegagalan otentikasi/izin Firestore.");
    return MOCK_VENDORS.map(v => ({
        ...v,
        created_at: new Date(v.created_at).toISOString() 
    }));
};

export default function VendorManagement() {
    // --- STATE MANAGEMENT ---
    const [allVendors, setAllVendors] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('PENDING');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    
    const mockDataInitialized = useRef(false);
    const initialLoadAttempted = useRef(false);

    const [modal, setModal] = useState({
        isOpen: false,
        vendorId: null,
        actionType: null,
        title: '',
        message: '',
        confirmText: '',
        confirmColor: ''
    });

    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        vendor: null,
    });

    const [toast, setToast] = useState({ message: '', type: '' });
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

    // --- FIREBASE INITIALIZATION & AUTHENTICATION ---
    useEffect(() => {
        try {
            if (!firebaseInitialized) {
                app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);
                setFirebaseInitialized(true);
                console.log("Firebase services initialized.");
            }

            const authenticate = async () => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                        console.log("Signed in with custom token.");
                    } else {
                        await signInAnonymously(auth);
                        console.log("Signed in anonymously.");
                    }
                } catch (error) {
                    console.error("Firebase Auth Error: Failed to sign in.", error);
                    try {
                        await signInAnonymously(auth); 
                        console.log("Fallback: Signed in anonymously after custom token failure.");
                    } catch(anonError) {
                        console.error("Fallback Auth Error:", anonError);
                    }
                }
            };
            
            const unsubscribe = auth.onAuthStateChanged(user => {
                setIsAuthReady(true);
                console.log("Auth state changed. Auth is ready.");
            });

            authenticate();
            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase Initialization Failed (General Error):", error);
            setApiError("Aplikasi gagal terhubung ke layanan data. Cek konfigurasi Firebase di konsol.");
            setIsAuthReady(true);
            setFirebaseInitialized(false);
        }
    }, [firebaseInitialized]);

    // --- MOCK DATA POPULATION (Operasi tulis terpisah) ---
    useEffect(() => {
        if (isAuthReady && firebaseInitialized && db && !mockDataInitialized.current) {
            const vendorsCollectionRef = collection(db, `artifacts/${appId}/public/data/vendors`);

            const checkAndPopulate = async () => {
                try {
                    // Cek cepat apakah ada dokumen.
                    const docRef = doc(vendorsCollectionRef, MOCK_VENDORS[0].id);
                    const docSnap = await getDoc(docRef);

                    if (!docSnap.exists()) {
                        console.log("Collection is empty, attempting to populate with mock data...");
                        const mockPromises = MOCK_VENDORS.map(vendor => {
                            const vendorRef = doc(vendorsCollectionRef, vendor.id);
                            return setDoc(vendorRef, {
                                ...vendor,
                                created_at: new Date(vendor.created_at).toISOString() 
                            });
                        });
                        await Promise.all(mockPromises);
                        console.log("Mock data successfully written.");
                    } else {
                        console.log("Mock data already exists.");
                    }
                } catch (err) {
                    if (err.message.includes('insufficient permissions')) {
                        console.warn("WARNING: Failed to write mock data due to permission denial. This is expected if Firestore Security Rules are not set.");
                    } else {
                        console.error("WARNING: Failed to write mock data (unknown error). Error:", err.message);
                    }
                } finally {
                    mockDataInitialized.current = true; 
                }
            };
            checkAndPopulate();
        }
    }, [isAuthReady, firebaseInitialized, appId]);


    // --- DATA FETCHING (Operasi baca murni menggunakan onSnapshot) ---
    const fetchData = useCallback(() => {
        if (!isAuthReady || !firebaseInitialized || !db) return () => {}; 

        setIsLoading(true);
        setApiError('');
        initialLoadAttempted.current = true;

        try {
            const vendorsCollectionRef = collection(db, `artifacts/${appId}/public/data/vendors`);
            
            const unsubscribe = onSnapshot(vendorsCollectionRef, (snapshot) => {
                const fetchedVendors = snapshot.docs.map(doc => {
                    const data = doc.data();
                    let createdAt;
                    
                    if (data.created_at && typeof data.created_at.toDate === 'function') {
                        // Jika Firestore Timestamp
                        createdAt = data.created_at.toDate().toISOString();
                    } else if (data.created_at) {
                        // Jika sudah dalam bentuk string ISO (dari mock data)
                        createdAt = data.created_at;
                    } else {
                        // Fallback jika tidak ada field created_at
                        createdAt = new Date().toISOString();
                    }

                    return { id: doc.id, ...data, created_at: createdAt };
                });
                
                setAllVendors(fetchedVendors);
                setIsLoading(false);
                setApiError(''); 
                console.log(`Data fetched successfully. Total vendors: ${fetchedVendors.length}`);
            }, (error) => {
                
                if (error.code === 'permission-denied' || error.message.includes('insufficient permissions')) {
                    console.error("Firestore Snapshot Error: Missing or insufficient permissions. Falling back to mock data.");
                    
                    setApiError("Gagal mengambil data real-time dari Firestore karena Izin Akses (Permission Denied). Menampilkan data contoh (in-memory). Silakan periksa Aturan Keamanan Firestore Anda.");
                    setAllVendors(getInMemoryMockVendors());
                } else {
                    console.error("Firestore Snapshot Error (Unknown):", error);
                    setApiError("Gagal mengambil data real-time dari Firestore. Cek konsol untuk detail error teknis.");
                }
                setIsLoading(false);
            });

            return unsubscribe; 
            
        } catch (error) {
            console.error("Fetch Data Setup Error:", error);
            setApiError("Terjadi kesalahan saat menyiapkan koneksi data.");
            setIsLoading(false);
            return () => {};
        }
    }, [isAuthReady, firebaseInitialized, appId]); 

    // Effect hook to run fetchData on auth status change
    useEffect(() => {
        let unsubscribe;
        if (isAuthReady && firebaseInitialized) {
            unsubscribe = fetchData();
        }
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [isAuthReady, firebaseInitialized, fetchData]);

    // --- Vendor Detail Fetching ---
    const handleViewDetail = useCallback(async (vendorId) => {
        if (!db) {
            showToast("Layanan data belum siap.", 'error');
            return;
        }

        setIsLoadingDetail(true);
        setDetailModal({ isOpen: true, vendor: null });

        try {
            const docRef = doc(db, `artifacts/${appId}/public/data/vendors`, vendorId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                let createdAt;

                if (data.created_at && typeof data.created_at.toDate === 'function') {
                    createdAt = data.created_at.toDate().toISOString();
                } else if (data.created_at) {
                    createdAt = data.created_at;
                } else {
                    createdAt = new Date().toISOString();
                }

                setDetailModal({ 
                    isOpen: true, 
                    vendor: { 
                        id: docSnap.id, 
                        ...data,
                        created_at: createdAt
                    } 
                });
            } else {
                // Fallback to in-memory data if not found in Firestore (might happen with mock data)
                const mockVendor = getInMemoryMockVendors().find(v => v.id === vendorId);
                if (mockVendor) {
                    setDetailModal({ 
                        isOpen: true, 
                        vendor: mockVendor
                    });
                } else {
                    showToast("Detail vendor tidak ditemukan.", 'error');
                    setDetailModal({ isOpen: false, vendor: null });
                }
            }
        } catch (error) {
            console.error("Error fetching vendor detail:", error);
            showToast("Gagal memuat detail vendor. (Error Izin Baca)", 'error');
        } finally {
            setIsLoadingDetail(false);
        }
    }, [showToast, appId]);

    // --- Action Handler (Write/Update/Delete) ---
    const handleVendorAction = useCallback(async (vendorId, actionType, confirm = false) => {
        if (!db) {
            showToast("Layanan data belum siap.", 'error');
            return;
        }

        const vendor = allVendors.find(v => v.id === vendorId);
        if (!vendor) {
            showToast("Vendor tidak ditemukan.", 'error');
            return;
        }

        if (!confirm) {
            let modalConfig = {};
            if (actionType === 'delete') {
                modalConfig = {
                    title: 'Konfirmasi Penghapusan',
                    message: `Apakah Anda yakin ingin menghapus Vendor "${vendor.name}"? Tindakan ini permanen dan tidak dapat dibatalkan.`,
                    confirmText: 'Hapus Permanen',
                    confirmColor: 'bg-red-600'
                };
            } else if (actionType === 'APPROVED') {
                modalConfig = {
                    title: 'Setujui Verifikasi',
                    message: `Apakah Anda yakin ingin MENYETUJUI Vendor "${vendor.name}"? Vendor akan memiliki akses penuh.`,
                    confirmText: 'Setujui Sekarang',
                    confirmColor: 'bg-green-600'
                };
            } else if (actionType === 'REJECTED') {
                modalConfig = {
                    title: 'Tolak Verifikasi',
                    message: `Apakah Anda yakin ingin MENOLAK Vendor "${vendor.name}"? Vendor akan kehilangan akses.`,
                    confirmText: 'Tolak Sekarang',
                    confirmColor: 'bg-yellow-600'
                };
            }
            setModal({ isOpen: true, vendorId, actionType, ...modalConfig });
            return;
        }

        setModal(prev => ({ ...prev, isOpen: false }));
        setIsLoading(true);

        try {
            const vendorRef = doc(db, `artifacts/${appId}/public/data/vendors`, vendorId);
            let successMessage = '';

            if (actionType === 'delete') {
                await deleteDoc(vendorRef);
                successMessage = `Vendor ${vendor.name} berhasil dihapus.`;
            } else {
                const newStatus = actionType;
                await updateDoc(vendorRef, { status_verifikasi: newStatus });
                successMessage = `Status Vendor ${vendor.name} berhasil diperbarui menjadi ${newStatus}.`;
            }

            showToast(successMessage, 'success');
        } catch (err) {
            console.error(`Error updating status for ID ${vendorId}:`, err);
            const errorMessage = "Gagal memperbarui status. (Error Izin Tulis/Hapus)";
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [allVendors, showToast, appId]); 

    // --- Derived State & Filtering ---
    const calculatedCounts = useMemo(() => {
        const counts = { TOTAL: allVendors.length, PENDING: 0, APPROVED: 0, REJECTED: 0 };
        allVendors.forEach(vendor => {
            const status = vendor.status_verifikasi;
            if (counts.hasOwnProperty(status)) {
                counts[status]++;
            }
        });
        return counts;
    }, [allVendors]);

    const visibleVendors = useMemo(() => {
        return allVendors
            .filter(v => v.status_verifikasi === currentStatus)
            // Sort by creation date, newest first
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [allVendors, currentStatus]);

    const getStatusStyle = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'approved') return 'bg-green-100 text-green-800 border border-green-300';
        if (lowerStatus === 'pending') return 'bg-amber-100 text-amber-800 border border-amber-300';
        return 'bg-red-100 text-red-800 border border-red-300';
    };

    return (
        // Use min-h-screen to ensure full coverage and better mobile feel
        <div className="p-4 sm:p-6 min-h-screen max-w-full mx-auto font-sans bg-gray-50">
            <Head title="Manajemen Vendor" />

            {/* Header - Optimized for mobile font size */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">Manajemen Verifikasi Vendor</h1>
            <p className="text-sm text-gray-500 mb-6">Kelola persetujuan dan status akun Vendor di platform.</p>

            {/* Status Cards - Responsive Grid: 2 columns on mobile, 4 columns on medium/desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <StatusCard title="Vendor Pending" count={calculatedCounts.PENDING || 0} colorClass="border-amber-500" icon={Clock} />
                <StatusCard title="Vendor Approved" count={calculatedCounts.APPROVED || 0} colorClass="border-green-500" icon={CheckCircle} />
                <StatusCard title="Vendor Rejected" count={calculatedCounts.REJECTED || 0} colorClass="border-red-500" icon={XCircle} />
                <StatusCard title="Total Vendor" count={calculatedCounts.TOTAL || 0} colorClass="border-indigo-500" icon={FileText} />
            </div>

            {/* Error Message */}
            {apiError && (
                <div role="alert" className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md text-sm">
                    <strong className="font-bold">Perhatian: Izin Gagal!</strong>
                    <span className="block sm:inline ml-2">{apiError}</span>
                </div>
            )}
            
            {/* Loading Indicator */}
            {!isAuthReady && (
                <div className="flex items-center justify-center p-4 text-indigo-500 bg-indigo-50 rounded-xl mb-4 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Menunggu otentikasi Firebase...
                </div>
            )}

            {/* Tombol Filter Status - Overflow-x-auto for small screens */}
            <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto pb-2">
                {['PENDING', 'APPROVED', 'REJECTED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setCurrentStatus(status)} 
                        disabled={isLoading || !isAuthReady}
                        className={`
                            px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition duration-150 ease-in-out 
                            ${currentStatus === status ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'}
                            disabled:opacity-70
                        `}
                    >
                        {status.charAt(0) + status.slice(1).toLowerCase()} ({calculatedCounts[status] || 0})
                    </button>
                ))}
            </div>

            {/* Area Tabel - CRITICAL: Use overflow-x-auto on the parent div for table responsiveness */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100">
                {isLoading && visibleVendors.length === 0 && !apiError ? (
                    <div className="flex items-center justify-center p-12 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-3" /> Memuat data vendor...
                    </div>
                ) : (
                    // min-w-full ensures the table takes up full width for horizontal scrolling if needed
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-amber-50">
                            <tr>
                                {/* Adjust padding and font size for small screens */}
                                <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Vendor</th>
                                <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dibuat Pada</th>
                                <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {visibleVendors.length > 0 ? (
                                visibleVendors.map(vendor => (
                                    <tr key={vendor.id} className="hover:bg-gray-50 transition duration-100">
                                        <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                                        <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                                            {moment.format(vendor.created_at)}
                                        </td>
                                        <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-center text-sm">
                                            <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(vendor.status_verifikasi)}`}>
                                                {vendor.status_verifikasi}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                {/* Tombol Detail */}
                                                <ActionButton
                                                    icon={Info}
                                                    title="Lihat Detail Vendor"
                                                    color="bg-indigo-500 hover:bg-indigo-600"
                                                    onClick={() => handleViewDetail(vendor.id)}
                                                    disabled={isLoading || isLoadingDetail || !isAuthReady}
                                                />
                                                {/* Approve Action */}
                                                {vendor.status_verifikasi !== 'APPROVED' && <ActionButton icon={CheckCircle} title="Setujui Vendor" color="bg-green-500 hover:bg-green-600" onClick={() => handleVendorAction(vendor.id, 'APPROVED')} disabled={isLoading || !isAuthReady} />}
                                                {/* Reject Action */}
                                                {vendor.status_verifikasi !== 'REJECTED' && <ActionButton icon={XCircle} title="Tolak Vendor" color="bg-yellow-500 hover:bg-yellow-600" onClick={() => handleVendorAction(vendor.id, 'REJECTED')} disabled={isLoading || !isAuthReady} />}
                                                {/* Delete Action */}
                                                <ActionButton icon={Trash2} title="Hapus Vendor Permanen" color="bg-red-500 hover:bg-red-600" onClick={() => handleVendorAction(vendor.id, 'delete')} disabled={isLoading || !isAuthReady} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500 italic">
                                        {isLoading ? "Menunggu data dari server..." : `Tidak ada data vendor di kategori ${currentStatus}.`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Komponen Modal & Toast di level root */}
            <ConfirmationModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                confirmColor={modal.confirmColor}
                onCancel={() => setModal(prev => ({ ...prev, isOpen: false, vendorId: null, actionType: null }))}
                onConfirm={() => handleVendorAction(modal.vendorId, modal.actionType, true)}
            />

            {/* Implementasi Detail Modal */}
            <VendorDetailModal
                isOpen={detailModal.isOpen}
                vendor={detailModal.vendor}
                onClose={() => setDetailModal({ isOpen: false, vendor: null })}
                isLoadingDetail={isLoadingDetail} 
            />

            <ToastNotification
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />
        </div>
    );
}