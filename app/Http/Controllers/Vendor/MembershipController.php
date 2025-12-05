<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PackagePlan; // <<< BARU: Import Model PackagePlan
use App\Models\WeddingOrganizer;
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
        $vendor = $user->weddingOrganizer;

        // 1. Ambil semua paket yang aktif dari database
        $packagePlans = PackagePlan::where('is_active', true)->get();

        // 2. Tentukan plan aktif vendor (berdasarkan kolom 'role' di tabel wedding_organizers)
        // Kita menggunakan role untuk menentukan plan aktif ('Membership' -> premium, selain itu 'basic')
        $currentPlan = $vendor->role === 'Membership' ? 'premium' : 'basic';

        // 3. Kirim data
        return Inertia::render('Vendor/pages/MembershipPage', [
            'vendor' => $vendor,
            'currentPlan' => $currentPlan,
            'packagePlans' => $packagePlans, // <<< KIRIM DATA PAKET DINAMIS
        ]);
    }

    /**
     * Membuat invoice dan mengarahkan ke halaman pembayaran.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            // Validasi menggunakan slug yang dikirim dari frontend
            'plan_slug' => 'required|exists:package_plans,slug',
            'vendor_id' => 'required|exists:wedding_organizers,id',
        ]);

        $planSlug = $request->plan_slug;

        // 1. Ambil data plan dari database
        $plan = PackagePlan::where('slug', $planSlug)->firstOrFail();

        if ($plan->price === 0) {
            // Jika memilih paket gratis
            // Asumsi: Kita hanya mengupdate role dan tidak perlu invoice/pembayaran
            WeddingOrganizer::where('id', $request->vendor_id)->update(['role' => $plan->slug]);
            return redirect()->route('vendor.dashboard')->with('success', 'Anda berhasil berpindah ke paket ' . $plan->name);
        }

        // 2. Hitung Harga & Durasi (menggunakan data dari database)
        $planPrice = $plan->price;
        $taxRate = 0.11;
        $totalAmount = $planPrice + ($planPrice * $taxRate);
        $dueDate = Carbon::now()->addDays(7);

        // 3. Buat Invoice
        $invoice = Invoice::create([
            'vendor_id' => $request->vendor_id,
            'invoice_number' => 'INV-' . Str::upper(Str::random(8)),
            'plan_id' => $plan->slug, // Simpan slug paket
            'amount' => $totalAmount,
            'status' => 'PENDING',
            'due_date' => $dueDate,
        ]);

        // 4. Redirect ke Halaman Pembayaran/Invoice
        return redirect()->route('vendor.payment.create', [
            'invoiceId' => $invoice->id
        ])->with('success', 'Invoice berhasil dibuat. Silakan selesaikan pembayaran.');
    }
}
