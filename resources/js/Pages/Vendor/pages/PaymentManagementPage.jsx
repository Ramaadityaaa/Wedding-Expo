import React, { useState, useMemo } from 'react';
import { 
    Clock, CheckCircle, XCircle, Filter, Search, 
    AlertTriangle, Download, Calendar, User, Package, ChevronRight, Eye, AlertCircle, Image
} from 'lucide-react';

// --- Data Transaksi Mock (Simulasi data) ---
const initialMockTransactions = [
    { 
        id: 'TRX00123', 
        customerName: 'Aulia Rahman', 
        amount: 5500000, 
        dueDate: '2025-12-31', 
        stage: 'MENUNGGU_VERIFIKASI',
        type: 'DP',
        proofImage: 'https://placehold.co/400x300/a3e635/000000?text=Bukti+Pembayaran+TRX00123', // Bukti Pembayaran
    },
    { 
        id: 'TRX00124', 
        customerName: 'Bagas Satria', 
        amount: 15000000, 
        dueDate: '2025-11-01', 
        stage: 'DIPROSES',
        type: 'Pelunasan',
    },
    { 
        id: 'TRX00125', 
        customerName: 'Citra Dewi', 
        amount: 2500000, 
        dueDate: '2025-10-15', 
        stage: 'DITOLAK', // Status DITOLAK
        type: 'DP',
        rejectionReason: 'Bukti transfer buram dan nominal tidak sesuai.', // Contoh data ditolak
    },
    { 
        id: 'TRX00126', 
        customerName: 'Dian Permata', 
        amount: 8000000, 
        dueDate: '2026-01-20', 
        stage: 'SELESAI',
        type: 'Pelunasan',
    },
    { 
        id: 'TRX00127', 
        customerName: 'Eka Wijaya', 
        amount: 3000000, 
        dueDate: '2025-12-25', 
        stage: 'DIPROSES',
        type: 'DP',
    },
];

// --- Utility Functions ---

// Format mata uang Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Mendapatkan style berdasarkan Tahap (Stage)
const getStageStyles = (stage) => {
    switch (stage) {
        case 'SELESAI':
            return { text: 'SELESAI', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
        case 'DIPROSES':
            return { text: 'DIPROSES', color: 'text-blue-600', bg: 'bg-blue-100', icon: Package };
        case 'DITOLAK':
            return { text: 'DITOLAK', color: 'text-gray-600', bg: 'bg-gray-100', icon: XCircle };
        case 'MENUNGGU_VERIFIKASI':
            // KOREKSI LABEL: Menunggu Verifikasi
            return { text: 'MENUNGGU VERIFIKASI', color: 'text-red-600', bg: 'bg-red-100', icon: Clock };
        default:
            return { text: 'TIDAK DIKETAHUI', color: 'text-gray-500', bg: 'bg-gray-100', icon: AlertCircle };
    }
};

// Konversi data ke format CSV
const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    // Tambahkan kolom 'Alasan Penolakan' di header jika ada yang DITOLAK
    const hasRejections = data.some(t => t.stage === 'DITOLAK' && t.rejectionReason);
    
    let headers = [
        'ID Transaksi', 
        'Nama Pelanggan', 
        'Nominal (IDR)', 
        'Jatuh Tempo', 
        'Tipe Pembayaran', 
        'Status'
    ];
    
    if (hasRejections) {
        headers.push('Alasan Penolakan');
    }

    // Mapping data ke baris CSV
    const rows = data.map(t => {
        const row = [
            `"${t.id}"`, 
            `"${t.customerName}"`,
            t.amount,
            `"${t.dueDate}"`,
            `"${t.type}"`,
            `"${getStageStyles(t.stage).text}"`
        ];
        
        if (hasRejections) {
            // Jika ada alasan penolakan, tambahkan ke baris
            row.push(`"${t.rejectionReason || '-'}"`);
        }
        return row.join(',');
    });

    return [
        headers.join(','),
        ...rows
    ].join('\n');
};

// --- Komponen Tab Navigasi Gaya Pill Button ---
const TabButton = ({ label, stageKey, currentStage, setStage, count }) => {
    const isActive = currentStage === stageKey;
    const isVerification = stageKey === 'MENUNGGU_VERIFIKASI';
    
    // Badge untuk Menunggu Verifikasi
    const countDisplay = isVerification && count > 0 ? (
        <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-white text-red-500">
            {count}
        </span>
    ) : null;

    return (
        <button
            onClick={() => setStage(stageKey)}
            className={`flex items-center justify-center px-4 py-2 font-medium text-sm rounded-full transition-all duration-200 shadow-sm ${
                isActive 
                    ? 'bg-amber-500 text-white font-semibold shadow-amber-300/50' 
                    : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
            }`}
        >
            {label}
            {countDisplay}
        </button>
    );
};


