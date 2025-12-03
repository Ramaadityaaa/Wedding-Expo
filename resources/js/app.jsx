import './bootstrap'; // Mengimpor pengaturan awal bootstrap.js
import '../css/app.css'; // Mengimpor styling aplikasi
import { createRoot } from 'react-dom/client'; // Membuat root React untuk aplikasi
import { createInertiaApp } from '@inertiajs/react'; // Inertia.js untuk membangun aplikasi SPA

// Fungsi untuk membuat title dinamis
const getTitle = (title) => {
  const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
  return title ? `${title} - ${appName}` : appName;
};

// Resolusi halaman dinamis berdasarkan pola './Pages/${name}.jsx'
const resolvePage = (name) => {
  const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
  return pages[`./Pages/${name}.jsx`];
};

// Setup aplikasi Inertia.js
createInertiaApp({
  title: getTitle,
  resolve: resolvePage,
  setup({ el, App, props }) {
    // Membuat root Inertia dan merender aplikasi
    createRoot(el).render(<App {...props} />);
  },
  progress: { color: '#4B5563' },  // Setel warna progress bar
});
