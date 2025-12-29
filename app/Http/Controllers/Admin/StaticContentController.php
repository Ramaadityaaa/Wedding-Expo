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
        $contents = StaticContent::query()->pluck('content', 'key');

        return Inertia::render('Admin/pages/StaticContentManagement', [
            // selalu kirim array (lebih konsisten untuk merge di frontend)
            'initialContent' => $contents->toArray(),
        ]);
    }

    /**
     * Menyimpan atau memperbarui konten.
     */
    public function update(Request $request)
    {
        $request->validate([
            'key'   => 'required|string|max:255',
            'value' => 'required|string',
        ]);

        StaticContent::updateOrCreate(
            ['key' => $request->key],
            ['content' => $request->value]
        );

        return redirect()->back()->with('success', "Konten '{$request->key}' berhasil diperbarui.");
    }
}
