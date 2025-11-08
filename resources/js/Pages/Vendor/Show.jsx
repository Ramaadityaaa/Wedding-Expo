'use client'

import { useState } from 'react'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Facebook, 
  Star, 
  Heart, 
  Share2, 
  Calendar,
  Users,
  Camera,
  Video,
  Check,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

// Mock data untuk vendor detail
const vendorData = {
  id: '1',
  name: 'Eternal Wedding',
  description: 'Eternal Wedding adalah wedding organizer premium dengan pengalaman lebih dari 10 tahun dalam mewujudkan pernikahan impian para pasangan. Kami mengkhususkan diri dalam pernikahan adat Jawa, modern, dan internasional dengan sentuhan elegan dan personal.',
  logo: '/api/placeholder/150/150',
  coverPhoto: '/api/placeholder/1200/400',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  city: 'Jakarta',
  province: 'DKI Jakarta',
  phone: '+62 21 1234 5678',
  whatsapp: '+62 812 3456 7890',
  email: 'info@eternalwedding.com',
  website: 'www.eternalwedding.com',
  instagram: '@eternalwedding',
  facebook: 'Eternal Wedding',
  rating: 4.8,
  reviewCount: 127,
  establishedYear: 2014,
  eventsHandled: 500,
  teamSize: 25,
  packages: [
    {
      id: '1',
      name: 'Silver Package',
      description: 'Paket pernikahan intimate untuk 100-200 tamu',
      price: 75000000,
      duration: '1 hari',
      includes: 'Dekorasi, Catering, Dokumentasi, Entertainment, MC',
      features: ['Dekorasi tema pilihan', 'Catering 3 menu', 'Dokumentasi foto & video', 'Entertainment band', 'MC profesional']
    },
    {
      id: '2',
      name: 'Gold Package',
      description: 'Paket pernikahan premium untuk 200-400 tamu',
      price: 150000000,
      duration: '2 hari',
      includes: 'Dekorasi premium, Catering lengkap, Dokumentasi lengkap, Entertainment premium, MC, Wedding planner',
      features: ['Dekorasi premium custom', 'Catering 5 menu + dessert', 'Dokumentasi 2 fotografer + videografer', 'Entertainment band + DJ', 'MC senior', 'Wedding planner personal', 'Pre-wedding photoshoot']
    },
    {
      id: '3',
      name: 'Diamond Package',
      description: 'Paket pernikahan mewah untuk 400+ tamu',
      price: 300000000,
      duration: '3 hari',
      includes: 'All-inclusive wedding service dengan sentuhan mewah',
      features: ['Dekorasi mewah internasional', 'Catering 8 menu + live cooking', 'Dokumentasi 3 fotografer + 2 videografer', 'Entertainment internasional', 'MC celebrity', 'Wedding planner team', 'Pre-wedding & post-wedding', 'Honeymoon package']
    }
  ],
  portfolios: [
    {
      id: '1',
      title: 'Adat Jawa Modern - Sarah & Budi',
      description: 'Pernikahan adat Jawa dengan sentuhan modern di Hotel Borobudur',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: null
    },
    {
      id: '2',
      title: 'Garden Party - Maya & Riko',
      description: 'Pernikahan outdoor dengan tema garden party',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: null
    },
    {
      id: '3',
      title: 'International Wedding - Lisa & John',
      description: 'Pernikahan internasional dengan tema rustic elegance',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: null
    },
    {
      id: '4',
      title: 'Beach Wedding - Diana & Alex',
      description: 'Intimate beach wedding di Bali',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: null
    },
    {
      id: '5',
      title: 'Traditional Chinese - Meilin & Wei',
      description: 'Pernikahan adat Tionghoa lengkap dengan semua tradisi',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: null
    },
    {
      id: '6',
      title: 'Minimalist Modern - Nina & Adam',
      description: 'Pernikahan modern dengan tema minimalist elegance',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: null
    }
  ],
  reviews: [
    {
      id: '1',
      userName: 'Sarah Putri',
      rating: 5,
      comment: 'Very professional team! They made our wedding day perfect. Every detail was taken care of with excellence.',
      date: '2024-01-15'
    },
    {
      id: '2',
      userName: 'Budi Santoso',
      rating: 4,
      comment: 'Great service and beautiful decoration. The team was very helpful throughout the planning process.',
      date: '2024-01-10'
    },
    {
      id: '3',
      userName: 'Maya Wijaya',
      rating: 5,
      comment: 'Absolutely stunning wedding! Eternal Wedding exceeded our expectations. Highly recommended!',
      date: '2024-01-05'
    }
  ]
}

export default function VendorDetail() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleContactWhatsApp = () => {
    const message = `Halo, saya tertarik dengan paket pernikahan dari ${vendorData.name}. Bisa saya dapatkan informasi lebih lanjut?`
    window.open(`https://wa.me/${vendorData.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Cover Photo */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={vendorData.coverPhoto}
          alt={vendorData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="outline" className="bg-white/90 hover:bg-white">
              ← Kembali
            </Button>
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Vendor Info Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  <img
                    src={vendorData.logo}
                    alt={vendorData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-serif text-black mb-2">{vendorData.name}</h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{vendorData.city}, {vendorData.province}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{vendorData.rating}</span>
                        <span>({vendorData.reviewCount} ulasan)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <Button
                      onClick={handleContactWhatsApp}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      Pesan Konsultasi
                    </Button>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                    <div className="text-2xl font-bold text-black">{vendorData.establishedYear}</div>
                    <div className="text-sm text-gray-600">Tahun Berdiri</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                    <div className="text-2xl font-bold text-black">{vendorData.eventsHandled}+</div>
                    <div className="text-sm text-gray-600">Event Ditangani</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Camera className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                    <div className="text-2xl font-bold text-black">{vendorData.teamSize}</div>
                    <div className="text-sm text-gray-600">Tim Profesional</div>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {vendorData.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="packages">Paket Layanan</TabsTrigger>
            <TabsTrigger value="portfolio">Portofolio</TabsTrigger>
            <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            <TabsTrigger value="contact">Kontak & Lokasi</TabsTrigger>
          </TabsList>
          
          {/* Packages Tab */}
          <TabsContent value="packages" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendorData.packages.map((pkg) => (
                <Card key={pkg.id} className="border border-gray-200 hover:border-yellow-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-black">{pkg.name}</CardTitle>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatPrice(pkg.price)}
                    </div>
                    <p className="text-gray-600">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Durasi: {pkg.duration}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                        Pilih Paket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorData.portfolios.map((item) => (
                <Card key={item.id} className="overflow-hidden group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.videoUrl && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-black mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-4">
              {vendorData.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-black">{review.userName}</div>
                        <div className="flex items-center gap-1 mt-1">
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
                      </div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Tulis Ulasan
              </Button>
            </div>
          </TabsContent>
          
          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Alamat</div>
                      <div className="text-gray-600">{vendorData.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Telepon</div>
                      <div className="text-gray-600">{vendorData.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">{vendorData.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a href={`https://${vendorData.website}`} className="text-blue-600 hover:underline">
                        {vendorData.website}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Instagram</div>
                      <a href={`https://instagram.com/${vendorData.instagram.replace('@', '')}`} className="text-blue-600 hover:underline">
                        {vendorData.instagram}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Facebook</div>
                      <div className="text-gray-600">{vendorData.facebook}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Peta Lokasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Peta akan ditampilkan di sini</p>
                      <p className="text-sm">Integrasi Google Maps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Portfolio"
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="outline"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}