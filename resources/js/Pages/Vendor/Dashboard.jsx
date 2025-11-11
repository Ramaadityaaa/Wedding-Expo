import React, { useState } from 'react';
// PERBAIKAN 1: Tambahkan <Link> dari Inertia
import { Link } from '@inertiajs/react'; 
import { 
  FaUser, 
  FaImages, 
  FaBoxOpen, 
  FaComments, 
  FaHome,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaStar,
  FaReply
} from 'react-icons/fa';

// Terima props dari controller (meskipun Anda menggunakan data dummy untuk saat ini)
export default function VendorDashboard({ auth, products = [], orders = [] }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [replyingToReview, setReplyingToReview] = useState(null);
  
  // PERBAIKAN 3: State untuk form balasan (reply)
  const [replyText, setReplyText] = useState('');

  // Data dummy (sudah benar, biarkan saja)
  const [vendorProfile, setVendorProfile] = useState({
    name: 'Elegant Wedding Organizer',
    email: 'info@elegantwedding.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    description: 'Kami adalah wedding organizer profesional...',
    logo: 'https://picsum.photos/seed/vendorlogo/200/200.jpg',
    coverPhoto: 'https://picsum.photos/seed/vendorcover/1200/400.jpg',
    socialMedia: {
      instagram: '@elegantwedding',
      facebook: 'Elegant Wedding',
      tiktok: '@elegantweddingid'
    }
  });
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, type: 'image', url: 'https://picsum.photos/seed/wedding1/400/300.jpg', title: 'Pernikahan Adat Jawa' },
    { id: 2, type: 'image', url: 'https://picsum.photos/seed/wedding2/400/300.jpg', title: 'Pernikahan Modern' },
    { id: 3, type: 'video', url: 'https://picsum.photos/seed/wedding3/400/300.jpg', title: 'Pernikahan Internasional' },
  ]);
  const [packages, setPackages] = useState([
    {
      id: 1, name: 'Paket Silver', price: 'Rp 25.000.000', description: 'Paket hemat...',
      features: ['Dekorasi sederhana', 'MC dan Musik Akustik', 'Dokumentasi 1 fotografer', 'Makanan 200 porsi']
    },
    {
      id: 2, name: 'Paket Gold', price: 'Rp 50.000.000', description: 'Paket lengkap...',
      features: ['Dekorasi mewah', 'MC, Band, dan Penari Tradisional', 'Dokumentasi 2 fotografer + videografer', 'Makanan 500 porsi', 'Tenda AC']
    },
  ]);
  const [reviews, setReviews] = useState([
    {
      id: 1, name: 'Andi & Siti', date: '15 Mei 2023', rating: 5,
      comment: 'Pelayanan sangat memuaskan! Tim sangat profesional...',
      reply: 'Terima kasih atas kepercayaan Anda. Kami senang bisa menjadi bagian dari hari bahagia Anda!'
    },
    {
      id: 2, name: 'Budi & Maya', date: '2 April 2023', rating: 4,
      comment: 'Dekorasi sangat indah dan sesuai...',
      reply: null
    },
  ]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', description: '', features: [''] });
  const [newPortfolioItem, setNewPortfolioItem] = useState({ type: 'image', url: '', title: '' });
  const [profileForm, setProfileForm] = useState({ ...vendorProfile });


  // Logika handler (sudah benar, tidak perlu diubah)
  const handleSaveProfile = () => {
    setVendorProfile({ ...profileForm });
    setIsEditingProfile(false);
  };
  const handleAddPackage = () => {
    if (newPackage.name && newPackage.price) {
      const id = Math.max(...packages.map(p => p.id), 0) + 1;
      setPackages([...packages, { ...newPackage, id }]);
      setNewPackage({ name: '', price: '', description: '', features: [''] });
      setIsAddingPackage(false);
    }
  };
  const handleDeletePackage = (id) => {
    setPackages(packages.filter(p => p.id !== id));
  };
  const handleAddPortfolioItem = () => {
    if (newPortfolioItem.url && newPortfolioItem.title) {
      const id = Math.max(...portfolioItems.map(p => p.id), 0) + 1;
      setPortfolioItems([...portfolioItems, { ...newPortfolioItem, id }]);
      setNewPortfolioItem({ type: 'image', url: '', title: '' });
      setIsAddingPortfolio(false);
    }
  };
  const handleDeletePortfolioItem = (id) => {
    setPortfolioItems(portfolioItems.filter(p => p.id !== id));
  };
  const handleAddFeature = () => {
    setNewPackage({ ...newPackage, features: [...newPackage.features, ''] });
  };
  const handleUpdateFeature = (index, value) => {
    const updatedFeatures = [...newPackage.features];
    updatedFeatures[index] = value;
    setNewPackage({ ...newPackage, features: updatedFeatures });
  };
  const handleRemoveFeature = (index) => {
    const updatedFeatures = newPackage.features.filter((_, i) => i !== index);
    setNewPackage({ ...newPackage, features: updatedFeatures });
  };
  const handleReplyToReview = (reviewId, replyText) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, reply: replyText } : review
    ));
    setReplyingToReview(null);
  };


  // --- Bagian Render Tab ---

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profil Vendor</h2>
        {!isEditingProfile ? (
          // PERBAIKAN 4: Tema diubah ke Kuning
          <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
            <FaEdit /> Edit Profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
              <FaSave /> Simpan
            </button>
            <button onClick={() => { setIsEditingProfile(false); setProfileForm({ ...vendorProfile }); }} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              <FaTimes /> Batal
            </button>
          </div>
        )}
      </div>
      
      {/* Form Profil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Vendor */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nama Vendor</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          ) : ( <p className="text-gray-800">{vendorProfile.name}</p> )}
        </div>
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          {isEditingProfile ? (
            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          ) : ( <p className="text-gray-800">{vendorProfile.email}</p> )}
        </div>
        {/* Telepon */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nomor Telepon</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          ) : ( <p className="text-gray-800">{vendorProfile.phone}</p> )}
        </div>
        {/* Alamat */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Alamat</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          ) : ( <p className="text-gray-800">{vendorProfile.address}</p> )}
        </div>
        {/* Deskripsi */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
          {isEditingProfile ? (
            <textarea value={profileForm.description} onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} rows="4" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
          ) : ( <p className="text-gray-800">{vendorProfile.description}</p> )}
        </div>
        {/* Logo */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Logo</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.logo} onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          ) : ( <img src={vendorProfile.logo} alt="Logo" className="h-20 w-20 object-cover rounded" /> )}
        </div>
        {/* Cover */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Foto Sampul</label>
          {isEditingProfile ? (
            <input type="text" value={profileForm.coverPhoto} onChange={(e) => setProfileForm({ ...profileForm, coverPhoto: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          ) : ( <img src={vendorProfile.coverPhoto} alt="Cover" className="h-20 w-32 object-cover rounded" /> )}
        </div>
        {/* Social Media */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Media Sosial</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <label className="block text-gray-600 text-sm mb-1">Instagram</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileForm.socialMedia.instagram}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialMedia: { ...profileForm.socialMedia, instagram: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ) : (
                <p className="text-gray-800">{vendorProfile.socialMedia.instagram}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Facebook</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileForm.socialMedia.facebook}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialMedia: { ...profileForm.socialMedia, facebook: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ) : (
                <p className="text-gray-800">{vendorProfile.socialMedia.facebook}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">TikTok</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileForm.socialMedia.tiktok}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialMedia: { ...profileForm.socialMedia, tiktok: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ) : (
                <p className="text-gray-800">{vendorProfile.socialMedia.tiktok}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Portofolio</h2>
        {!isAddingPortfolio ? (
          <button onClick={() => setIsAddingPortfolio(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
            <FaPlus /> Tambah Item
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleAddPortfolioItem} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"> <FaSave /> Simpan </button>
            <button onClick={() => { setIsAddingPortfolio(false); setNewPortfolioItem({ type: 'image', url: '', title: '' }); }} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"> <FaTimes /> Batal </button>
          </div>
        )}
      </div>

      {isAddingPortfolio && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tipe</label>
              <select
                value={newPortfolioItem.type}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="image">Gambar</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">URL</label>
              <input
                type="text"
                value={newPortfolioItem.url}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, url: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Judul</label>
              <input
                type="text"
                value={newPortfolioItem.title}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioItems.map(item => (
          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="relative">
              <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-full p-3">
                    {/* --- PERBAIKAN 2: Atribut SVG diubah ke camelCase --- */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLineCap="round" strokeLineJoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLineCap="round" strokeLineJoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {/* ------------------------------------------------ */}
                  </div>
                </div>
              )}
              <button onClick={() => handleDeletePortfolioItem(item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                <FaTrash />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">Tipe: {item.type === 'image' ? 'Gambar' : 'Video'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPackagesTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Paket</h2>
        {!isAddingPackage ? (
          <button onClick={() => setIsAddingPackage(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
            <FaPlus /> Tambah Paket
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleAddPackage} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"> <FaSave /> Simpan </button>
            <button onClick={() => { setIsAddingPackage(false); setNewPackage({ name: '', price: '', description: '', features: [''] }); }} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"> <FaTimes /> Batal </button>
          </div>
        )}
      </div>

      {isAddingPackage && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nama Paket</label>
              <input type="text" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Harga</label>
              <input type="text" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
            <input type="text" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fitur</label>
            {newPackage.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleUpdateFeature(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {newPackage.features.length > 1 && (
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddFeature}
              className="mt-2 bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition"
            >
              Tambah Fitur
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-100 p-4 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-800">{pkg.name}</h3>
              <button onClick={() => handleDeletePackage(pkg.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                <FaTrash />
              </button>
            </div>
            <div className="p-4">
              {/* PERBAIKAN 4: Ganti tema warna harga */}
              <div className="text-2xl font-bold text-yellow-700 mb-2">{pkg.price}</div>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tinjau Ulasan</h2>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{review.name}</h3>
                <p className="text-sm text-gray-600">{review.date}</p>
              </div>
          _ <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>
            {review.reply ? (
              // PERBAIKAN 4: Ganti tema balasan
              <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-300">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Balasan Anda:</p>
                <p className="text-gray-700">{review.reply}</p>
              </div>
            ) : (
              <div>
                {replyingToReview === review.id ? (
                // --- PERBAIKAN 3: Form balasan diubah ---
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tulis balasan Anda..."
                      value={replyText} // Gunakan state
                      onChange={(e) => setReplyText(e.target.value)} // Gunakan state
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      onClick={() => {
                        if (replyText) {
                          handleReplyToReview(review.id, replyText);
                          setReplyText(''); // Kosongkan state
                        }
                      }}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FaReply />
                    </button>
                    <button
                      onClick={() => setReplyingToReview(null)}
                      className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition"
      _           >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setReplyingToReview(review.id);
                      setReplyText(''); // Pastikan kosong saat dibuka
                    }}
                    className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800 transition text-sm"
                  >
                    <FaReply /> Balas
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* PERBAIKAN 4: Ganti tema warna Header */}
            <div className="bg-yellow-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* PERBAIKAN 2: Atribut SVG diubah ke camelCase */}
              <path strokeLineCap="round" strokeLineJoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WeddingExpo</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Selamat datang, {vendorProfile.name}</span>
            {/* PERBAIKAN 1: Tombol Logout diubah ke <Link> */}
            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
              <FaSignOutAlt /> Keluar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {/* PERBAIKAN 4: Ganti tema warna Sidebar */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaUser /> Profil
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'portfolio' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaImages /> Portofolio
                </button>
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'packages' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaBoxOpen /> Paket
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'reviews' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700 hover:bg-gray-100'}`}
M             >
                  <FaComments /> Ulasan
                </button>
                {/* PERBAIKAN 1: Tombol Halaman Publik diubah ke <Link> */}
                <Link
                  href="/"
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 hover:bg-gray-100`}
A             >
                  <FaHome /> Lihat Halaman Publik
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'portfolio' && renderPortfolioTab()}
            {activeTab === 'packages' && renderPackagesTab()}
            {activeTab === 'reviews' && renderReviewsTab()}
          </main>
        </div>
      </div>
    </div>
  );
}