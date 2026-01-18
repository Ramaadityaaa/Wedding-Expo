import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function CustomerLayout({ user = null, children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Global Navbar */}
            <Navbar user={user} />

            {/* Content, kasih jarak karena navbar fixed */}
            <main className="flex-1 pt-16">
                {children}
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
