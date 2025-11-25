<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PaymentProof;
use Illuminate\Support\Facades\Storage;

class VendorPaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'amount'        => 'required|numeric',
            'account_name'  => 'required|string',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $vendorId = Auth::user()->vendor->id; // Pastikan user punya relasi vendor

        // Upload file ke storage/app/public/payment_proofs
        $filePath = $request->file('payment_proof')->store('payment_proofs', 'public');

        PaymentProof::create([
            'vendor_id'     => $vendorId,
            'amount'        => $request->amount,
            'account_name'  => $request->account_name,
            'file_path'     => $filePath,
            'status'        => 'Pending',
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil dikirim!');
    }
}
