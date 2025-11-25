// navItems.js
import { LayoutDashboard, DollarSign, Users, MessageSquare, FileText, FileBadge, CreditCard } from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { name: 'KonfirmasiPembayaran', icon: DollarSign, label: 'Konfirmasi Bayar' },
  { name: 'Vendor', icon: Users, label: 'Vendor' },
  { name: 'Users', icon: Users, label: 'Pengguna' },
  { name: 'Reviews', icon: MessageSquare, label: 'Ulasan' },
  { name: 'StaticContent', icon: FileText, label: 'Konten Statis' },
  { name: 'EditRole', icon: FileBadge, label: 'Edit Role' },
  { name: 'Payment', icon: CreditCard, label: 'Payment' },
];
