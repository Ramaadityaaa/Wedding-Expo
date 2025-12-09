import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// Import Layouts utama (Opsional jika sudah dihandle di page masing-masing)
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

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),

    setup({ el, App, props }) {
        // ---------------------------------------------------------
        // PERBAIKAN ZIGGY: Sinkronisasi Route Laravel ke React
        // ---------------------------------------------------------
        // Kita ambil data 'ziggy' yang dikirim dari HandleInertiaRequests.php
        // Lalu kita gabungkan ke window.Ziggy agar helper route() bisa membacanya.
        const ziggyFromBackend = props.initialPage.props.ziggy;

        if (ziggyFromBackend) {
            window.Ziggy = {
                ...window.Ziggy,
                ...ziggyFromBackend,
            };
        }
        // ---------------------------------------------------------

        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#fb923c", // Warna Orange 400
        showSpinner: true,
    },
});
