<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentProofController extends Controller
{
    /** 
     * Vendor mengirim bukti pembayaran 
     */
    public function store(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'account_name' => 'required|string',
            'amount' => 'required|numeric',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        // Upload file
        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        // Simpan ke database
        $proof = PaymentProof::create([
            'vendor_id' => $request->vendor_id,
            'account_name' => $request->account_name,
            'amount' => $request->amount,
            'file_path' => $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Upload bukti pembayaran berhasil.',
            'data' => $proof
        ]);
    }

    /**
     * Ambil semua data untuk dashboard admin
     */
    public function index()
    {
        return PaymentProof::with('vendor')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
