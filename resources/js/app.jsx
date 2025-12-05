import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"; // Helper untuk resolusi halaman

// Import Layouts utama secara eksplisit
import AdminLayout from "@/Layouts/AdminLayout";
import VendorLayout from "@/Layouts/VendorLayout";

// Fungsi untuk membuat title dinamis
const getTitle = (title) => {
    const appName = import.meta.env.VITE_APP_NAME || "WeddingExpo";
    return title ? `${title} - ${appName}` : appName;
};

// Setup aplikasi Inertia.js
createInertiaApp({
    title: getTitle,

    // Resolusi Halaman: Menggunakan helper Laravel-Vite
    // Kita tidak perlu lagi mengatur Layouts di sini karena kita akan
    // membungkus setiap halaman dengan Layout di dalam filenya masing-masing (misal: VendorDashboard.jsx)
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#fb923c", // Warna Orange 400
        showSpinner: true,
    },
});
