import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

// --- KOMPONEN UI ---
const Label = ({ children, htmlFor }) => (
    <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-1"
    >
        {children}
    </label>
);
const Input = ({ className = "", ...props }) => (
    <input
        className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${className}`}
        {...props}
    />
);
const TextArea = ({ className = "", ...props }) => (
    <textarea
        className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${className}`}
        {...props}
    />
);
const Select = ({ children, className = "", ...props }) => (
    <select
        className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${className}`}
        {...props}
    >
        {children}
    </select>
);
const Button = ({ children, disabled, className = "", ...props }) => (
    <button
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors h-10 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 ${className}`}
        {...props}
    >
        {children}
    </button>
);
const InputError = ({ message }) =>
    message ? (
        <p className="text-sm font-medium text-red-600 mt-1">{message}</p>
    ) : null;

export default function UpdateVendorBusinessForm({ className = "" }) {
    const user = usePage().props.auth.user;
    const vendor = user.vendor; // Data vendor yang sudah ada

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: vendor?.name || "",
            vendor_type: vendor?.vendor_type || "",
            whatsapp: vendor?.whatsapp || "",
            city: vendor?.city || "",
            province: vendor?.province || "",
            address: vendor?.address || "",
            pic_name: vendor?.pic_name || "", // PIC Name di tabel vendor
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("vendor.business.update"), {
            preserveScroll: true,
        });
    };

    return (
        <section
            className={`bg-white p-4 sm:p-8 shadow sm:rounded-lg ${className}`}
        >
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi Bisnis
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui detail bisnis, alamat, dan kontak vendor Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* GRID LAYOUT SUPAYA RAPI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Bisnis */}
                    <div className="md:col-span-2">
                        <Label htmlFor="business_name">
                            Nama Bisnis / Vendor
                        </Label>
                        <Input
                            id="business_name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Jenis Layanan */}
                    <div>
                        <Label htmlFor="vendor_type">Jenis Layanan</Label>
                        <Select
                            id="vendor_type"
                            value={data.vendor_type}
                            onChange={(e) =>
                                setData("vendor_type", e.target.value)
                            }
                        >
                            <option value="">-- Pilih Kategori --</option>
                            <option value="Wedding Organizer">
                                Wedding Organizer
                            </option>
                            <option value="Catering">Catering</option>
                            <option value="Decoration">Dekorasi</option>
                            <option value="Photography">
                                Fotografi & Videografi
                            </option>
                            <option value="MUA">MUA & Attire</option>
                            <option value="Venue">Venue</option>
                            <option value="Entertainment">
                                Hiburan / Musik
                            </option>
                        </Select>
                        <InputError message={errors.vendor_type} />
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <Label htmlFor="whatsapp">Nomor WhatsApp Bisnis</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                    +62
                                </span>
                            </div>
                            <Input
                                id="whatsapp"
                                type="tel"
                                className="pl-12"
                                value={data.whatsapp}
                                onChange={(e) =>
                                    setData("whatsapp", e.target.value)
                                }
                                placeholder="81234567890"
                            />
                        </div>
                        <InputError message={errors.whatsapp} />
                    </div>

                    {/* Kota */}
                    <div>
                        <Label htmlFor="city">Kota Domisili</Label>
                        <Input
                            id="city"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                        />
                        <InputError message={errors.city} />
                    </div>

                    {/* Provinsi */}
                    <div>
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                            id="province"
                            value={data.province}
                            onChange={(e) =>
                                setData("province", e.target.value)
                            }
                        />
                        <InputError message={errors.province} />
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="md:col-span-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <TextArea
                            id="address"
                            rows="3"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                        />
                        <InputError message={errors.address} />
                    </div>

                    {/* PIC Name */}
                    <div className="md:col-span-2">
                        <Label htmlFor="pic_name">
                            Nama Penanggung Jawab (PIC)
                        </Label>
                        <Input
                            id="pic_name"
                            value={data.pic_name}
                            onChange={(e) =>
                                setData("pic_name", e.target.value)
                            }
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Nama ini digunakan untuk keperluan administrasi.
                        </p>
                        <InputError message={errors.pic_name} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>
                        {processing ? "Menyimpan..." : "Simpan Data Bisnis"}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-semibold">
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
