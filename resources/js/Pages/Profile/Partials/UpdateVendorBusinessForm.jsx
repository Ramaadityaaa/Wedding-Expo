import React, { useMemo, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import {
    Building2,
    MapPin,
    Phone,
    UserRound,
    BadgeCheck,
    CheckCircle2,
} from "lucide-react";

const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700">
        {children}
    </label>
);

const Input = ({ className = "", type = "text", ...props }) => (
    <input
        type={type}
        className={[
            "h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800",
            "placeholder:text-gray-400",
            "outline-none transition",
            "focus:border-amber-300 focus:ring-4 focus:ring-amber-200/60",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
        ].join(" ")}
        {...props}
    />
);

const TextArea = ({ className = "", ...props }) => (
    <textarea
        className={[
            "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800",
            "placeholder:text-gray-400",
            "outline-none transition",
            "focus:border-amber-300 focus:ring-4 focus:ring-amber-200/60",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
        ].join(" ")}
        {...props}
    />
);

const Select = ({ children, className = "", ...props }) => (
    <select
        className={[
            "h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800",
            "outline-none transition",
            "focus:border-amber-300 focus:ring-4 focus:ring-amber-200/60",
            className,
        ].join(" ")}
        {...props}
    >
        {children}
    </select>
);

const Button = ({ children, disabled, className = "", ...props }) => (
    <button
        disabled={disabled}
        className={[
            "inline-flex items-center justify-center gap-2",
            "h-11 px-6 rounded-2xl text-sm font-semibold",
            "transition",
            "focus:outline-none focus:ring-4 focus:ring-amber-200/70",
            disabled
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-sm hover:shadow-md hover:from-amber-600 hover:to-yellow-700 active:from-amber-700 active:to-yellow-800",
            className,
        ].join(" ")}
        {...props}
    >
        {children}
    </button>
);

const InputError = ({ message }) =>
    message ? <p className="text-sm font-semibold text-red-600 mt-2">{message}</p> : null;

const CardShell = ({ children, className = "" }) => (
    <div
        className={[
            "w-full rounded-3xl bg-white",
            "border border-gray-100",
            "shadow-sm hover:shadow-xl transition-shadow duration-300",
            "overflow-hidden",
            className,
        ].join(" ")}
    >
        {children}
    </div>
);

const CardHeader = ({ title, description }) => (
    <div className="p-6 sm:p-7 bg-gradient-to-r from-amber-50 via-white to-yellow-50 border-b border-gray-100">
        <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100/60 border border-amber-100 flex items-center justify-center shadow-sm">
                <Building2 className="h-6 w-6 text-amber-700" />
            </div>

            <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

const FieldLabelRow = ({ icon: Icon, label, htmlFor }) => (
    <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Icon className="h-4 w-4 text-amber-700" />
        <Label htmlFor={htmlFor}>{label}</Label>
    </div>
);

export default function UpdateVendorBusinessForm({ className = "" }) {
    const page = usePage().props || {};
    const user = page?.auth?.user;

    const vendor = useMemo(() => user?.vendor || null, [user]);

    const [hasTypedWhatsapp, setHasTypedWhatsapp] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: vendor?.name || "",
        vendor_type: vendor?.vendor_type || "Wedding Organizer",
        whatsapp: vendor?.whatsapp || "",
        city: vendor?.city || "",
        province: vendor?.province || "",
        address: vendor?.address || "",
        pic_name: vendor?.pic_name || "",
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route("vendor.business.update"), {
            preserveScroll: true,
        });
    };

    const handleWhatsappChange = (raw) => {
        setHasTypedWhatsapp(true);
        // hanya angka
        const cleaned = String(raw || "").replace(/\D/g, "");
        // biar konsisten: buang leading 0 jika user ketik 08...
        const normalized = cleaned.startsWith("0") ? cleaned.slice(1) : cleaned;
        setData("whatsapp", normalized);
    };

    return (
        <CardShell className={className}>
            <CardHeader
                title="Informasi Bisnis"
                description="Perbarui detail bisnis vendor kamu. Data ini dipakai untuk profil publik dan administrasi."
            />

            <div className="p-6 sm:p-7">
                {!vendor && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200">
                                <BadgeCheck className="h-5 w-5 text-amber-700" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-amber-900">
                                    Data vendor belum tersedia.
                                </p>
                                <p className="mt-1 text-sm text-amber-800">
                                    Pastikan akun kamu sudah terdaftar sebagai vendor.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <FieldLabelRow icon={Building2} label="Nama Bisnis atau Vendor" htmlFor="name" />
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Contoh: Tita Wedding Organizer"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <FieldLabelRow icon={BadgeCheck} label="Jenis Layanan" htmlFor="vendor_type" />
                            <Select
                                id="vendor_type"
                                value={data.vendor_type}
                                onChange={(e) => setData("vendor_type", e.target.value)}
                                required
                            >
                                <option value="">Pilih kategori</option>
                                <option value="Wedding Organizer">Wedding Organizer</option>
                            </Select>
                            <InputError message={errors.vendor_type} />
                        </div>

                        <div>
                            <FieldLabelRow icon={Phone} label="Nomor WhatsApp" htmlFor="whatsapp" />

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">+62</span>
                                </div>

                                <Input
                                    id="whatsapp"
                                    type="tel"
                                    className="pl-12"
                                    value={data.whatsapp}
                                    onChange={(e) => handleWhatsappChange(e.target.value)}
                                    placeholder="81234567890"
                                    required
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Simpan tanpa 0 di depan. Contoh 0812xxxx menjadi 812xxxx.
                            </p>

                            {!errors.whatsapp && hasTypedWhatsapp && data.whatsapp.length > 0 && data.whatsapp.length < 9 && (
                                <p className="mt-2 text-xs font-semibold text-amber-700">
                                    Nomor terlihat terlalu pendek.
                                </p>
                            )}

                            <InputError message={errors.whatsapp} />
                        </div>

                        <div>
                            <FieldLabelRow icon={MapPin} label="Kota" htmlFor="city" />
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) => setData("city", e.target.value)}
                                placeholder="Contoh: Makassar"
                                required
                            />
                            <InputError message={errors.city} />
                        </div>

                        <div>
                            <FieldLabelRow icon={MapPin} label="Provinsi" htmlFor="province" />
                            <Input
                                id="province"
                                value={data.province}
                                onChange={(e) => setData("province", e.target.value)}
                                placeholder="Contoh: Sulawesi Selatan"
                                required
                            />
                            <InputError message={errors.province} />
                        </div>

                        <div className="md:col-span-2">
                            <FieldLabelRow icon={MapPin} label="Alamat Lengkap" htmlFor="address" />
                            <TextArea
                                id="address"
                                rows={3}
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                                placeholder="Nama jalan, nomor, kecamatan, detail patokan..."
                                required
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="md:col-span-2">
                            <FieldLabelRow icon={UserRound} label="Nama Penanggung Jawab (PIC)" htmlFor="pic_name" />
                            <Input
                                id="pic_name"
                                value={data.pic_name}
                                onChange={(e) => setData("pic_name", e.target.value)}
                                placeholder="Contoh: Agus"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Nama PIC digunakan untuk keperluan administrasi.
                            </p>
                            <InputError message={errors.pic_name} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Button disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Data Bisnis"}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-3 py-2">
                                <CheckCircle2 className="h-4 w-4 text-green-700" />
                                <p className="text-sm font-semibold text-green-800">
                                    Data bisnis tersimpan
                                </p>
                            </div>
                        </Transition>
                    </div>
                </form>
            </div>
        </CardShell>
    );
}
