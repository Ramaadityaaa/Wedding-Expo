/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// PENTING: Menjaga session tetap hidup (cookie auth Laravel terkirim)
window.axios.defaults.withCredentials = true;

// PENTING: Pastikan CSRF token ikut terkirim (untuk POST/PATCH/DELETE)
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

if (csrfToken) {
    window.axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;

/**
 * KONFIGURASI REVERB (Sesuai .env Anda)
 * Catatan:
 * - Laravel Echo memakai protokol Pusher untuk Reverb.
 * - authEndpoint wajib supaya private channel bisa di-authorize.
 * - withCredentials + CSRF penting untuk session-based auth (Sanctum/session).
 */

window.Echo = new Echo({
    broadcaster: "reverb",

    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,

    // Jika .env kamu kosong, fallback:
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,

    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],

    // Ini WAJIB untuk notifikasi (private channel) + session login
    authEndpoint: "/broadcasting/auth",

    // Pastikan auth request membawa cookie + CSRF
    auth: {
        headers: {
            "X-CSRF-TOKEN": csrfToken || "",
            "X-Requested-With": "XMLHttpRequest",
        },
    },
});
