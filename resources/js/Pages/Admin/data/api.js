// api.js (mock API / data)
// Based on the mock data from your Dashboard.jsx

const API_DELAY = 500;
const simulateApiCall = (data) => new Promise(resolve => setTimeout(() => resolve(data), API_DELAY));

export const MOCK_VENDORS = [
  { id: 'v1', name: 'WO Bunga Cinta', email: 'bunga@wo.com', phone: '081234567890', status: 'Pending', role: 'Vendor' },
  { id: 'v2', name: 'WO Emas Abadi', email: 'emas@wo.com', phone: '082198765432', status: 'Approved', role: 'Vendor' },
  { id: 'v3', name: 'WO Pelangi', email: 'pelangi@wo.com', phone: '085711223344', status: 'Pending', role: 'Vendor' },
  { id: 'v4', name: 'WO Silver Moon', email: 'silver@wo.com', phone: '089955667788', status: 'Rejected', role: 'Vendor' },
  { id: 'v5', name: 'WO Ceria Pesta', email: 'ceria@wo.com', phone: '081512345678', status: 'Approved', role: 'Membership' },
  { id: 'v6', name: 'WO Mega Indah', email: 'mega@wo.com', phone: '087812341234', status: 'Pending', role: 'Vendor' },
];

export const MOCK_REVIEWS = [
  { id: 'r1', vendorName: 'WO Emas Abadi', userName: 'Adi P.', content: 'Pelayanan sangat memuaskan!', status: 'Pending' },
  { id: 'r2', vendorName: 'WO Bunga Cinta', userName: 'Sari M.', content: 'Agak mahal tapi hasilnya bagus.', status: 'Approved' },
  { id: 'r3', vendorName: 'WO Pelangi', userName: 'Joko K.', content: 'Kurang responsif.', status: 'Pending' },
  { id: 'r4', vendorName: 'WO Emas Abadi', userName: 'Rina T.', content: 'Sangat direkomendasikan!', status: 'Approved' },
  { id: 'r5', vendorName: 'WO Pelangi', userName: 'Budi S.', content: 'Tidak sesuai ekspektasi.', status: 'Rejected' },
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Calon Pengantin A', email: 'cpa@mail.com', phone: '081111122222', status: 'Active' },
  { id: 'u2', name: 'Calon Pengantin B', email: 'cpb@mail.com', phone: '083333344444', status: 'Suspended' },
  { id: 'u3', name: 'Fotografer C', email: 'foto@mail.com', phone: '085555566666', status: 'Active' },
  { id: 'u4', name: 'Event Planner X', email: 'epx@mail.com', phone: '087712349876', status: 'Active' },
];

export const MOCK_PAYMENT_REQUESTS = [
  {
    id: 'p1',
    vendorId: 'v5',
    vendorName: 'WO Ceria Pesta',
    amount: 500000,
    currency: 'IDR',
    bankName: 'Bank Contoh',
    accountNumber: '1234567890',
    accountHolder: 'WO Ceria Pesta',
    proofImage: null,
    note: 'Pembayaran membership paket Gold - satu tahun',
    submittedAt: '2025-11-17T08:30:00+07:00',
    status: 'Pending'
  },
  {
    id: 'p2',
    vendorId: 'v1',
    vendorName: 'WO Bunga Cinta',
    amount: 250000,
    currency: 'IDR',
    bankName: 'Bank Contoh',
    accountNumber: '0987654321',
    accountHolder: 'Bunga Cinta',
    proofImage: null,
    note: 'Top-up membership - paket Silver',
    submittedAt: '2025-11-16T14:20:00+07:00',
    status: 'Pending'
  }
];

export const INITIAL_STATIC_CONTENT = {
  'Tentang Kami': 'Ini adalah platform direktori vendor terlengkap di Indonesia. Kami menghubungkan calon pengantin dengan vendor terbaik.',
  'Kontak Kami': 'Hubungi kami melalui email: admin@weddingexpo.co.id atau telepon: (021) 1234-5678.',
  'FAQ': 'Q: Bagaimana cara mendaftar? A: Klik tombol "Daftar Vendor" di sudut kanan atas. Q: Berapa biaya yang dikenakan? A: Biaya layanan bervariasi.'
};

export const fetchVendors = () => simulateApiCall(MOCK_VENDORS);
export const fetchReviews = () => simulateApiCall(MOCK_REVIEWS);
export const fetchUsers = () => simulateApiCall(MOCK_USERS);
export const fetchPaymentRequests = () => simulateApiCall(MOCK_PAYMENT_REQUESTS);
export const fetchStaticContent = () => simulateApiCall(INITIAL_STATIC_CONTENT);

// update/delete simulations
export const updateVendorStatus = (id, status) => simulateApiCall({ success: true, id, status });
export const deleteVendor = (id) => simulateApiCall({ success: true, id });
export const updateVendorRole = (id, role) => simulateApiCall({ success: true, id, role });

export const updateReviewStatus = (id, status) => simulateApiCall({ success: true, id, status });
export const deleteReview = (id) => simulateApiCall({ success: true, id });

export const updateUserStatus = (id, status) => simulateApiCall({ success: true, id, status });
export const deleteUser = (id) => simulateApiCall({ success: true, id });

export const updatePaymentRequestStatus = (id, status) => simulateApiCall({ success: true, id, status });
export const deletePaymentRequest = (id) => simulateApiCall({ success: true, id });

export const saveStaticContent = (key, value) => simulateApiCall({ success: true, key, value });
