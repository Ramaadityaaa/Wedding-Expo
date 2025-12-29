import { Link } from "@inertiajs/react";
import { MapPin } from "lucide-react";

export default function VendorCard({ vendor }) {
    const name = vendor?.name || "-";
    const city = vendor?.city || "Indonesia";
    const description = vendor?.description || "Tidak ada deskripsi singkat.";
    const coverPhoto = vendor?.coverPhoto || null;
    const rating = vendor?.rating || 0;

    return (
        <Link
            href={route("vendors.details", vendor.id)}
            className="group h-full block"
        >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden bg-gray-200">
                    {coverPhoto ? (
                        <img
                            src={coverPhoto}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-300">
                            <span className="text-4xl font-bold opacity-50">
                                {String(name).charAt(0)}
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {name}
                        </h3>
                    </div>

                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md w-fit">
                        <span className="text-amber-500 mr-1">★</span>
                        <span className="text-xs font-bold text-amber-700">
                            {Number(rating) > 0 ? rating : "New"}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3 mt-2">
                        <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                        <span className="truncate">{city}</span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                        {description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            Verified Vendor
                        </span>
                        <span className="text-sm text-gray-400 group-hover:translate-x-1 transition-transform">
                            Detail →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
