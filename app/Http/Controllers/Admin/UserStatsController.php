<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class UserStatsController extends Controller
{
    /**
     * Menampilkan halaman Manajemen Pengguna.
     */
    public function index()
    {
        // Ambil user dengan role 'USER' atau NULL (asumsi user biasa/customer)
        // Kita exclude role 'ADMIN' dan 'VENDOR' agar tidak salah hapus/edit
        $users = User::where(function ($query) {
            $query->where('role', 'USER')
                ->orWhereNull('role');
        })
            ->where('role', '!=', 'ADMIN') // Double check exclude admin
            ->latest()
            ->get();

        return Inertia::render('Admin/pages/UserManagement', [
            'users' => $users
        ]);
    }

    /**
     * Mengupdate status pengguna (Active / Suspended).
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:Active,Suspended'
            ]);

            $user = User::findOrFail($id);

            // Pastikan kolom 'status' ada di tabel users.
            $user->status = $request->status;
            $user->save();

            return redirect()->back()->with('success', "Status pengguna {$user->name} berhasil diubah menjadi {$request->status}.");
        } catch (\Exception $e) {
            Log::error("Error updating user status: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui status pengguna.');
        }
    }

    /**
     * Menghapus pengguna secara permanen.
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Optional: Cek apakah user punya transaksi aktif sebelum hapus

            $user->delete();

            return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error("Error deleting user: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus pengguna.');
        }
    }
}
