import React, { useState, useEffect, useCallback } from 'react';
import { Archive, Package, Image, UserCog, MessageSquareText, Save, Trash2, PackagePlus, ImagePlus, LogOut, Edit2, X, Check } from 'lucide-react';

// --- KONFIGURASI API (Simulasi Laravel Backend) ---
const API_BASE_URL = 'http://localhost:8000/api/vendor';
const AUTH_TOKEN = 'your_laravel_auth_token_here_12345';
const USER_ID_SIMULATION = 'vendor-wo-001-react';

const DEFAULT_INITIAL_DATA = {
    profile: {
        vendorName: `WO ID: ${USER_ID_SIMULATION.substring(0, 8)}... (Laravel)`,
        description: 'Kami adalah Wedding Organizer profesional yang berdedikasi untuk mewujudkan pernikahan impian Anda.',
        contactInfo: 'Email: contact@example.com | Telepon: +62 812 XXXX XXXX',
        logoUrl: 'https://placehold.co/100x100/FBBF24/664400?text=LOGO',
        coverUrl: 'https://placehold.co/1200x300/FBBF24/664400?text=FOTO+SAMPUL',
    },
    packages: [
        { id: 'pkg-1', name: 'Paket Silver', price: 'Rp 25.000.000', services: 'Dekorasi standar, Katering 100 pax, WO Hari-H' },
        { id: 'pkg-2', name: 'Paket Gold', price: 'Rp 50.000.000', services: 'Dekorasi mewah, Katering 300 pax, Full Service WO' },
    ],
    portfolio: [
        { id: 'port-1', type: 'photo', url: 'https://placehold.co/300x200/FBBF24/664400?text=PREWED+Sesi+1' },
        { id: 'port-2', type: 'photo', url: 'https://placehold.co/300x200/FBBF24/664400?text=RESEPSI+Modern' },
    ],
    reviews: [
        { id: 'rev-1', userName: 'Budi Santoso', rating: 5, date: '2024-05-10', comment: 'Pelayanan sangat memuaskan, pernikahan berjalan lancar!', reply: null },
        { id: 'rev-2', userName: 'Siti Aisyah', rating: 4, date: '2024-04-21', comment: 'Konsep dekorasi bagus, hanya sedikit miskomunikasi di awal.', reply: 'Terima kasih atas masukannya, kami akan tingkatkan koordinasi tim!' },
    ]
};

const Alert = ({ type, message }) => {
    if (!message) return null;
    const colorMap = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
    };
    return (
        <div className={`p-3 rounded-lg border shadow-md mb-2 ${colorMap[type]}`}>
            {message}
        </div>
    );
};

