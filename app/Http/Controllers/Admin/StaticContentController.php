<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaticContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaticContentController extends Controller
{
    /**
     * Menampilkan halaman manajemen konten statis.
     */
    public function index()
    {
        // Ambil semua data dan format menjadi array asosiatif [ 'Judul' => 'Isi' ]
        // Contoh: ['Tentang Kami' => 'Teks panjang...', 'FAQ' => 'Teks FAQ...']
        $contents = StaticContent::all()->pluck('content', 'key');

        return Inertia::render('Admin/pages/StaticContentManagement', [
            'initialContent' => $contents->isEmpty() ? null : $contents,
            // Jika kosong, frontend akan menggunakan default text
        ]);
    }

    /**
     * Menyimpan atau memperbarui konten.
     */
    public function update(Request $request)
    {
        $request->validate([
            'key'   => 'required|string',
            'value' => 'required|string',
        ]);

        // Cari berdasarkan 'key', jika ada update, jika tidak buat baru
        StaticContent::updateOrCreate(
            ['key' => $request->key],
            ['content' => $request->value]
        );

        return redirect()->back()->with('success', "Konten '{$request->key}' berhasil diperbarui.");
    }
}
