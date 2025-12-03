import React from 'react';
import { Link } from 'react-router-dom'; // Pastikan path ini benar
 // Menggunakan react-router-dom untuk navigasi
import { vendorNavItems } from './navItems'; // Mengimpor item navigasi untuk Vendor

const VendorSidebar = () => {
    return (
        <nav className="sidebar">
            <ul>
                {vendorNavItems.map((item) => (
                    <li key={item.name} className="sidebar-item">
                        <Link to={item.route} className="flex items-center p-3 rounded-xl">
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default VendorSidebar;
