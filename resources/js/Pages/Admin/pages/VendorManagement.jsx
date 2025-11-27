import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import axios from 'axios'; 
import { Head, usePage } from '@inertiajs/react'; 
import { CheckCircle, XCircle, Trash2, Loader2, AlertTriangle, Info, Clock, FileText, Mail, Phone, MapPin, Download } from 'lucide-react'; 
import moment from 'moment'; 

// --- KONSTANTA & STYLING --- 
const PRIMARY_COLOR = 'bg-amber-600'; 
const BASE_STORAGE_URL = '/storage/'; // Path standar untuk file storage Laravel yang sudah di-link

// --- MOCKING API & ROUTES --- 
const API_BASE_URL = '/api/admin'; 

const route = (name, params = {}) => { 
    const id = params.vendor_id || ''; 
    switch (name) { 
        case 'admin.vendors.data': 
            return `${API_BASE_URL}/vendors/data`; 
        case 'admin.vendors.updateStatus': 
            return `${API_BASE_URL}/vendors/${id}/status`; 
        case 'admin.vendors.delete': 
            return `${API_BASE_URL}/vendors/${id}`; 
        case 'admin.vendors.show': 
            // Rute baru untuk mengambil detail spesifik vendor
            return `${API_BASE_URL}/vendors/${id}`; 
        default: 
            console.error(`Ziggy Error: Route '${name}' is not defined. Using mock route.`); 
            return `${API_BASE_URL}/unknown-route`; 
    } 
}; 

// --- DATA MOCK SEMENTARA DIHAPUS (HANYA ARRAY KOSONG) --- 
const INITIAL_MOCK_VENDORS_DATA = []; 

// --- COMPONENT: StatusCard (Tidak Berubah) --- 
const StatusCard = ({ title, count, colorClass, icon: Icon }) => ( 
    <div className={`p-5 bg-white rounded-xl shadow-lg border-b-4 ${colorClass} transition hover:shadow-xl`}> 
        <div className="flex items-center justify-between"> 
            <div className="text-sm font-medium text-gray-500">{title}</div> 
            <Icon className={`w-6 h-6 text-gray-400`} /> 
        </div> 
        <div className={`mt-2 text-3xl font-bold text-gray-800`}>{count}</div> 
    </div> 
); 

// --- COMPONENT: ActionButton (Tidak Berubah) --- 
const ActionButton = ({ icon: Icon, title, color, onClick, disabled }) => { 
    return ( 
        <button 
            title={title} 
            onClick={onClick} 
            disabled={disabled} 
            className={` 
                p-2 rounded-full text-white transition duration-150 ease-in-out shadow-md 
                ${color} hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed 
            `} 
        > 
            <Icon className="w-5 h-5" /> 
        </button> 
    ); 
}; 

// --- COMPONENT: ToastNotification (Tidak Berubah) --- 
const ToastNotification = ({ message, type, onClose }) => { 
    const [isVisible, setIsVisible] = useState(false); 
    useEffect(() => { 
        if (message) { 
            setIsVisible(true); 
            const timer = setTimeout(() => { 
                setIsVisible(false); 
                setTimeout(onClose, 300); 
            }, 4000); 
            return () => clearTimeout(timer); 
        } else { 
            setIsVisible(false); 
        } 
    }, [message, onClose]); 

    if (!message && !isVisible) return null; 

    const baseStyle = "fixed bottom-5 right-5 p-4 rounded-xl shadow-xl text-white flex items-center z-50 transition-transform duration-300 ease-out"; 
    let icon = Info; 
    let colorStyle = "bg-gray-700"; 
    
    switch (type) { 
        case 'success': 
            icon = CheckCircle; 
            colorStyle = "bg-green-600"; 
            break; 
        case 'error': 
            icon = XCircle; 
            colorStyle = "bg-red-600"; 
            break; 
        case 'warning': 
            icon = AlertTriangle; 
            colorStyle = "bg-amber-500"; 
            break; 
        default: 
            break; 
    } 

    const transformStyle = isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'; 

    return ( 
        <div className={`${baseStyle} ${colorStyle} ${transformStyle}`}> 
            {React.createElement(icon, { className: "w-5 h-5 mr-3 flex-shrink-0" })} 
            <span>{message}</span> 
            <button onClick={() => setIsVisible(false)} className="ml-4 text-white hover:text-gray-100"> 
                &times; 
            </button> 
        </div> 
    ); 
}; 

