<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Di sini kamu mendefinisikan channel apa saja yang boleh didengar user.
| Callback return true/false menentukan user boleh subscribe atau tidak.
|
*/

/**
 * Default Laravel Private Channel (dipakai oleh Laravel Notifications)
 * Channel: private-App.Models.User.{id}
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/**
 * Vendor Channel (opsional tapi sangat berguna)
 * Kalau nanti kamu broadcast notifikasi per vendor:
 * Channel: private-vendor.{vendorId}
 *
 * Catatan:
 * - Pastikan relasi user->vendor ada.
 * - vendorId adalah ID dari vendor milik user.
 */
Broadcast::channel('vendor.{vendorId}', function ($user, $vendorId) {
    $vendor = $user->vendor ?? $user->weddingOrganizer ?? null;

    if (!$vendor) {
        return false;
    }

    return (int) $vendor->id === (int) $vendorId;
});

/**
 * Channel Chat
 * Channel: private-chat.{id}
 *
 * Versi aman: user hanya boleh listen channel chat milik dirinya sendiri.
 */
Broadcast::channel('chat.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