// Komponen Utama
export default function TransactionManagement() {
    const [transactions, setTransactions] = useState(initialMockTransactions);
    const [currentTab, setCurrentTab] = useState('MENUNGGU_VERIFIKASI'); 
    const [searchTerm, setSearchTerm] = useState('');

    // Definisi Tab
    const tabs = useMemo(() => ([
        { key: 'MENUNGGU_VERIFIKASI', label: 'Verifikasi Pembayaran' },
        { key: 'DIPROSES', label: 'Pesanan Aktif' },
        { key: 'SELESAI', label: 'Selesai' },
        { key: 'DITOLAK', label: 'Ditolak' },
        { key: 'ALL', label: 'Semua' },
    ]), []);

    // --- Fungsionalitas Aksi ---
    
    // 1. Verifikasi (Diterima)
    const handleVerifyPayment = (id) => {
        if (window.confirm(`Konfirmasi Verifikasi (DITERIMA) untuk transaksi ${id}? Status akan diubah menjadi DIPROSES.`)) {
            setTransactions(prev => prev.map(t => 
                t.id === id ? { ...t, stage: 'DIPROSES' } : t
            ));
        }
    };
    
    // 2. Tolak Pembayaran
    const handleRejectPayment = (id) => {
        const reason = prompt(`Tolak pembayaran untuk transaksi ${id}. Masukkan alasan penolakan (Wajib):`);
        
        if (reason === null) return; // Batal
        // Mengganti alert() dengan console.error/log
        if (reason.trim() === '') {
            console.error('Alasan penolakan tidak boleh kosong.');
            window.alert('Alasan penolakan tidak boleh kosong.'); // Menggunakan alert sebagai fallback UI sederhana
            return;
        }

        if (window.confirm(`Konfirmasi Penolakan (DITOLAK) untuk transaksi ${id}? Status akan diubah menjadi DITOLAK. Alasan: ${reason}`)) {
            setTransactions(prev => prev.map(t => 
                t.id === id ? { ...t, stage: 'DITOLAK', rejectionReason: reason } : t
            ));
        }
    };

    // 3. Pesanan Selesai
    const handleCompleteOrder = (id) => {
        if (window.confirm(`Tandai pesanan ${id} sebagai SELESAI?`)) {
            setTransactions(prev => prev.map(t => 
                t.id === id ? { ...t, stage: 'SELESAI' } : t
            ));
        }
    };

    // 4. Lihat Detail Transaksi (termasuk Alasan Penolakan)
    const handleViewDetail = (transaction) => {
        let detailMessage = `Detail Transaksi: ${transaction.id}\n`;
        detailMessage += `Pelanggan: ${transaction.customerName}\n`;
        detailMessage += `Nominal: ${formatRupiah(transaction.amount)}\n`;
        detailMessage += `Status: ${getStageStyles(transaction.stage).text}\n`;
        
        if (transaction.stage === 'DITOLAK' && transaction.rejectionReason) {
            detailMessage += `\nAlasan Penolakan: ${transaction.rejectionReason}`;
        }
        
        // Mengganti console.log dengan alert/modal sederhana untuk menampilkan info
        window.alert(detailMessage); 
    };

    // 5. Lihat Bukti Pembayaran
    const handleViewProof = (proofImage, id) => {
        // Karena kita tidak bisa menampilkan modal gambar di lingkungan ini,
        // kita simulasikan dengan alert yang menunjukkan URL gambar
        window.alert(`Bukti Pembayaran untuk TRX ${id}:\n\nURL Bukti: ${proofImage}\n\n(Di aplikasi nyata, ini akan menampilkan modal gambar penuh)`);
        console.log(`Melihat bukti pembayaran: ${proofImage}`);
    };

    // 6. Export Data Selesai
    const handleExportCompleted = () => {
        const completedData = transactions.filter(t => t.stage === 'SELESAI');
        
        if (completedData.length === 0) {
            window.alert('Tidak ada data transaksi yang berstatus SELESAI untuk diexport.');
            return;
        }
        
        const csv = convertToCSV(completedData);
        
        // Membuat Blob dan URL untuk diunduh
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Laporan_Transaksi_Selesai_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Data transaksi selesai berhasil diexport.');
    };
    
    // Hitung jumlah item per tab
    const tabCounts = useMemo(() => {
        const counts = { ALL: transactions.length };
        tabs.forEach(tab => {
            if (tab.key !== 'ALL') {
                counts[tab.key] = transactions.filter(t => t.stage === tab.key).length;
            }
            // Pastikan DITOLAK dihitung dengan benar
        });
        return counts;
    }, [transactions, tabs]);


    // Filter dan cari transaksi berdasarkan tab aktif
    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => currentTab === 'ALL' || t.stage === currentTab)
            .filter(t => 
                t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [currentTab, searchTerm, transactions]);

    return (
        <div className="min-h-screen p-6 md:p-10 bg-gray-100 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Page */}
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <Package className="w-7 h-7 mr-3 text-amber-600" /> 
                            Manajemen Pesanan
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Kelola alur transaksi dan verifikasi bukti pembayaran pelanggan.
                        </p>
                    </div>
                    {/* Search di header */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari sesuatu..."
                            className="h-10 w-64 pl-10 pr-4 rounded-full bg-white border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Main Content Card - Gaya Pill Button */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
                    
                    {/* Filter, Export, dan Total Data */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex flex-wrap gap-3">
                            {tabs.map(tab => (
                                <TabButton 
                                    key={tab.key}
                                    label={tab.label}
                                    stageKey={tab.key}
                                    currentStage={currentTab}
                                    setStage={setCurrentTab}
                                    count={tabCounts[tab.key]}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleExportCompleted}
                                className="h-10 px-5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center shadow-sm text-sm"
                                title="Export hanya data yang berstatus SELESAI"
                            >
                                <Download className="w-4 h-4 mr-2" /> Export Data Selesai
                            </button>
                            <p className="text-gray-500 text-sm font-medium whitespace-nowrap">
                                Total Data: {filteredTransactions.length}
                            </p>
                        </div>
                    </div>

                    {/* Tabel Transaksi */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-amber-50">
                                <tr>
                                    {['ID Transaksi', 'Pelanggan', 'Nominal', 'Jatuh Tempo', 'Status', 'Aksi'].map(header => (
                                        <th 
                                            key={header} 
                                            className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-amber-200"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map(t => {
                                        const stageInfo = getStageStyles(t.stage);
                                        return (
                                            <tr key={t.id} className="hover:bg-amber-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                                    <User className="w-4 h-4 mr-2 text-gray-400" /> {t.customerName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{formatRupiah(t.amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 inline mr-1 text-gray-400" /> {t.dueDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${stageInfo.color} ${stageInfo.bg}`}>
                                                        <stageInfo.icon className="w-3 h-3 mr-1" /> {stageInfo.text}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                                    {/* Aksi hanya untuk status MENUNGGU VERIFIKASI */}
                                                    {t.stage === 'MENUNGGU_VERIFIKASI' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleViewProof(t.proofImage, t.id)}
                                                                className="text-gray-700 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-md text-xs flex items-center"
                                                                title="Lihat Bukti Pembayaran"
                                                            >
                                                                <Image className="w-4 h-4 inline mr-1" /> Bukti
                                                            </button>
                                                            <button 
                                                                onClick={() => handleVerifyPayment(t.id)}
                                                                className="text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-md text-xs"
                                                                title="Terima Pembayaran"
                                                            >
                                                                <CheckCircle className="w-4 h-4 inline mr-1" /> Terima
                                                            </button>
                                                            <button 
                                                                onClick={() => handleRejectPayment(t.id)}
                                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-md text-xs"
                                                                title="Tolak Pembayaran"
                                                            >
                                                                <XCircle className="w-4 h-4 inline mr-1" /> Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {/* Aksi hanya untuk status DIPROSES */}
                                                    {t.stage === 'DIPROSES' && (
                                                        <button 
                                                            onClick={() => handleCompleteOrder(t.id)}
                                                            className="text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-md text-xs"
                                                            title="Tandai Pesanan Selesai"
                                                        >
                                                            Selesai
                                                        </button>
                                                    )}
                                                    
                                                    {/* Tombol Lihat Detail untuk semua status selain Menunggu Verifikasi */}
                                                    {t.stage !== 'MENUNGGU_VERIFIKASI' && (
                                                        <button 
                                                            onClick={() => handleViewDetail(t)}
                                                            className="text-gray-500 hover:text-gray-800 px-3 py-1.5 transition-colors text-xs flex items-center border border-gray-300 rounded-lg hover:bg-gray-50"
                                                            title="Lihat Detail Transaksi"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" /> Detail
                                                        </button>
                                                    )}

                                                     {/* Tampilkan Alasan Penolakan di kolom Aksi untuk status DITOLAK */}
                                                     {t.stage === 'DITOLAK' && (
                                                        <span className="text-red-500 text-xs italic ml-2 max-w-[150px] truncate" title={t.rejectionReason}>
                                                            Alasan: {t.rejectionReason || 'Tidak ada alasan'}
                                                        </span>
                                                     )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-lg italic">
                                            <div className="w-full flex flex-col items-center justify-center">
                                                <Filter className="w-8 h-8 mb-3 text-gray-300" />
                                                Tidak ada data transaksi di tahap ini.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}