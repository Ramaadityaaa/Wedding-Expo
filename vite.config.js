import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- Import path

// --- TAMBAHAN UNTUK MEMPERBAIKI __dirname ---
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- SELESAI ---

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx', // Pastikan ini menunjuk ke app.jsx
            refresh: true,
        }),
        react(),
    ],
    // --- TAMBAHAN UNTUK MEMPERBAIKI ALIAS '@' ---
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    // ---------------------------
});