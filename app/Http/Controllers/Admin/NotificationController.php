<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 8);
        $limit = $limit > 0 ? min($limit, 50) : 8;

        $user = $request->user();

        // PENTING: JANGAN markAsRead DI SINI
        $notifications = $user->notifications()
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'data' => $n->data,
                    'read_at' => $n->read_at ? $n->read_at->toISOString() : null,
                    'created_at' => $n->created_at ? $n->created_at->toISOString() : null,
                ];
            });

        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $user = $request->user();

        $notif = $user->notifications()->where('id', $id)->firstOrFail();
        if ($notif->read_at === null) {
            $notif->markAsRead();
        }

        return response()->json(['ok' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $user->unreadNotifications->markAsRead();

        return response()->json(['ok' => true]);
    }
}
