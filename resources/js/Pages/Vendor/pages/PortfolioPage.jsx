import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Video,
    Loader2,
    PlayCircle,
} from "lucide-react";

export default function PortfolioPage({ auth, portfolios }) {
    // State untuk Tipe Media (image / video)
    const [mediaType, setMediaType] = useState("image"); // default 'image'
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        image: null,
        video: null,
    });

    // Handle File Change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (mediaType === "image") {
                setData("image", file);
                setPreview(URL.createObjectURL(file));
            } else {
                setData("video", file);
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("vendor.portfolio.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                setData({
                    title: "",
                    description: "",
                    image: null,
                    video: null,
                });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus item ini?")) {
            router.delete(route("vendor.portfolio.destroy", id));
        }
    };

    return (
        <VendorLayout user={auth.user} header="Manajemen Portofolio">
            <Head title="Portofolio Vendor" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- BAGIAN 1: FORM UPLOAD DENGAN TAB --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            Unggah Media Baru
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Pilihan Tipe Media (Tab Style) */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Tab Foto */}
                                <div
                                    onClick={() => {
                                        setMediaType("image");
                                        setPreview(null);
                                        setData("video", null);
                                    }}
                                    className={`cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                                        mediaType === "image"
                                            ? "border-amber-500 bg-amber-50 ring-2 ring-amber-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <ImageIcon
                                        className={`w-10 h-10 mb-2 ${
                                            mediaType === "image"
                                                ? "text-amber-600"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span
                                        className={`font-semibold ${
                                            mediaType === "image"
                                                ? "text-amber-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Unggah Foto
                                    </span>
                                </div>

                                {/* Tab Video */}
                                <div
                                    onClick={() => {
                                        setMediaType("video");
                                        setPreview(null);
                                        setData("image", null);
                                    }}
                                    className={`cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                                        mediaType === "video"
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <Video
                                        className={`w-10 h-10 mb-2 ${
                                            mediaType === "video"
                                                ? "text-blue-600"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span
                                        className={`font-semibold ${
                                            mediaType === "video"
                                                ? "text-blue-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Unggah Video
                                    </span>
                                </div>
                            </div>

                            {/* Area Input File & Detail */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Preview Area */}
                                    <div className="md:col-span-1">
                                        <div className="relative h-48 bg-white rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden group">
                                            {preview ? (
                                                mediaType === "image" ? (
                                                    <img
                                                        src={preview}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <video
                                                        src={preview}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                    />
                                                )
                                            ) : (
                                                <div className="text-center text-gray-400">
                                                    <p className="text-xs">
                                                        Preview{" "}
                                                        {mediaType === "image"
                                                            ? "Foto"
                                                            : "Video"}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Input File Hidden tapi bisa diklik lewat overlay */}
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 cursor-pointer transition">
                                                <input
                                                    type="file"
                                                    accept={
                                                        mediaType === "image"
                                                            ? "image/*"
                                                            : "video/*"
                                                    }
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition">
                                                    Pilih File
                                                </span>
                                            </label>
                                        </div>
                                        {errors.image && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.image}
                                            </p>
                                        )}
                                        {errors.video && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.video}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form Input Text */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Judul
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder={`Judul ${
                                                    mediaType === "image"
                                                        ? "Foto"
                                                        : "Video"
                                                }`}
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Deskripsi
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                                                rows="2"
                                                placeholder="Keterangan singkat..."
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`flex items-center px-6 py-2 rounded-lg text-white font-bold shadow-md transition ${
                                                    mediaType === "image"
                                                        ? "bg-amber-600 hover:bg-amber-700"
                                                        : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                            >
                                                {processing && (
                                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                )}
                                                Simpan{" "}
                                                {mediaType === "image"
                                                    ? "Foto"
                                                    : "Video"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* --- BAGIAN 2: GALERI GRID --- */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            Galeri Portofolio ({portfolios.length} Item)
                        </h3>
                    </div>

                    {portfolios.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {portfolios.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="relative h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
                                        {/* RENDER VIDEO VS IMAGE */}
                                        {item.videoUrl ? (
                                            <>
                                                <video
                                                    src={`/storage/${item.videoUrl}`}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                                                    controls={false} // Disable controls di thumbnail
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <PlayCircle className="w-12 h-12 text-white opacity-80" />
                                                </div>
                                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                    VIDEO
                                                </div>
                                            </>
                                        ) : (
                                            <img
                                                src={
                                                    item.imageUrl
                                                        ? `/storage/${item.imageUrl}`
                                                        : "https://via.placeholder.com/400"
                                                }
                                                alt={item.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                            />
                                        )}

                                        {/* Tombol Hapus */}
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700 z-10"
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h4
                                            className="font-bold text-gray-800 truncate"
                                            title={item.title}
                                        >
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {item.description ||
                                                "Tidak ada deskripsi."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="flex justify-center gap-2 mb-4">
                                <ImageIcon className="w-12 h-12 text-gray-300" />
                                <Video className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Belum ada media
                            </h3>
                            <p className="text-gray-500">
                                Unggah foto atau video untuk mempercantik profil
                                Anda.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </VendorLayout>
    );
}
