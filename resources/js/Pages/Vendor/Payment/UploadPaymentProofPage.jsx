import React, { useState, useCallback, useMemo, useRef } from "react";
import { router, useForm, Head } from "@inertiajs/react";
import { AlertTriangle, Loader2, CheckCircle, XCircle } from "lucide-react";

const PRIMARY_COLOR = "#D97706";
const SECONDARY_COLOR = "#FCD34D";
const ACCENT_CLASS = "text-amber-700";

const UploadCloudIcon = ({
    className = "w-10 h-10",
    color = PRIMARY_COLOR,
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
               {" "}
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.5" />
                <path d="M12 12v9" />
                <path d="m8 17 4 4 4-4" />   {" "}
    </svg>
);

const FileTextIcon = ({ className = "w-5 h-5", color = PRIMARY_COLOR }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
               {" "}
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />   {" "}
    </svg>
);

const LargeCheckIcon = ({ color = "white" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
                <path d="M22 4L12 14.01l-3-3" />   {" "}
    </svg>
);

const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

const PaymentHeaderCard = ({ title }) => (
    <div className="p-8 md:p-10 rounded-t-2xl text-white shadow-lg flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-400">
               {" "}
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide">
                        {title}       {" "}
        </h2>
                <LargeCheckIcon color="white" />   {" "}
    </div>
);

const DetailItem = ({ label, value, highlight = false, valueStyle = {} }) => (
    <div className="flex justify-between border-b border-gray-100 py-3">
                <span className="text-gray-600 font-medium">{label}</span>     
         {" "}
        <span
            className={`text-right ${
                highlight
                    ? "font-mono text-gray-900 font-extrabold"
                    : "text-gray-800"
            }`}
            style={valueStyle}
        >
                        {value}       {" "}
        </span>
           {" "}
    </div>
);

// Menerima props yang dikirim dari PaymentController@uploadProofPage
export default function UploadPaymentProofPage({
    auth,
    amount,
    accountName,
    invoiceId,
    total,
}) {
    // Pastikan data diinisialisasi dengan benar dari props
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            invoiceId: invoiceId, // Wajib dikirim kembali
            amount: amount || total || 0, // Ambil jumlah dari props
            account_name: accountName || "Tidak Diketahui", // Ambil nama akun dari props
            payment_proof: null,
        });

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // File validation logic
    const handleFileChange = useCallback(
        (file) => {
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    // Max 5MB
                    setError("payment_proof", "Ukuran file melebihi 5MB.");
                    setSelectedFile(null);
                    setData("payment_proof", null);
                    return;
                }
                if (
                    !["image/jpeg", "image/png", "application/pdf"].includes(
                        file.type
                    )
                ) {
                    setError(
                        "payment_proof",
                        "Hanya format JPG, PNG, atau PDF yang diizinkan."
                    );
                    setSelectedFile(null);
                    setData("payment_proof", null);
                    return;
                }

                clearErrors("payment_proof");
                setSelectedFile(file);
                setData("payment_proof", file);
            }
        },
        [setData, setError, clearErrors]
    );

    // Drag and Drop handlers
    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleFileChange(files[0]);
            }
        },
        [handleFileChange]
    );

    // Drag Over handler untuk styling hover
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }; // Submit action (menggunakan router.post untuk file upload)

    const submit = (e) => {
        e.preventDefault();

        if (!data.payment_proof) {
            setError("payment_proof", "Bukti pembayaran wajib diunggah.");
            return;
        } // Post ke route store payment proof

        post(route("vendor.payment.proof.store"), {
            forceFormData: true, // Wajib untuk mengirim file
            onSuccess: () => {
                // Controller akan me-redirect ke halaman loading
            },
            onError: (errors) => {
                console.error("Server errors:", errors); // Tampilkan error umum jika ada masalah non-validation
            },
        });
    };

    const isFileSelected = useMemo(() => !!selectedFile, [selectedFile]);

    return (
        <div className="font-sans min-h-screen bg-gray-50 flex justify-center items-start pt-16 pb-20">
                        <Head title="Upload Bukti Pembayaran" />           {" "}
            <div className="max-w-5xl w-full mx-4 sm:mx-8 lg:mx-12">
                               {" "}
                <div className="bg-white overflow-hidden shadow-2xl rounded-2xl border-b-8 border-amber-500">
                                       {" "}
                    <PaymentHeaderCard title="UNGGAH BUKTI PEMBAYARAN" />       
                               {" "}
                    <form onSubmit={submit}>
                                               {" "}
                        <div className="p-8 md:p-12 text-gray-800 grid grid-cols-1 md:grid-cols-3 gap-10">
                                                       {" "}
                            <div className="space-y-8 md:col-span-1">
                                                               {" "}
                                <h3
                                    className={`text-2xl font-bold border-b pb-3 mb-4 ${ACCENT_CLASS} border-amber-200`}
                                >
                                                                        Detail
                                    Tagihan Pembayaran                          
                                         {" "}
                                </h3>
                                                               {" "}
                                <div className="space-y-4 text-base">
                                                                       {" "}
                                    <DetailItem
                                        label="Nama Rekening Pengirim"
                                        value={data.account_name}
                                        highlight={true}
                                    />
                                                                       {" "}
                                    <DetailItem
                                        label="Nomor Invoice"
                                        value={`#${invoiceId}`}
                                    />
                                                                       {" "}
                                    <DetailItem
                                        label="Total Harus Dibayar"
                                        value={formatCurrency(data.amount)}
                                        valueStyle={{
                                            color: PRIMARY_COLOR,
                                            fontWeight: "bold",
                                            fontSize: "1.25rem",
                                        }}
                                    />
                                                                   {" "}
                                </div>
                                                               {" "}
                                <div className="p-5 rounded-xl text-base shadow-md bg-amber-50 border border-amber-200">
                                                                       {" "}
                                    <p className="font-extrabold text-amber-700">
                                        PENTING:
                                    </p>
                                                                       {" "}
                                    <p className="text-sm mt-2 text-gray-700">
                                        Bukti transfer harus mencantumkan
                                        tanggal, jumlah, dan tujuan rekening
                                        yang sesuai agar verifikasi berhasil.
                                    </p>
                                                                   {" "}
                                </div>
                                                           {" "}
                            </div>
                                                       {" "}
                            <div className="space-y-8 md:col-span-2">
                                                               {" "}
                                <h3
                                    className={`text-2xl font-bold border-b pb-3 mb-4 ${ACCENT_CLASS} border-amber-200`}
                                >
                                                                        Formulir
                                    Unggah Bukti Transfer                      
                                             {" "}
                                </h3>
                                                               {" "}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragOver}
                                    onDrop={handleDrop}
                                    className={`relative p-12 h-64 rounded-2xl border-4 border-dashed transition-all cursor-pointer hover:bg-gray-50 flex items-center justify-center
                                        ${
                                        errors.payment_proof
                                            ? "border-red-500 bg-red-50"
                                            : isFileSelected
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300"
                                    }
                                    `}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                                                       {" "}
                                    <input
                                        type="file"
                                        id="file_upload"
                                        name="payment_proof"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            handleFileChange(e.target.files[0])
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        ref={fileInputRef}
                                    />
                                                                       {" "}
                                    <div className="text-center space-y-3">
                                                                               {" "}
                                        <UploadCloudIcon
                                            className="w-20 h-20 mx-auto"
                                            color={
                                                errors.payment_proof
                                                    ? "#EF4444"
                                                    : isFileSelected
                                                    ? "#10B981"
                                                    : PRIMARY_COLOR
                                            }
                                        />
                                                                               {" "}
                                        <p className="font-extrabold text-xl text-gray-700">
                                                                               
                                                    Seret File Bukti Pembayaran
                                            ke Sini                            
                                                       {" "}
                                        </p>
                                                                               {" "}
                                        <p className="text-base text-gray-500">
                                                                               
                                                    atau{" "}
                                            <span className="font-semibold text-amber-500">
                                                klik di mana saja
                                            </span>{" "}
                                            untuk memilih file                  
                                                                 {" "}
                                        </p>
                                                                               {" "}
                                        <p className="text-sm text-gray-400">
                                                                               
                                                    Format: JPG, PNG, atau PDF.
                                            Maks 5 MB.                          
                                                         {" "}
                                        </p>
                                                                           {" "}
                                    </div>
                                                                   {" "}
                                </div>
                                                               {" "}
                                {isFileSelected && !errors.payment_proof && (
                                    <div className="flex items-center p-4 rounded-xl border bg-white shadow-lg border-green-500">
                                                                               {" "}
                                        <FileTextIcon
                                            color="#10B981"
                                            className="w-6 h-6 flex-shrink-0"
                                        />
                                                                               {" "}
                                        <span className="ml-4 text-base font-semibold text-gray-700 truncate">
                                                                               
                                                    {selectedFile.name}         
                                                                         {" "}
                                        </span>
                                                                               {" "}
                                        <span className="ml-auto text-sm text-gray-500 font-mono">
                                                                               
                                                    (
                                            {(
                                                selectedFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB)                                
                                                   {" "}
                                        </span>
                                                                           {" "}
                                    </div>
                                )}
                                                               {" "}
                                {errors.payment_proof && (
                                    <div className="text-base text-red-700 p-4 rounded-xl bg-red-100 border border-red-400 font-medium">
                                                                               {" "}
                                        <p className="font-bold">
                                            Gagal Mengunggah:
                                        </p>
                                                                               {" "}
                                        <p>{errors.payment_proof}</p>           
                                                               {" "}
                                    </div>
                                )}
                                                               {" "}
                                <button
                                    type="submit"
                                    disabled={processing || !isFileSelected}
                                    className="w-full text-white font-extrabold py-5 px-6 rounded-xl text-xl shadow-2xl transition-all disabled:opacity-50 mt-6 transform hover:scale-[1.01]"
                                    style={{
                                        backgroundColor: PRIMARY_COLOR,
                                        backgroundImage: `linear-gradient(90deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                                        backgroundSize: "200% 100%",
                                        boxShadow: `0 10px 20px -5px ${PRIMARY_COLOR}60`,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundPosition =
                                            "right center")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundPosition =
                                            "left center")
                                    }
                                >
                                                                       {" "}
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                                                               
                                                   {" "}
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                                               
                                                               {" "}
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                                               
                                                               {" "}
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                                                               
                                                           {" "}
                                            </svg>
                                                                               
                                                    Mengunggah & Memproses...  
                                                                               
                                             {" "}
                                        </span>
                                    ) : (
                                        "Kirim Bukti Pembayaran"
                                    )}
                                                                   {" "}
                                </button>
                                                               {" "}
                                <p className="text-sm text-gray-500 pt-4 text-center">
                                                                        Setelah
                                    dikirim, verifikasi memakan waktu 1–2 jam
                                    kerja.                                {" "}
                                </p>
                                                           {" "}
                            </div>
                                                   {" "}
                        </div>
                                           {" "}
                    </form>
                                   {" "}
                </div>
                                           {" "}
            </div>
                   {" "}
        </div>
    );
}
