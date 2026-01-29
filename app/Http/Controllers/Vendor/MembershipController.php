<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PackagePlan;
use App\Models\Vendor; // <--- UBAH INI (Jangan pakai WeddingOrganizer)
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

class MembershipController extends Controller
{
    /**
     * Menampilkan halaman pilihan membership.
     */
    public function index()
    {
        $user = Auth::user();

        // PERBAIKAN 1: Gunakan relasi 'vendor', bukan 'weddingOrganizer'
        $vendor = $user->vendor;

        // Jaga-jaga jika data vendor belum tertarik sempurna
        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Data vendor tidak ditemukan.');
        }

        // 1. Ambil semua paket yang aktif
        $packagePlans = PackagePlan::where('is_active', true)->get();

        // 2. Tentukan plan aktif vendor
        // Pastikan kolom 'role' atau 'plan_id' ada di tabel vendors. 
        // Jika belum ada kolom 'role', kode ini mungkin error "Column not found".
        // Asumsi: Kita pakai logic sederhana dulu.
        $currentRole = $vendor->role ?? 'basic'; // Default basic jika null
        $currentPlan = $currentRole === 'Membership' ? 'premium' : 'basic';

        // 3. Kirim data
        return Inertia::render('Vendor/pages/MembershipPage', [
            'vendor' => $vendor,
            'currentPlan' => $currentPlan,
            'packagePlans' => $packagePlans,
        ]);
    }

    /**
     * Membuat invoice dan mengarahkan ke halaman pembayaran.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_slug' => 'required|exists:package_plans,slug',
            // PERBAIKAN 2: Cek ke tabel 'vendors', bukan 'wedding_organizers'
            'vendor_id' => 'required|exists:vendors,id',
        ]);

        $planSlug = $request->plan_slug;

        // 1. Ambil data plan
        $plan = PackagePlan::where('slug', $planSlug)->firstOrFail();

        if ($plan->price === 0) {
            // Jika paket gratis, update langsung ke tabel Vendor
            Vendor::where('id', $request->vendor_id)->update(['role' => $plan->slug]);

            return redirect()->route('vendor.dashboard')
                ->with('success', 'Anda berhasil berpindah ke paket ' . $plan->name);
        }

        // 2. Hitung Harga & Durasi
        $planPrice = $plan->price;
        $taxRate = 0.11;
        $totalAmount = $planPrice + ($planPrice * $taxRate);
        $dueDate = Carbon::now()->addDays(7);

        // 3. Buat Invoice
        $invoice = Invoice::create([
            'vendor_id' => $request->vendor_id,
            'invoice_number' => 'INV-' . Str::upper(Str::random(8)),
            'plan_id' => $plan->slug,
            'amount' => $totalAmount,
            'status' => 'PENDING',
            'due_date' => $dueDate,
            'payment_method' => 'bank_transfer', // Default value agar tidak error
        ]);

        // 4. Redirect ke Halaman Pembayaran
        return redirect()->route('vendor.payment.create', [
            'invoiceId' => $invoice->id
        ])->with('success', 'Invoice berhasil dibuat. Silakan selesaikan pembayaran.');
    }
}
