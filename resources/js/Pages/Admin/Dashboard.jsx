// resources/js/Pages/Admin/Dashboard.jsx

import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  Users, Store, MessageSquare, Star, Eye,
  CheckCircle, XCircle, Clock, TrendingUp, Calendar, DollarSign
} from 'lucide-react';
import { Button } from '@/Components/ui/button'; // <-- Path diubah
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'; // <-- Path diubah
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'; // <-- Path diubah
import { Badge } from '@/Components/ui/badge'; // <-- Path diubah
// import { Alert, AlertDescription } from '@/Components/ui/alert'; // (Tidak terpakai di kode Anda)

// Hapus: useSession, useRouter, useState, useEffect
// Data sekarang datang dari props
export default function AdminDashboard({ auth, stats, pendingVendors, pendingReviews }) {
  
  // Hapus: semua useState dan useEffect
  // Hapus: fetchDashboardData

  // Gunakan useForm untuk menangani Aksi (approve/reject)
  // 'processing' akan memberi kita state loading untuk tombol
  const { patch, processing } = useForm({});

  // Ganti 'fetch' dengan 'patch' dari Inertia
  // 'route()' adalah helper dari Ziggy (disediakan Breeze)
  // 'preserveScroll: true' agar halaman tidak scroll ke atas setelah aksi
  const handleApproveVendor = (vendorId) => {
    patch(route('admin.vendors.approve', vendorId), { preserveScroll: true });
  };

  const handleRejectVendor = (vendorId) => {
    patch(route('admin.vendors.reject', vendorId), { preserveScroll: true });
  };

  const handleApproveReview = (reviewId) => {
    patch(route('admin.reviews.approve', reviewId), { preserveScroll: true });
  };

  const handleRejectReview = (reviewId) => {
    patch(route('admin.reviews.reject', reviewId), { preserveScroll: true });
  };

  // Hapus: Loading state (if (status === 'loading' ...))
  // Halaman Inertia baru akan di-render setelah Controller selesai mengambil data.

  return (
    // Ganti AdminNavbar dengan AuthenticatedLayout
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
    >
      <Head title="Admin Dashboard" />
      
      {/* Sisa JSX Anda 99% sama. 
        Kita hanya perlu mengubah sedikit path import komponen UI
        dan menambahkan 'disabled={processing}' pada tombol.
      */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 px-4 sm:px-0">
            <h1 className="text-3xl font-serif text-black mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Kelola platform Wedding Expo
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Vendor</p>
                    <p className="text-2xl font-bold text-black">{stats.totalVendors}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stats.monthlyGrowth}% bulan ini
                    </p>
                  </div>
                  <Store className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vendor Pending</p>
                    <p className="text-2xl font-bold text-black">{stats.pendingVendors}</p>
                    <p className="text-xs text-gray-500">Menunggu persetujuan</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-black">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500">Terdaftar</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-black">{stats.totalReviews}</p>
                    <p className="text-xs text-gray-500">{stats.pendingReviews} pending</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="vendors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
              <TabsTrigger value="reviews">Review Moderation</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Vendors Tab */}
            <TabsContent value="vendors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Menunggu Persetujuan</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingVendors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada vendor yang menunggu persetujuan
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingVendors.map((vendor) => (
                        <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-black">{vendor.name}</h3>
                              <p className="text-sm text-gray-600">{vendor.email}</p>
                              <p className="text-sm text-gray-600">{vendor.city}, {vendor.province}</p>
                              <p className="text-sm text-gray-700 mt-2">{vendor.description}</p>
                              <div className="mt-2">
                                <Badge variant="outline">Pending</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveVendor(vendor.id)}
                                className="text-green-600 hover:text-green-700"
                                disabled={processing} // <-- Tambah ini
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectVendor(vendor.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={processing} // <-- Tambah ini
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ulasan Menunggu Moderasi</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada ulasan yang menunggu moderasi
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {/* Relasi 'user' dan 'weddingOrganizer' dari Controller */}
                                <span className="font-semibold">{review.user?.name}</span>
                                <span className="text-sm text-gray-500">untuk {review.wedding_organizer?.name}</span>
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              <div className="mt-2">
                                <Badge variant="outline">Pending</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveReview(review.id)}
                                className="text-green-600 hover:text-green-700"
                                disabled={processing} // <-- Tambah ini
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectReview(review.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={processing} // <-- Tambah ini
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sisa Tabs (Users & Analytics) */}
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Manajemen User</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    User management akan segera tersedia
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Analytics chart akan segera tersedia
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}