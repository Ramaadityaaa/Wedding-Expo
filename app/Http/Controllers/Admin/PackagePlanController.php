<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PackagePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PackagePlanController extends Controller
{
    /**
     * Menampilkan daftar semua paket membership (Read).
     */
    public function index()
    {
        $plans = PackagePlan::all();

        return Inertia::render('Admin/pages/PackagePlanManagement', [
            'plans' => $plans,
        ]);
    }

    /**
     * Menyimpan atau memperbarui paket (Create/Update).
     */
    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|exists:package_plans,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->filled('id')) {
            PackagePlan::find($validated['id'])->update($validated);
            $message = 'Paket berhasil diperbarui.';
        } else {
            PackagePlan::create($validated);
            $message = 'Paket baru berhasil dibuat.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Menghapus paket (Delete).
     */
    public function destroy($id)
    {
        PackagePlan::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Paket berhasil dihapus.');
    }
}
