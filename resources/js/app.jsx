import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// Import Layouts utama jika diperlukan (Opsional jika sudah di-handle di page masing-masing)
import AdminLayout from "@/Layouts/AdminLayout";
import VendorLayout from "@/Layouts/VendorLayout";
import CustomerLayout from "@/Layouts/CustomerLayout";  // Pastikan layout customer juga terimport jika digunakan

// Fungsi untuk membuat title dinamis
const getTitle = (title) => {
    const appName = import.meta.env.VITE_APP_NAME || "WeddingExpo";
    return title ? `${title} - ${appName}` : appName;
};

// Setup aplikasi Inertia.js
createInertiaApp({
    title: getTitle,

    // Resolving page components dynamically
    resolve: (name) => {
        return resolvePageComponent(
            `./Pages/${name}.jsx`,  // Path dinamis untuk mengarahkan ke halaman yang sesuai
            import.meta.glob("./Pages/**/*.jsx") // Menggunakan Vite untuk otomatis mencari komponen
        );
    },

    setup({ el, App, props }) {
        // ---------------------------------------------------------
        // PERBAIKAN ZIGGY: Sinkronisasi Route Laravel ke React
        // ---------------------------------------------------------
        // Mengambil data 'ziggy' yang dikirim dari HandleInertiaRequests.php
        // Kemudian menggabungkannya dengan window.Ziggy agar helper route() bisa menggunakannya.
        const ziggyFromBackend = props.initialPage.props.ziggy;

        if (ziggyFromBackend) {
            window.Ziggy = {
                ...window.Ziggy,
                ...ziggyFromBackend,
            };
        }
        // ---------------------------------------------------------

        // Render Inertia App ke dalam DOM
        createRoot(el).render(<App {...props} />);
    },

    // Konfigurasi Progress Bar untuk Inertia
    progress: {
        color: "#fb923c", // Warna Progress Bar (warna orange 400)
        showSpinner: true, // Menampilkan spinner saat halaman sedang dimuat
    },
});
