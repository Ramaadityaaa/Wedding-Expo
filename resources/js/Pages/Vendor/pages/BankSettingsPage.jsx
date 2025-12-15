import React from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';
import { Banknote } from 'lucide-react';
import { useToast } from "@/Hooks/useToast"; // Mengganti "../../../Hooks/useToast"

export default function BankSettingsPage({ auth, bankDetails }) {
    const { toast } = useToast();

    // Inisialisasi useForm dengan data yang diterima dari Controller
    const { data, setData, patch, processing, errors } = useForm({
        bank_name: bankDetails.bank_name || '',
        account_number: bankDetails.account_number || '',
        account_holder_name: bankDetails.account_holder_name || '',
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('vendor.bank.update'), {
            onSuccess: () => {
                toast({
                    title: "Berhasil!",
                    description: "Pengaturan rekening bank berhasil diperbarui.",
                    variant: "success",
                });
            },
            onError: (err) => {
                toast({
                    title: "Gagal Menyimpan",
                    description: "Terdapat kesalahan saat memperbarui data.",
                    variant: "destructive",
                });
                console.error(err);
            }
        });
    };

    return (
        <VendorLayout
            user={auth.user}
            header="Pengaturan Rekening Bank"
        >
            <Head title="Pengaturan Rekening Bank" />

            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                            <Banknote size={24} className="text-amber-500" />
                            Detail Rekening Pembayaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-600 mb-6">
                            Pastikan semua detail rekening bank di bawah ini sudah benar. Dana hasil transaksi akan dicairkan ke rekening ini.
                        </p>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Nama Bank */}
                            <div>
                                <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Bank (Contoh: BCA, Mandiri)
                                </label>
                                <Input
                                    id="bank_name"
                                    type="text"
                                    name="bank_name"
                                    value={data.bank_name}
                                    onChange={(e) => setData('bank_name', e.target.value)}
                                    className="block w-full"
                                    placeholder="Masukkan nama bank"
                                    required
                                />
                                <InputError message={errors.bank_name} className="mt-2" />
                            </div>

                            {/* Nomor Rekening */}
                            <div>
                                <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Rekening
                                </label>
                                <Input
                                    id="account_number"
                                    type="text"
                                    name="account_number"
                                    value={data.account_number}
                                    onChange={(e) => setData('account_number', e.target.value)}
                                    className="block w-full"
                                    placeholder="Masukkan nomor rekening"
                                    required
                                />
                                <InputError message={errors.account_number} className="mt-2" />
                            </div>

                            {/* Nama Pemilik Rekening */}
                            <div>
                                <label htmlFor="account_holder_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Pemilik Rekening (Sesuai KTP/Buku Tabungan)
                                </label>
                                <Input
                                    id="account_holder_name"
                                    type="text"
                                    name="account_holder_name"
                                    value={data.account_holder_name}
                                    onChange={(e) => setData('account_holder_name', e.target.value)}
                                    className="block w-full"
                                    placeholder="Masukkan nama pemilik rekening"
                                    required
                                />
                                <InputError message={errors.account_holder_name} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <Button disabled={processing} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>

                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </VendorLayout>
    );
}