const App = () => {
    const [vendorData, setVendorData] = useState(null);
    const [currentTab, setCurrentTab] = useState('profile');
    const [userId, setUserId] = useState(USER_ID_SIMULATION);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const alertUser = useCallback((type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    }, []);

    const fetchVendorData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVendorData(data);
        } catch (error) {
            console.error("Error fetching vendor data, using mock data:", error);
            alertUser('warning', 'Gagal terhubung ke API Laravel. Menggunakan data statis.');
            setVendorData(DEFAULT_INITIAL_DATA);
        } finally {
            setIsLoading(false);
        }
    }, [alertUser]);

    useEffect(() => {
        fetchVendorData();
    }, [fetchVendorData]);

    const apiCall = async (endpoint, method, body = null, isFileUpload = false) => {
        try {
            const options = {
                method,
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                },
            };

            if (isFileUpload) {
                options.body = body;
            } else {
                options.headers['Content-Type'] = 'application/json';
                if (body) {
                    options.body = JSON.stringify(body);
                }
            }

            const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.message || 'Terjadi kesalahan pada server.';
                throw new Error(errorMessage);
            }

            alertUser('success', responseData.message || 'Operasi berhasil!');
            return responseData.data;

        } catch (error) {
            console.error(`Error ${method} ${endpoint}:`, error.message);
            alertUser('error', `Gagal: ${error.message}`);
            return null;
        }
    };

    const saveProfile = async (profileData, logoFile, coverFile) => {
        const formData = new FormData();
        formData.append('vendorName', profileData.vendorName);
        formData.append('description', profileData.description);
        formData.append('contactInfo', profileData.contactInfo);
        if (logoFile) {
            formData.append('logo', logoFile);
        }
        if (coverFile) {
            formData.append('cover', coverFile);
        }
        const updatedData = await apiCall('profile', 'POST', formData, true);
        if (updatedData) {
            setVendorData(prev => ({ ...prev, profile: updatedData }));
        }
    };

    const addPortfolioItem = async (url) => {
        if (!url) return alertUser('warning', 'URL tidak boleh kosong.');
        const newItem = { url, type: 'photo' };
        const updatedPortfolio = await apiCall('portfolio', 'POST', newItem);
        if (updatedPortfolio) {
            setVendorData(prev => ({ ...prev, portfolio: updatedPortfolio }));
            return true;
        }
        return false;
    };

    const deletePortfolioItem = async (id) => {
        const updatedPortfolio = await apiCall(`portfolio/${id}`, 'DELETE');
        if (updatedPortfolio) {
            setVendorData(prev => ({ ...prev, portfolio: updatedPortfolio }));
        }
    };

    const addPackage = async (newPackage) => {
        const updatedPackages = await apiCall('packages', 'POST', newPackage);
        if (updatedPackages) {
            setVendorData(prev => ({ ...prev, packages: updatedPackages }));
            return true;
        }
        return false;
    };
    
    const deletePackage = async (id) => {
        const updatedPackages = await apiCall(`packages/${id}`, 'DELETE');
        if (updatedPackages) {
            setVendorData(prev => ({ ...prev, packages: updatedPackages }));
        }
    };
    
    const updatePackage = async (updatedPackage) => {
        const updatedPackages = await apiCall(`packages/${updatedPackage.id}`, 'PUT', updatedPackage);
        if (updatedPackages) {
            setVendorData(prev => ({ ...prev, packages: updatedPackages }));
        }
    };

    const replyToReview = async (reviewId, replyText) => {
        const payload = { reply: replyText };
        const updatedReviews = await apiCall(`reviews/${reviewId}/reply`, 'POST', payload);
        if (updatedReviews) {
            setVendorData(prev => ({ ...prev, reviews: updatedReviews }));
        }
    };

    // --- KOMPONEN TAB ANAK ---

    // TAMBAHAN: Komponen untuk Halaman Pratinjau Publik
    const PublicPreviewTab = () => {
        if (!vendorData) return null;
        const { profile, packages, portfolio, reviews } = vendorData;

        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Pratinjau Halaman Publik</h2>
                <p className="text-sm text-gray-500">Ini adalah tampilan profil Anda yang dilihat oleh calon klien.</p>
                
                {/* Header Section */}
                <div className="relative bg-white shadow-lg rounded-xl overflow-hidden">
                    <img src={profile.coverUrl} alt="Cover" className="w-full h-64 object-cover" onError={(e) => e.target.src = 'https://placehold.co/1200x300/FBBF24/664400?text=FOTO+SAMPUL'} />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-end space-x-4">
                            <img src={profile.logoUrl} alt="Logo" className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg" onError={(e) => e.target.src = 'https://placehold.co/100x100/FBBF24/664400?text=LOGO'} />
                            <div className="text-white">
                                <h1 className="text-4xl font-bold">{profile.vendorName}</h1>
                                <p className="text-lg">{profile.contactInfo}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-semibold mb-4 text-amber-700">Tentang Kami</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{profile.description}</p>
                </div>

                {/* Packages Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-semibold mb-4 text-amber-700">Paket Harga</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {packages.map(pkg => (
                            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                                <h4 className="text-xl font-bold text-amber-700">{pkg.name}</h4>
                                <p className="text-2xl font-extrabold text-gray-800 my-2">{pkg.price}</p>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{pkg.services}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Portfolio Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-semibold mb-4 text-amber-700">Portofolio Kami</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {portfolio.map(item => (
                            <img key={item.id} src={item.url} alt="Portfolio" className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" onError={(e) => e.target.src = 'https://placehold.co/300x200/FBBF24/664400?text=PLACEHOLDER'} />
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-semibold mb-4 text-amber-700">Apa Kata Mereka</h3>
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-gray-800">{review.userName}</p>
                                    <div className="text-amber-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                                <p className="text-gray-700 italic">"{review.comment}"</p>
                                {review.reply && (
                                    <div className="mt-3 p-3 bg-gray-50 border-l-4 border-amber-500 rounded">
                                        <p className="font-medium text-amber-700 text-sm">Balasan Vendor:</p>
                                        <p className="text-gray-600 text-sm mt-1">{review.reply}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const ProfileTab = () => {
        const [profile, setProfile] = useState(vendorData.profile);
        const [logoFile, setLogoFile] = useState(null);
        const [coverFile, setCoverFile] = useState(null);
        const [logoPreview, setLogoPreview] = useState(vendorData.profile.logoUrl);
        const [coverPreview, setCoverPreview] = useState(vendorData.profile.coverUrl);

        useEffect(() => {
            setProfile(vendorData.profile);
            setLogoPreview(vendorData.profile.logoUrl);
            setCoverPreview(vendorData.profile.coverUrl);
            setLogoFile(null);
            setCoverFile(null);
        }, [vendorData.profile]);

        const handleChange = (e) => {
            const { id, value } = e.target;
            setProfile(prev => ({ ...prev, [id.replace('profile-', '')]: value }));
        };

        const handleFileChange = (e, type) => {
            const file = e.target.files[0];
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                if (type === 'logo') {
                    setLogoFile(file);
                    setLogoPreview(previewUrl);
                } else {
                    setCoverFile(file);
                    setCoverPreview(previewUrl);
                }
            }
        };

        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Edit Profil Vendor</h2>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Foto Sampul & Logo</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL Foto Sampul (Rekomendasi 1200x300)</label>
                        <img src={coverPreview} alt="Foto Sampul" className="w-full h-40 object-cover rounded-lg border border-gray-200" onError={(e) => e.target.src = 'https://placehold.co/1200x300/FBBF24/664400?text=FOTO+SAMPUL'} />
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'cover')}
                            accept="image/*" 
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                    </div>
                    
                    <div className="flex items-start space-x-4 pt-4 border-t border-gray-100">
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pratinjau Logo</label>
                            <img src={logoPreview} alt="Logo" className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md" onError={(e) => e.target.src = 'https://placehold.co/100x100/FBBF24/664400?text=LOGO'} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">URL Logo (Rekomendasi 1:1)</label>
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, 'logo')}
                                accept="image/*" 
                                className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Info Dasar & Deskripsi</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="profile-vendorName" className="block text-sm font-medium text-gray-700">Nama Vendor</label>
                            <input type="text" id="profile-vendorName" value={profile.vendorName} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"/>
                        </div>
                        <div>
                            <label htmlFor="profile-description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                            <textarea id="profile-description" rows="4" value={profile.description} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"></textarea>
                        </div>
                        <div>
                            <label htmlFor="profile-contactInfo" className="block text-sm font-medium text-gray-700">Info Kontak</label>
                            <input type="text" id="profile-contactInfo" value={profile.contactInfo} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"/>
                        </div>
                    </div>
                </div>
                
                <button onClick={() => saveProfile(profile, logoFile, coverFile)} className="w-full py-3 px-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition duration-150 shadow-md shadow-amber-200">
                    <Save className="inline-block w-5 h-5 mr-2" /> Simpan Perubahan Profil
                </button>
            </div>
        );
    };

    const PortfolioTab = () => {
        const [newUrl, setNewUrl] = useState('');

        const handleAdd = async () => {
            const success = await addPortfolioItem(newUrl);
            if (success) {
                setNewUrl('');
            }
        };

        const handleDelete = (id) => {
            deletePortfolioItem(id);
        };

        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Manajemen Portofolio</h2>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Tambah Media Baru</h3>
                    <div className="space-y-4">
                        <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="URL Foto/Video (Contoh: https://placehold.co/300x200)" className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"/>
                        <button onClick={handleAdd} className="py-2 px-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition duration-150 shadow-md shadow-amber-200">
                            <ImagePlus className="inline-block w-5 h-5 mr-2" /> Tambah ke Portofolio
                        </button>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Galeri Portofolio ({vendorData.portfolio.length} Item)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vendorData.portfolio.map(item => (
                            <div key={item.id} className="relative group overflow-hidden rounded-lg"> 
                                <img 
                                    src={item.url} 
                                    alt="Portofolio" 
                                    className="w-full h-40 object-cover rounded-lg transition duration-300 group-hover:opacity-70"
                                    onError={(e) => e.target.src = 'https://placehold.co/300x200/FBBF24/664400?text=PLACEHOLDER'}
                                />
                                <button 
                                    onClick={() => handleDelete(item.id)} 
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300 shadow-xl hover:bg-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const PackagesTab = () => {
        const [newPackage, setNewPackage] = useState({ name: '', price: '', services: '' });
        const [editingPackageId, setEditingPackageId] = useState(null);
        const [editFormData, setEditFormData] = useState({});

        const handleChangeNew = (e) => {
            const { name, value } = e.target;
            setNewPackage(prev => ({ ...prev, [name]: value }));
        };

        const handleChangeEdit = (e) => {
            const { name, value } = e.target;
            setEditFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleAdd = async () => {
            if (!newPackage.name || !newPackage.price || !newPackage.services) {
                return alertUser('warning', 'Semua kolom paket harus diisi.');
            }
            const success = await addPackage(newPackage); 
            if (success) {
                setNewPackage({ name: '', price: '', services: '' });
            }
        };
        
        const handleDelete = (pkgId) => {
            deletePackage(pkgId);
        };

        const handleEdit = (pkg) => {
            setEditingPackageId(pkg.id);
            setEditFormData({ name: pkg.name, price: pkg.price, services: pkg.services, id: pkg.id });
        };

        const handleCancelEdit = () => {
            setEditingPackageId(null);
            setEditFormData({});
        };

        const handleSaveEdit = async () => {
            if (!editFormData.name || !editFormData.price || !editFormData.services) {
                return alertUser('warning', 'Semua kolom paket harus diisi.');
            }
            await updatePackage(editFormData);
            setEditingPackageId(null);
            setEditFormData({});
        };

        const PackageCard = ({ pkg }) => {
            const isEditing = editingPackageId === pkg.id;

            return (
                <div className="bg-white p-5 rounded-xl shadow border border-gray-100 transition duration-300 hover:shadow-lg">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                name="name" 
                                value={editFormData.name} 
                                onChange={handleChangeEdit} 
                                placeholder="Nama Paket" 
                                className="block w-full p-2 border border-amber-500 rounded-lg focus:ring-amber-500 text-lg font-bold"
                            />
                            <input 
                                type="text" 
                                name="price" 
                                value={editFormData.price} 
                                onChange={handleChangeEdit} 
                                placeholder="Harga" 
                                className="block w-full p-2 border border-amber-500 rounded-lg focus:ring-amber-500 text-xl font-extrabold"
                            />
                            <textarea 
                                name="services" 
                                rows="3" 
                                value={editFormData.services} 
                                onChange={handleChangeEdit} 
                                placeholder="Detail Layanan" 
                                className="block w-full p-2 border border-amber-500 rounded-lg focus:ring-amber-500 text-gray-600 text-sm whitespace-pre-wrap"
                            />
                            <div className="flex space-x-2 pt-2">
                                <button onClick={handleSaveEdit} className="flex items-center text-sm py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150">
                                    <Check className="w-4 h-4 mr-1" /> Simpan
                                </button>
                                <button onClick={handleCancelEdit} className="flex items-center text-sm py-1 px-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-150">
                                    <X className="w-4 h-4 mr-1" /> Batal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-lg font-bold text-amber-700">{pkg.name}</p>
                                    <p className="text-2xl font-extrabold text-gray-800 my-1">{pkg.price}</p>
                                </div>
                                <div className="flex space-x-1">
                                    <button onClick={() => handleEdit(pkg)} className="text-amber-500 hover:text-amber-700 transition duration-150 p-2 rounded-full hover:bg-amber-50">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-full hover:bg-red-50">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-3 text-gray-600 text-sm whitespace-pre-wrap">{pkg.services}</p>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Manajemen Paket Harga</h2>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Tambah Paket Baru</h3>
                    <div className="space-y-4">
                        <input type="text" name="name" value={newPackage.name} onChange={handleChangeNew} placeholder="Nama Paket (cth: Paket Platinum)" className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"/>
                        <input type="text" name="price" value={newPackage.price} onChange={handleChangeNew} placeholder="Harga (cth: Rp 80.000.000)" className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"/>
                        <textarea name="services" rows="3" value={newPackage.services} onChange={handleChangeNew} placeholder="Detail Layanan (cth: Full WO, 500 pax katering, dll.)" className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"></textarea>
                        <button onClick={handleAdd} className="py-2 px-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition duration-150 shadow-md shadow-amber-200">
                            <PackagePlus className="inline-block w-5 h-5 mr-2" /> Tambah Paket
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Daftar Paket Aktif ({vendorData.packages.length} Paket)</h3>
                    {vendorData.packages.map(pkg => (
                        <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
            </div>
        );
    };

    const ReviewsTab = () => {
        const [replyInputs, setReplyInputs] = useState({});
        const [editingReviewId, setEditingReviewId] = useState(null);
        const [editingReplyText, setEditingReplyText] = useState('');

        const handleReplyChange = (id, value) => {
            setReplyInputs(prev => ({ ...prev, [id]: value }));
        };

        const handleReplySubmit = async (reviewId) => {
            const replyText = replyInputs[reviewId]?.trim();
            if (!replyText) return alertUser('warning', 'Balasan tidak boleh kosong.');
            
            await replyToReview(reviewId, replyText);
            setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
        };
        
        const handleEditStart = (reviewId, currentReply) => {
            setEditingReviewId(reviewId);
            setEditingReplyText(currentReply);
        };

        const handleEditCancel = () => {
            setEditingReviewId(null);
            setEditingReplyText('');
        };

        const handleEditSave = async (reviewId) => {
            const newReplyText = editingReplyText.trim();
            if (!newReplyText) {
                 if (window.confirm("Balasan kosong, apakah Anda ingin menghapus balasan ini?")) {
                    await replyToReview(reviewId, null); 
                    handleEditCancel();
                 }
                 return;
            }
            
            await replyToReview(reviewId, newReplyText);
            handleEditCancel();
        };

        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Tinjau & Balas Ulasan</h2>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Ulasan Masuk</h3>
                    <div id="reviews-list" className="review-scroll space-y-6 pr-2 max-h-[60vh] overflow-y-auto">
                        {vendorData.reviews.length === 0 ? (
                            <p className="text-gray-500">Belum ada ulasan yang masuk.</p>
                        ) : (
                            vendorData.reviews.map(review => {
                                const isEditing = editingReviewId === review.id;

                                return (
                                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-800">{review.userName}</p>
                                            <div className="text-amber-500 text-lg">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                                        <p className="text-gray-700 italic mb-3">"{review.comment}"</p>
                                        
                                        {review.reply ? 
                                            <div className="mt-3 p-3 bg-gray-50 border-l-4 border-amber-500 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium text-amber-700">Balasan Anda:</p>
                                                    {!isEditing && (
                                                        <button 
                                                            onClick={() => handleEditStart(review.id, review.reply)} 
                                                            className="text-gray-500 hover:text-amber-600 transition duration-150 p-1 rounded-full hover:bg-amber-50"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {isEditing ? (
                                                    <div className="space-y-2 pt-2">
                                                        <textarea 
                                                            rows="3" 
                                                            value={editingReplyText}
                                                            onChange={(e) => setEditingReplyText(e.target.value)}
                                                            className="block w-full p-2 border border-amber-500 rounded-lg focus:ring-amber-500 text-gray-600 text-sm whitespace-pre-wrap"
                                                        />
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                onClick={() => handleEditSave(review.id)}
                                                                className="flex items-center text-sm py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150"
                                                            >
                                                                <Check className="w-4 h-4 mr-1" /> Simpan
                                                            </button>
                                                            <button 
                                                                onClick={handleEditCancel}
                                                                className="flex items-center text-sm py-1 px-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-150"
                                                            >
                                                                <X className="w-4 h-4 mr-1" /> Batal
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-600 text-sm whitespace-pre-wrap mt-1">{review.reply}</p>
                                                )}
                                            </div>
                                        : 
                                            (<div className="reply-form mt-3 space-y-2">
                                                <textarea 
                                                    rows="2" 
                                                    placeholder="Tulis balasan Anda di sini..." 
                                                    value={replyInputs[review.id] || ''}
                                                    onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                                    className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                                />
                                                <button 
                                                    onClick={() => handleReplySubmit(review.id)}
                                                    className="text-sm py-1 px-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-150"
                                                >
                                                    Kirim Balasan
                                                </button>
                                            </div>)
                                        }
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (!vendorData) return null;
        switch (currentTab) {
            case 'profile': return <ProfileTab />;
            case 'portfolio': return <PortfolioTab />;
            case 'packages': return <PackagesTab />;
            case 'reviews': return <ReviewsTab />;
            case 'public-preview': return <PublicPreviewTab />; // TAMBAHAN: Case untuk tab baru
            default: return <ProfileTab />;
        }
    };

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <div className="w-64 h-screen bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-amber-600">Wedding<span className="text-amber-400">Expo</span></h1>
                    <p id="vendor-name-display" className="text-xs text-gray-500 mt-2 truncate">{vendorData?.profile?.vendorName || 'Vendor Dashboard'}</p>
                    <p className="text-xs text-gray-400">ID: <span className="text-xs text-gray-500">{userId ? `${userId.substring(0, 8)}...` : 'Memuat...'}</span></p>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {[
                        { tab: 'profile', icon: UserCog, label: 'Edit Profil' },
                        { tab: 'portfolio', icon: Image, label: 'Portofolio' },
                        { tab: 'packages', icon: Package, label: 'Paket Harga' },
                        { tab: 'reviews', icon: MessageSquareText, label: 'Tinjau Ulasan' },
                        // TAMBAHAN: Navigasi baru untuk pratinjau publik
                        { tab: 'public-preview', icon: Archive, label: 'Pratinjau Publik' },
                    ].map(({ tab, icon: Icon, label }) => (
                        <button key={tab} onClick={() => setCurrentTab(tab)} className={`sidebar-item flex items-center p-3 rounded-xl transition duration-150 w-full text-left ${currentTab === tab ? 'bg-amber-100 text-amber-800 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}>
                            <Icon className="w-5 h-5 mr-3" /> {label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={() => alertUser('warning', 'Simulasi Logout. Hapus token di proyek nyata.')} className="flex items-center w-full p-3 text-red-500 rounded-xl hover:bg-red-50 transition duration-150">
                        <LogOut className="w-5 h-5 mr-3" /> Keluar
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Versi WO 1.0 (React/Laravel)</p>
                </div>
            </div>
            <div id="main-content" className="flex-1 p-8 overflow-y-auto">
                <div className="fixed top-4 right-4 z-50 w-full max-w-xs"><Alert type={alert.type} message={alert.message} /></div>
                <p className="text-right text-xs text-gray-400 mb-4">Anda login sebagai: <span className="font-mono text-gray-600 text-sm">{userId || 'Memuat...'}</span></p>
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center z-40">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                            <p className="mt-4 text-lg text-gray-600">Memuat Dashboard Vendor...</p>
                        </div>
                    </div>
                )}
                <div id="dashboard-content">{vendorData && renderContent()}</div>
            </div>
        </div>
    );
};

export default App;