<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = (int) $request->query('limit', 20);

        $notifications = $user->notifications()
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'data' => $n->data,

                    // pastikan string biar frontend gampang format
                    'read_at' => $n->read_at ? $n->read_at->toIso8601String() : null,
                    'created_at' => $n->created_at ? $n->created_at->toIso8601String() : null,
                ];
            });

        return response()->json([
            'unread_count' => $user->unreadNotifications()->count(),
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $user = $request->user();
        $notif = $user->notifications()->where('id', $id)->firstOrFail();
        $notif->markAsRead();

        return response()->json(['ok' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        $user->unreadNotifications->markAsRead();

        return response()->json(['ok' => true]);
    }
}
