<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use Illuminate\Http\Request;

class PaymentProofController extends Controller
{
    // Ambil semua pembayaran yang pending
    public function index()
    {
        return PaymentProof::with('vendor')
            ->orderBy('created_at', 'DESC')
            ->get();
    }

    // Konfirmasi pembayaran
    public function approve($id)
    {
        $payment = PaymentProof::findOrFail($id);
        $payment->status = 'Approved';
        $payment->save();

        return response()->json(['message' => 'Payment approved']);
    }

    // Tolak pembayaran
    public function reject($id)
    {
        $payment = PaymentProof::findOrFail($id);
        $payment->status = 'Rejected';
        $payment->save();

        return response()->json(['message' => 'Payment rejected']);
    }
}
