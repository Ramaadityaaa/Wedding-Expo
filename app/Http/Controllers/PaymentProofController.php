<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use App\Models\Invoice;
use App\Models\Vendor; // Pastikan ini mengarah ke Model Vendor Anda (bisa juga WeddingOrganizer jika belum direname)
use App\Models\PackagePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PaymentProofController extends Controller
{
    public function index()
    {
        $paymentRequests = PaymentProof::with(['vendor', 'invoice'])
            ->latest()
            ->get()
            ->map(function ($proof) {
                // Default Value
                $planName = 'Paket Membership';

                // Cek Invoice
                if ($proof->invoice) {
                    // OPSI 1: Snapshot nama paket di invoice
                    if (!empty($proof->invoice->package_name)) {
                        $planName = $proof->invoice->package_name;
                    }
                    // OPSI 2: Cari Live Data dari PackagePlan
                    elseif (!empty($proof->invoice->plan_id)) {
                        $planId = $proof->invoice->plan_id;
                        $plan = PackagePlan::where('id', $planId)
                            ->orWhere('slug', $planId)
                            ->first();

                        if ($plan) {
                            $planName = $plan->name;
                        } else {
                            $planName = "Paket Tidak Dikenal (ID: $planId)";
                        }
                    }
                }

                $proof->package_name = $planName;
                return $proof;
            });

        return Inertia::render('Admin/pages/PaymentConfirmation', [
            'paymentRequests' => $paymentRequests
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:Approved,Rejected,Pending'
            ]);

            $payment = PaymentProof::findOrFail($id);

            // 1. Update Status Bukti Pembayaran
            $payment->update(['status' => $request->status]);

            // 2. Jika APPROVED, Update Invoice & Vendor
            if ($payment->invoice_id) {
                $invoice = Invoice::find($payment->invoice_id);

                if ($invoice) {
                    if ($request->status === 'Approved') {
                        // A. Invoice Lunas
                        $invoice->update(['status' => 'PAID']);

                        // B. UPDATE VENDOR (STATUS & ROLE)
                        if ($payment->vendor_id) {
                            $vendor = Vendor::find($payment->vendor_id);

                            if ($vendor) {
                                // Update kolom-kolom penting agar fitur terbuka
                                $vendor->update([
                                    'status' => 'active',       // Agar badge menjadi "TERVERIFIKASI" (Hijau)
                                    'isApproved' => 'APPROVED', // Kompatibilitas kolom lama
                                    'role' => 'Membership'      // <--- KUNCI UTAMA: Membuka gembok menu Chat, Paket, dll
                                ]);
                            }
                        }
                    } elseif ($request->status === 'Rejected') {
                        $invoice->update(['status' => 'REJECTED']);
                    }
                }
            }
            return redirect()->back()->with('success', 'Status pembayaran diperbarui. Role vendor telah diupgrade menjadi Membership.');
        } catch (\Exception $e) {
            Log::error("Error updating payment status: " . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $payment = PaymentProof::findOrFail($id);
            if ($payment->file_path && Storage::disk('public')->exists($payment->file_path)) {
                Storage::disk('public')->delete($payment->file_path);
            }
            $payment->delete();
            return redirect()->back()->with('success', 'Data pembayaran berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus data.');
        }
    }
}
