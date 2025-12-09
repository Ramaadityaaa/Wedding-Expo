<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ChatController extends Controller
{
    // 1. Ambil riwayat chat dengan user tertentu
    public function getMessages($userId)
    {
        $myId = Auth::id();

        // Logika: Ambil pesan dari (SAYA ke DIA) atau (DIA ke SAYA)
        $messages = Message::where(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $myId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $myId);
        })
            ->orderBy('created_at', 'asc') // Urutkan dari terlama ke terbaru
            ->get();

        return response()->json($messages);
    }

    // 2. Kirim Pesan Baru
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        // Simpan ke Database
        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // KIRIM SINYAL REAL-TIME KE REVERB!
        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['status' => 'Message Sent!', 'message' => $message]);
    }

    public function getConversations()
    {
        $userId = Auth::id();

        // 1. Ambil semua ID lawan bicara
        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->map(function ($msg) use ($userId) {
                return $msg->sender_id == $userId ? $msg->receiver_id : $msg->sender_id;
            })
            ->unique()
            ->values();

        // 2. Ambil detail user & hitung unread
        $users = User::whereIn('id', $conversations)
            ->get() // Ambil semua kolom dulu agar aman
            ->map(function ($user) use ($userId) {

                // Ambil pesan terakhir
                $lastMsg = Message::where(function ($q) use ($userId, $user) {
                    $q->where('sender_id', $userId)->where('receiver_id', $user->id);
                })->orWhere(function ($q) use ($userId, $user) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $userId);
                })
                    ->latest()
                    ->first();

                // Hitung pesan belum dibaca
                $unread = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->count();

                // --- LOGIKA AVATAR AMAN ---
                // Cek apakah user punya method profile_photo_url (Jetstream)
                // Jika tidak, pakai UI Avatars
                $avatar = method_exists($user, 'getProfilePhotoUrlAttribute')
                    ? $user->profile_photo_url
                    : 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&color=7F9CF5&background=EBF4FF';

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $avatar,
                    'last_message' => $lastMsg ? $lastMsg->message : '',
                    'last_time' => $lastMsg ? $lastMsg->created_at->diffForHumans() : '',
                    'unread_count' => $unread,
                ];
            })
            ->sortByDesc('last_message_created_at') // Urutkan chat terbaru di atas (opsional)
            ->values(); // Reset index array

        return response()->json($users);
    }
}