// --- COMPONENT: ConfirmationModal (Tidak Berubah) --- 
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Ya, Lanjutkan', confirmColor = 'bg-red-600' }) => { 
    if (!isOpen) return null; 

    return ( 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"> 
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100"> 
                <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3> 
                <p className="text-gray-600 mb-6">{message}</p> 
                <div className="flex justify-end space-x-3"> 
                    <button 
                        onClick={onCancel} 
                        className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition" 
                    > 
                        Batal 
                    </button> 
                    <button 
                        onClick={onConfirm} 
                        className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${confirmColor} hover:opacity-90 transition`} 
                    > 
                        {confirmText} 
                    </button> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

// --- KOMPONEN: VendorDetailModal (Diperbaiki untuk penanganan File dan Loading) --- 
const VendorDetailModal = ({ vendor, isOpen, onClose, isLoadingDetail }) => {
    if (!isOpen) return null;

    const DetailItem = ({ icon: Icon, label, value, isFile = false }) => (
        <div className="flex items-start text-sm mb-3">
            <Icon className="w-5 h-5 mr-3 text-amber-600 flex-shrink-0 mt-1" />
            <div>
                <div className="font-semibold text-gray-700">{label}</div>
                {isFile && value ? (
                    <a 
                        // Perbaikan: Membuat URL lengkap untuk file storage
                        href={`${BASE_STORAGE_URL}${value}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="Klik untuk melihat atau mengunduh dokumen"
                        className="text-blue-600 hover:text-blue-800 underline transition break-all flex items-center mt-1 font-medium"
                    >
                        Lihat/Unduh File <Download className='w-4 h-4 ml-2'/>
                    </a>
                ) : (
                    // Menampilkan data atau default jika kosong
                    <div className="text-gray-600 break-words">{value || '- Tidak Ada Data -'}</div>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-auto p-6 transform transition-all scale-100">
                <div className="flex justify-between items-start mb-4 border-b pb-3">
                    <h3 className="text-2xl font-bold text-gray-800">Detail Vendor: {vendor?.name || 'Memuat...'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {isLoadingDetail ? (
                    <div className="flex items-center justify-center p-12 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-3" /> Memuat detail vendor... 
                    </div>
                ) : vendor ? (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Informasi Kontak */}
                        <div className="p-4 border rounded-lg bg-amber-50">
                            <h4 className="font-bold text-amber-700 mb-3 flex items-center"><Phone className="w-4 h-4 mr-2"/> Kontak Vendor</h4>
                            <DetailItem icon={Mail} label="Email Kontak" value={vendor.contact_email} />
                            <DetailItem icon={Phone} label="Nomor Telepon" value={vendor.contact_phone} />
                        </div>

                        {/* Informasi Legalitas */}
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h4 className="font-bold text-gray-700 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2"/> Legalitas & Alamat</h4>
                            <DetailItem icon={FileText} label="NIB (Nomor Induk Berusaha)" value={vendor.nib} />
                            <DetailItem icon={MapPin} label="Alamat Usaha" value={vendor.address} />
                        </div>
                        
                        {/* Dokumen - Poin Perbaikan: isFile=true di sini */}
                        <div className="p-4 border rounded-lg bg-sky-50">
                            <h4 className="font-bold text-sky-700 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2"/> Dokumen Pendukung</h4>
                            <DetailItem 
                                icon={Download} 
                                label="File Surat Izin Usaha" 
                                // Pastikan nama field di database adalah 'business_permit_file' atau sesuaikan
                                value={vendor.business_permit_file} 
                                isFile={true} // KUNCI: Set isFile ke true agar link dibuat
                            />
                        </div>

                        {/* Status & Tanggal */}
                        <div className="p-4 border rounded-lg bg-indigo-50">
                            <h4 className="font-bold text-indigo-700 mb-3 flex items-center"><Clock className="w-4 h-4 mr-2"/> Status Pendaftaran</h4>
                            <DetailItem icon={Clock} label="Dibuat Pada" value={moment(vendor.created_at).format('DD MMMM YYYY HH:mm')} />
                            <DetailItem 
                                icon={CheckCircle} 
                                label="Status Verifikasi" 
                                value={vendor.status_verifikasi} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">Gagal memuat detail vendor.</div>
                )}

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${PRIMARY_COLOR} hover:opacity-90 transition`}
                        disabled={isLoadingDetail}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA: VendorManagement --- 
export default function VendorManagement({ initialStatusCounts = {} }) { 
    const { props } = usePage(); 
    // const auth = props.auth; // Dihapus karena tidak digunakan

    // State Data 
    const [allVendors, setAllVendors] = useState(INITIAL_MOCK_VENDORS_DATA); 
    const [currentStatus, setCurrentStatus] = useState('PENDING'); 
    const [isLoading, setIsLoading] = useState(false); // Loading untuk tabel
    const [isLoadingDetail, setIsLoadingDetail] = useState(false); // Loading untuk detail modal
    const [apiError, setApiError] = useState(null); 

    // State UI (Toast & Modal) 
    const [toast, setToast] = useState({ message: '', type: '' }); 
    const [modal, setModal] = useState({ 
        isOpen: false, 
        vendorId: null, 
        actionType: null, 
        title: '', 
        message: '', 
        confirmText: 'Ya, Lanjutkan', 
        confirmColor: 'bg-red-600' 
    }); 

    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        vendor: null, // Sekarang hanya menyimpan data detail
    });

    const showToast = useCallback((message, type = 'info') => { 
        setToast({ message, type }); 
    }, []); 

    // Hitungan Status
    const calculatedCounts = useMemo(() => { 
        const dataToCount = (allVendors || []); 
        
        const approved = dataToCount.filter(v => v.status_verifikasi === 'APPROVED').length; 
        const pending = dataToCount.filter(v => v.status_verifikasi === 'PENDING').length; 
        const rejected = dataToCount.filter(v => v.status_verifikasi === 'REJECTED').length; 
        const total = approved + pending + rejected; 
        return { APPROVED: approved, PENDING: pending, REJECTED: rejected, TOTAL: total }; 
    
    }, [allVendors]); 

    // Vendor yang ditampilkan 
    const visibleVendors = (allVendors || []).filter(v => v.status_verifikasi === currentStatus); 

    // Fungsi utama untuk mengambil data dari API 
    const fetchData = useCallback(async (status) => { 
        setIsLoading(true); 
        setApiError(null); 
        try { 
            // Ambil semua data vendor (tanpa filter status di frontend) 
            // Jika backend Anda memfilter berdasarkan status yang dikirim, maka setAllVendors akan menimpa. 
            // Untuk memastikan count total akurat, API harus mengembalikan SEMUA vendor atau TOTAL COUNT terpisah.
            // Solusi: Asumsikan API mengembalikan semua data vendor.
            const apiUrl = route('admin.vendors.data'); 
            const response = await axios.get(apiUrl); 

            const incomingData = response.data.data || response.data;
            if (Array.isArray(incomingData)) {
                setAllVendors(incomingData);
            } else {
                console.warn("API did not return an array for vendor data:", incomingData);
                setAllVendors([]);
            }

            // Atur status yang aktif setelah data dimuat
            setCurrentStatus(status); 
        } catch (err) { 
            console.error("Error fetching vendor data:", err.response?.data || err); 
            const status = err.response?.status; 
            let errorMessage = "Gagal memuat data vendor. Cek koneksi API."; 
            
            if (status === 404) { 
                errorMessage = "Error Rute (404 Not Found). Pastikan rute '/api/admin/vendors/data' terdaftar di Laravel."; 
            } else if (status === 500) { 
                errorMessage = "Error Server (500). Cek log backend Laravel Anda."; 
            } else { 
                errorMessage = err.response?.data?.message || errorMessage; 
            } 
            
            setApiError(errorMessage); 
            setAllVendors([]);
            showToast(errorMessage, 'error'); 
        } finally { 
            setIsLoading(false); 
        } 
    }, [showToast]); 

    // Efek untuk memuat data saat komponen pertama dimuat 
    useEffect(() => { 
        fetchData(currentStatus); 
    }, [fetchData]); 

    // FUNGSI: Handle View Detail (Diperbaiki untuk mengambil detail penuh)
    const handleViewDetail = useCallback(async (vendorId) => {
        const vendorSummary = (allVendors || []).find(v => v.id === vendorId);
        if (!vendorSummary) {
            showToast("Vendor tidak ditemukan.", 'error');
            return;
        }

        // Buka modal dengan data ringkasan, lalu tampilkan loading
        setDetailModal({ isOpen: true, vendor: vendorSummary });
        setIsLoadingDetail(true);

        try {
            const apiUrl = route('admin.vendors.show', { vendor_id: vendorId });
            const response = await axios.get(apiUrl);
            
            const fullVendorData = response.data.data || response.data;

            // Perbaikan: Pastikan data yang diterima adalah objek dan update state
            if (fullVendorData && typeof fullVendorData === 'object') {
                setDetailModal({ isOpen: true, vendor: fullVendorData });
            } else {
                // Tampilkan data ringkasan jika detail gagal diambil
                setDetailModal({ isOpen: true, vendor: vendorSummary });
                showToast("Gagal mengambil detail lengkap vendor. Cek respons API.", 'warning');
            }

        } catch (err) {
            console.error(`Error fetching vendor detail for ID ${vendorId}:`, err.response?.data || err);
            showToast("Gagal memuat detail vendor. Cek rute 'admin.vendors.show'.", 'error');
            // Tutup modal atau tampilkan data ringkasan jika gagal
            setDetailModal({ isOpen: false, vendor: null }); 
        } finally {
            setIsLoadingDetail(false);
        }
    }, [allVendors, showToast]);

    // Handle aksi (Approve, Reject, Delete) (Tidak Berubah, hanya menggunakan fetchData)
    const handleVendorAction = useCallback(async (vendorId, actionType, confirm = false) => { 
        // ... (Kode handleVendorAction yang sama)
        const vendor = (allVendors || []).find(v => v.id === vendorId); 
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
            let apiUrl; 
            let method; 
            let payload = {}; 
            let successMessage = ''; 
            
            if (actionType === 'delete') { 
                apiUrl = route('admin.vendors.delete', { vendor_id: vendorId }); 
                method = 'delete'; 
                successMessage = `Vendor ${vendor.name} berhasil dihapus.`; 
            } else { 
                const newStatus = actionType; 
                apiUrl = route('admin.vendors.updateStatus', { vendor_id: vendorId }); 
                method = 'patch'; 
                payload = { status_verifikasi: newStatus }; 
                successMessage = `Status Vendor ${vendor.name} berhasil diperbarui menjadi ${newStatus}.`; 
            } 

            await axios({ method: method, url: apiUrl, data: payload }); 

            // Muat ulang data untuk merefleksikan perubahan status 
            await fetchData(currentStatus); 
            showToast(successMessage, 'success'); 
        } catch (err) { 
            console.error(`Error updating status for ID ${vendorId}:`, err.response?.data || err); 
            const errorMessage = err.response?.data?.message || "Gagal memperbarui status. Cek log konsol untuk detail."; 
            showToast(errorMessage, 'error'); 
        } finally { 
            setIsLoading(false); 
        } 
        // ... (Akhir Kode handleVendorAction yang sama)
    }, [allVendors, currentStatus, showToast, fetchData]); 

    // Helper untuk menentukan status style (Tidak Berubah)
    const getStatusStyle = (status) => { 
        const lowerStatus = status.toLowerCase(); 
        if (lowerStatus === 'approved') return 'bg-green-100 text-green-800 border border-green-300'; 
        if (lowerStatus === 'pending') return 'bg-amber-100 text-amber-800 border border-amber-300'; 
        return 'bg-red-100 text-red-800 border border-red-300'; 
    }; 

    return ( 
        <div className="p-4 sm:p-6 max-w-full mx-auto font-sans"> 
            <Head title="Manajemen Vendor" /> 
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Verifikasi Vendor</h1> 
            <p className="text-gray-500 mb-6">Kelola persetujuan dan status akun Vendor di platform.</p> 
            
            {/* Status Cards */} 
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"> 
                <StatusCard title="Vendor Pending" count={calculatedCounts.PENDING || 0} colorClass="border-amber-500" icon={Clock} /> 
                <StatusCard title="Vendor Approved" count={calculatedCounts.APPROVED || 0} colorClass="border-green-500" icon={CheckCircle} /> 
                <StatusCard title="Vendor Rejected" count={calculatedCounts.REJECTED || 0} colorClass="border-red-500" icon={XCircle} /> 
                <StatusCard title="Total Vendor" count={calculatedCounts.TOTAL || 0} colorClass="border-indigo-500" icon={FileText} /> 
            </div> 
            
            {/* Error Message untuk Kegagalan API Global */} 
            {apiError && ( 
                <div role="alert" className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md"> 
                    <strong className="font-bold">Gagal Ambil Data!</strong> 
                    <span className="block sm:inline ml-2">{apiError}</span> 
                </div> 
            )} 
            
            {/* Tombol Filter Status */} 
            <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto pb-2"> 
                {['PENDING', 'APPROVED', 'REJECTED'].map(status => ( 
                    <button 
                        key={status} 
                        onClick={() => fetchData(status)} // Panggil fetchData untuk memuat ulang data & meng-set currentStatus
                        disabled={isLoading} 
                        className={` 
                            px-4 sm:px-6 py-2 rounded-full font-semibold whitespace-nowrap transition duration-150 ease-in-out 
                            ${currentStatus === status ? `${PRIMARY_COLOR} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'} 
                            disabled:opacity-70 
                        `} 
                    > 
                        {status.charAt(0) + status.slice(1).toLowerCase()} ({calculatedCounts[status] || 0}) 
                    </button> 
                ))} 
            </div> 
            
            {/* Area Tabel */} 
            <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100"> 
                {isLoading ? ( 
                    <div className="flex items-center justify-center p-12 text-gray-500"> 
                        <Loader2 className="w-6 h-6 animate-spin mr-3" /> Memuat data vendor... 
                    </div> 
                ) : ( 
                    <table className="min-w-full divide-y divide-gray-200"> 
                        <thead className="bg-amber-50"> 
                            <tr> 
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Vendor</th> 
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dibuat Pada</th> 
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th> 
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th> 
                            </tr> 
                        </thead> 
                        <tbody className="bg-white divide-y divide-gray-100"> 
                            {visibleVendors.length > 0 ? ( 
                                visibleVendors.map(vendor => ( 
                                    <tr key={vendor.id} className="hover:bg-gray-50 transition duration-100"> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
                                            {moment(vendor.created_at).format('DD MMM YYYY')} 
                                        </td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center"> 
                                            <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(vendor.status_verifikasi)}`}> 
                                                {vendor.status_verifikasi} 
                                            </span> 
                                        </td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"> 
                                            <div className="flex justify-center space-x-2"> 
                                                {/* Tombol Detail - Diperbaiki untuk memanggil ID */}
                                                <ActionButton 
                                                    icon={Info} 
                                                    title="Lihat Detail Vendor" 
                                                    color="bg-indigo-500 hover:bg-indigo-600" 
                                                    onClick={() => handleViewDetail(vendor.id)} 
                                                    disabled={isLoading} 
                                                />
                                                {/* Approve Action */} 
                                                {vendor.status_verifikasi !== 'APPROVED' && <ActionButton icon={CheckCircle} title="Setujui Vendor" color="bg-green-500 hover:bg-green-600" onClick={() => handleVendorAction(vendor.id, 'APPROVED')} disabled={isLoading} />} 
                                                {/* Reject Action */} 
                                                {vendor.status_verifikasi !== 'REJECTED' && <ActionButton icon={XCircle} title="Tolak Vendor" color="bg-yellow-500 hover:bg-yellow-600" onClick={() => handleVendorAction(vendor.id, 'REJECTED')} disabled={isLoading} />} 
                                                {/* Delete Action */} 
                                                <ActionButton icon={Trash2} title="Hapus Vendor Permanen" color="bg-red-500 hover:bg-red-600" onClick={() => handleVendorAction(vendor.id, 'delete')} disabled={isLoading} /> 
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

            {/* Implementasi Detail Modal (Diperbarui) */}
            <VendorDetailModal
                isOpen={detailModal.isOpen}
                vendor={detailModal.vendor}
                onClose={() => setDetailModal({ isOpen: false, vendor: null })}
                isLoadingDetail={isLoadingDetail} // Pasang loading state
            />
            
            <ToastNotification 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: '', type: '' })} 
            /> 
        </div> 
    ); 
}