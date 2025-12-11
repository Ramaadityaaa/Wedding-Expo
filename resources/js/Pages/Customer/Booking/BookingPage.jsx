import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
    const [vendors, setVendors] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Error message state

    // Mengambil daftar vendor dan paket
    useEffect(() => {
        axios.get('/api/vendors')
            .then(response => setVendors(response.data))
            .catch(error => setErrorMessage('Gagal memuat vendor'));

        axios.get('/api/packages')
            .then(response => setPackages(response.data))
            .catch(error => setErrorMessage('Gagal memuat paket'));
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi jika ada data yang belum dipilih
        if (!selectedVendor || !selectedPackage || !orderDate) {
            setErrorMessage('Semua kolom harus diisi!');
            return;
        }

        // Reset error message jika semua kolom sudah diisi
        setErrorMessage('');

        // Kirim data order ke backend
        axios.post('/api/orders', {
            vendor_id: selectedVendor,
            package_id: selectedPackage,
            order_date: orderDate
        })
        .then(response => {
            alert('Order berhasil dibuat!');
            // Reset form setelah order berhasil
            setSelectedVendor('');
            setSelectedPackage('');
            setOrderDate('');
        })
        .catch(error => {
            alert('Terjadi kesalahan!');
            console.error(error);
        });
    };

    return (
        <div>
            <h1>Order Wedding Package</h1>

            {/* Tampilkan pesan error jika ada */}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Vendor</label>
                    <select 
                        onChange={(e) => setSelectedVendor(e.target.value)} 
                        value={selectedVendor}>
                        <option value="">Pilih Vendor</option>
                        {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Package</label>
                    <select 
                        onChange={(e) => setSelectedPackage(e.target.value)} 
                        value={selectedPackage}>
                        <option value="">Pilih Paket</option>
                        {packages.map(pkg => (
                            <option key={pkg.id} value={pkg.id}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Tanggal Pemesanan</label>
                    <input 
                        type="date" 
                        onChange={(e) => setOrderDate(e.target.value)} 
                        value={orderDate} 
                    />
                </div>
                <button type="submit">Lanjut Ke Pembayaran</button>
            </form>
        </div>
    );
};

export default BookingPage;
