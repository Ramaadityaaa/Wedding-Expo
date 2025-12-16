// resources/js/Components/ui/pagination.jsx (Perbaikan)

import React from 'react';
import { Link } from '@inertiajs/react'; // Pastikan Anda mengimpor Link Inertia

// Hilangkan semua 'type' atau 'interface'

const Pagination = ({ data }) => {
    // Pastikan data yang dikirim dari controller (orders) sudah terdesctructure sebagai 'data' di sini
    if (!data || data.last_page <= 1) {
        return null;
    }

    const { current_page, last_page, links } = data;
    
    // Fungsi untuk mendapatkan URL (penting untuk Inertia Link)
    const getPageUrl = (url) => {
        // Hapus query string 'page' dari URL lama dan tambahkan yang baru
        const urlObj = new URL(url);
        return urlObj.pathname + urlObj.search;
    };
    
    return (
        <nav className="flex justify-center items-center space-x-2" aria-label="Pagination">
            {links.map((link, index) => {
                // Hapus label '...' dan link null
                if (!link.url && link.label.includes('...')) {
                    return (
                        <span key={index} className="px-3 py-1.5 text-sm text-gray-500">
                            {link.label}
                        </span>
                    );
                }
                
                // Gunakan Link dari Inertia untuk navigasi
                return (
                    <Link
                        key={index}
                        href={link.url} // Inertia akan menangani ini
                        preserveScroll
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                            ${link.active
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                            }
                            ${!link.url ? 'pointer-events-none opacity-50' : ''}
                        `}
                        // Menggunakan dangerouslySetInnerHTML untuk label (seperti &laquo; atau &raquo;)
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
};

export default Pagination;