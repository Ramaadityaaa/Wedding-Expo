<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PaymentProofController extends Controller
{
    /**
     * Menampilkan halaman Konfirmasi Pembayaran.
     */
    public function index()
    {
        // Menggunakan 'with' untuk eager loading data vendor agar tidak N+1 problem
        $paymentRequests = PaymentProof::with('vendor')
            ->latest()
            ->get();

        return Inertia::render('Admin/pages/PaymentConfirmation', [
            'paymentRequests' => $paymentRequests
        ]);
    }

    /**
     * Mengupdate status pembayaran (Route untuk Approve/Reject via POST/PATCH).
     * Menangani request dari Inertia router.post()
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $payment = PaymentProof::findOrFail($id);

            // Validasi input status
            $request->validate([
                'status' => 'required|in:Approved,Rejected,Pending'
            ]);

            // Update status
            $payment->update([
                'status' => $request->status
            ]);

            // [PENTING] Gunakan redirect back untuk Inertia, BUKAN response()->json()
            return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error("Error updating payment status: " . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses pembayaran.');
        }
    }

    /**
     * Menghapus bukti pembayaran.
     */
    public function destroy($id)
    {
        try {
            $payment = PaymentProof::findOrFail($id);

            // Hapus file fisik jika ada (opsional, praktik yang baik)
            // if ($payment->file_path && \Storage::exists('public/' . $payment->file_path)) {
            //    \Storage::delete('public/' . $payment->file_path);
            // }

            $payment->delete();

            return redirect()->back()->with('success', 'Data pembayaran berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus data.');
        }
    }
}
