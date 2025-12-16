// resources/js/Pages/Profile/Partials/UpdatePasswordForm.jsx

import { useRef, useState } from 'react'; // <-- Tambahkan useState
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
// Import Icon (Pastikan Anda sudah menginstal library icon, contoh: Lucide React)
import { Eye, EyeOff } from 'lucide-react'; // <-- Asumsi menggunakan Lucide React

// --- KOMPONEN MOCK/KUSTOM (dianggap sudah benar & sinkron) ---
// ... (Kode komponen mock Label, Input, Button, InputError, Card, dsb. TIDAK BERUBAH) ...
const Label = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>;
const Input = ({ className = '', type = 'text', ...props }) => <input type={type} className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out ${className}`} {...props} />;
const Button = ({ children, disabled, type, className = '', ...props }) => <button disabled={disabled} type={type} className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 ${disabled ? 'bg-gray-300 text-gray-600' : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/50 hover:from-amber-600 hover:to-yellow-700 active:from-amber-700 active:to-yellow-800'} ${className}`} {...props}>{children}</button>;
const InputError = ({ message, className = '' }) => (message ? <p className={`text-sm font-medium text-red-600 mt-1 ${className}`}>{message}</p> : null);
const Card = ({ children, className = '' }) => <div className={`rounded-3xl border border-gray-100 bg-white text-gray-800 shadow-2xl shadow-gray-200/50 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 p-6 rounded-t-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-100 ${className}`}>{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight text-amber-700">{children}</h3>;
const CardDescription = ({ children }) => <p className="text-base text-gray-500 mt-1">{children}</p>;
const CardContent = ({ children }) => <div className="p-6">{children}</div>;
// --- END KOMPONEN MOCK/KUSTOM ---


// --- KOMPONEN INPUT BARU DENGAN TOMBOL MATA (TOGGLE) ---
const ToggleablePasswordInput = ({ label, id, value, onChange, error, inputRef, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Tentukan tipe input berdasarkan state showPassword
    const inputType = showPassword ? 'text' : 'password';

    return (
        <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    type={inputType} // Menggunakan tipe dinamis
                    className="block w-full pr-12" // Tambahkan padding kanan untuk tombol
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                    {/* Mengganti icon mata */}
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} 
                </button>
            </div>
            <InputError message={error} />
        </div>
    );
};
// --- END KOMPONEN INPUT BARU DENGAN TOMBOL MATA (TOGGLE) ---


export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        
        // --- PERBAIKAN Wajib: Ubah rute menjadi 'vendor.password.update' ---
        put(route('vendor.password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(), 
            onError: (errors) => {
                // Logika fokus tetap sama
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                    Ensure your account is using a long, random password to stay secure.
                </CardDescription>
            </CardHeader>
            
            <CardContent>
                <form onSubmit={updatePassword} className="space-y-6">
                    {/* Current Password (Menggunakan komponen baru) */}
                    <ToggleablePasswordInput
                        label="Current Password"
                        id="current_password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        error={errors.current_password}
                        inputRef={currentPasswordInput}
                        autoComplete="current-password"
                    />

                    {/* New Password (Menggunakan komponen baru) */}
                    <ToggleablePasswordInput
                        label="New Password"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        inputRef={passwordInput}
                        autoComplete="new-password"
                    />

                    {/* Confirm Password (Menggunakan komponen baru) */}
                    <ToggleablePasswordInput
                        label="Confirm Password"
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        autoComplete="new-password"
                    />

                    <div className="flex items-center gap-4 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-green-700 font-semibold">Password berhasil diperbarui!</p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}