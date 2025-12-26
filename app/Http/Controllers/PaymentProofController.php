<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use App\Models\Invoice;
use App\Models\Vendor;
use App\Models\PackagePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PaymentProofController extends Controller
{
    /**
     * Menampilkan daftar semua permintaan konfirmasi pembayaran di dashboard Admin.
     */
    public function index()
    {
        // Ambil semua permintaan pembayaran yang dikonfirmasi, dengan relasi vendor dan invoice
        $paymentRequests = PaymentProof::with(['vendor', 'invoice'])
            ->latest()
            ->get()
            ->map(function ($proof) {
                // Default Value jika data plan tidak ditemukan
                $planName = 'Paket Membership';

                // Logika pencarian nama paket berdasarkan Invoice
                if ($proof->invoice) {
                    // Cek jika ada snapshot nama paket di tabel invoice
                    if (!empty($proof->invoice->package_name)) {
                        $planName = $proof->invoice->package_name;
                    } 
                    // Jika tidak ada, cari berdasarkan plan_id ke tabel PackagePlan
                    elseif (!empty($proof->invoice->plan_id)) {
                        $planId = $proof->invoice->plan_id;
                        $plan = PackagePlan::where('id', $planId)
                            ->orWhere('slug', $planId)
                            ->first();

                        $planName = $plan ? $plan->name : "Paket ID: $planId (Terhapus)";
                    }
                }

                $proof->package_name = $planName;
                return $proof;
            });

        // Render tampilan menggunakan Inertia
        return Inertia::render('Admin/pages/PaymentConfirmation', [
            'paymentRequests' => $paymentRequests
        ]);
    }

    /**
     * Update status pembayaran (Approved/Rejected) dan upgrade role Vendor.
     */
    public function updateStatus(Request $request, $id)
    {
        // Validasi input status
        $request->validate([
            'status' => 'required|in:Approved,Rejected,Pending'
        ]);

        try {
            // Gunakan Database Transaction agar jika satu gagal, semua dibatalkan (aman)
            DB::beginTransaction();

            // Cari data payment proof berdasarkan ID
            $payment = PaymentProof::findOrFail($id);
            
            // 1. Update Status di tabel payment_proofs
            $payment->update(['status' => $request->status]);

            if ($payment->invoice_id) {
                // Update status invoice
                $invoice = Invoice::find($payment->invoice_id);

                if ($invoice) {
                    if ($request->status === 'Approved') {
                        // A. Tandai Invoice sebagai Lunas
                        $invoice->update(['status' => 'PAID']);

                        // B. Logika Upgrade Vendor
                        if ($payment->vendor_id) {
                            $vendor = Vendor::find($payment->vendor_id);

                            if ($vendor) {
                                // MENGAKTIFKAN FITUR VENDOR
                                $vendor->update([
                                    'status'     => 'active',       // Badge jadi Hijau/Terverifikasi
                                    'isApproved' => 'APPROVED',     // Status approval admin
                                    'role'       => 'Membership'    // MEMBUKA SEMUA AKSES MENU (Chat, Portfolio, dll)
                                ]);
                                
                                Log::info("Vendor ID {$vendor->id} telah diupgrade ke Membership.");
                            }
                        }
                    } 
                    elseif ($request->status === 'Rejected') {
                        // Jika ditolak, kembalikan status invoice
                        $invoice->update(['status' => 'REJECTED']);
                    }
                }
            }

            // Commit perubahan jika tidak ada error
            DB::commit();

            // Kirimkan pesan sukses
            $message = $request->status === 'Approved' 
                ? 'Pembayaran disetujui. Vendor sekarang memiliki akses Membership.' 
                : 'Pembayaran telah ditolak.';

            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            // Rollback jika terjadi error
            DB::rollBack();
            Log::error("Error pada PaymentProofController@updateStatus: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui status: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus data bukti pembayaran beserta filenya dari storage.
     */
    public function destroy($id)
    {
        try {
            // Cari payment proof berdasarkan ID
            $payment = PaymentProof::findOrFail($id);

            // Hapus file fisik dari folder storage/app/public
            if ($payment->file_path && Storage::disk('public')->exists($payment->file_path)) {
                Storage::disk('public')->delete($payment->file_path);
            }

            // Hapus entri dari tabel payment_proofs
            $payment->delete();

            return redirect()->back()->with('success', 'Data bukti pembayaran berhasil dihapus.');

        } catch (\Exception $e) {
            Log::error("Error pada PaymentProofController@destroy: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus data.');
        }
    }
}
