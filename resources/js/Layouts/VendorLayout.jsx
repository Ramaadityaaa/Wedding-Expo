import React from 'react';
import { UserCog, Image, Package, MessageSquareText, Archive } from 'lucide-react';

const VendorLayout = ({ setCurrentTab }) => {
    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-3xl font-extrabold text-amber-600">Wedding<span className="text-amber-400">Expo</span></h1>
            </div>
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {[{ tab: 'profile', icon: UserCog, label: 'Edit Profil' },
                  { tab: 'portfolio', icon: Image, label: 'Portofolio' },
                  { tab: 'packages', icon: Package, label: 'Paket Harga' },
                  { tab: 'reviews', icon: MessageSquareText, label: 'Tinjau Ulasan' },
                  { tab: 'public-preview', icon: Archive, label: 'Pratinjau Publik' }]
                    .map(({ tab, icon: Icon, label }) => (
                        <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className="sidebar-item flex items-center p-3 rounded-xl transition duration-150 w-full text-left"
                        >
                            <Icon className="w-5 h-5 mr-3" /> {label}
                        </button>
                    ))}
            </nav>
        </div>
    );
};

export default VendorLayout;
