// resources/js/Pages/Vendor/pages/OrderPaymentConfirmationPage.jsx

import VendorLayout from '@/Layouts/VendorLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';

export default function OrderPaymentConfirmationPage({ auth, paymentProofs }) {

    const handleUpdateStatus = (paymentProofId, status) => {
        const confirmMessage = status === 'APPROVED' 
            ? 'Apakah Anda yakin ingin MENYETUJUI bukti pembayaran ini? Status Order akan menjadi PAID.'
            : 'Apakah Anda yakin ingin MENOLAK bukti pembayaran ini?';

        if (confirm(confirmMessage)) {
            router.patch(route('vendor.order-payments.update-status', paymentProofId), {
                status: status,
                // Tambahkan input modal jika perlu alasan penolakan
            }, {
                onSuccess: () => {
                    toast.success('Status pembayaran berhasil diperbarui!');
                },
                onError: (errors) => {
                    toast.error('Gagal memperbarui status. Cek kembali data.');
                    console.error(errors);
                }
            });
        }
    };

    const getStatusVariant = (status) => {
        if (status === 'PENDING') return 'secondary';
        if (status === 'APPROVED') return 'default';
        if (status === 'REJECTED') return 'destructive';
        return 'secondary';
    };
    
    // Asumsi: VendorLayout sudah ada di resources/js/Layouts/VendorLayout.jsx

    return (
        <VendorLayout user={auth.user}>
            <Head title="Konfirmasi Pembayaran Pesanan" />

            <h2 className="text-2xl font-semibold mb-6">Konfirmasi Pembayaran Pesanan Pelanggan</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Bukti Pembayaran Masuk</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Order</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Total Bayar</TableHead>
                                <TableHead>Status Bukti</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentProofs.data.length > 0 ? (
                                paymentProofs.data.map((proof) => (
                                    <TableRow key={proof.id}>
                                        <TableCell>{proof.order.id}</TableCell>
                                        <TableCell>{proof.order.user.name}</TableCell>
                                        <TableCell>{proof.order.package.name} ({proof.order.package.price.toLocaleString('id-ID')})</TableCell>
                                        <TableCell>
                                            Rp {proof.amount.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(proof.status)}>{proof.status}</Badge>
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            <Link href={route('home')} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm">
                                                Lihat Bukti
                                            </Link>
                                            {proof.status === 'PENDING' && (
                                                <>
                                                    <Button 
                                                        onClick={() => handleUpdateStatus(proof.id, 'APPROVED')} 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                    >
                                                        Setujui
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleUpdateStatus(proof.id, 'REJECTED')} 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        Tolak
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Tidak ada bukti pembayaran yang perlu dikonfirmasi.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* Tambahkan Pagination di sini jika perlu */}
                </CardContent>
            </Card>
        </VendorLayout>
    );
}