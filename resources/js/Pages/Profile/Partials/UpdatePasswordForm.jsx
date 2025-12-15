// resources/js/Pages/Profile/Partials/UpdatePasswordForm.jsx

import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

// --- KOMPONEN MOCK/KUSTOM (DIANGGAP SUDAH BENAR & SINKRON) ---
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


export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    // Kunci Dinamis: Inisialisasi useForm untuk field password
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        
        // Kunci Dinamis: Mengirim permintaan PUT ke rute 'password.update'
        // Rute ini akan ditangani oleh PasswordController@update
        put(route('password.update'), {
            preserveScroll: true,
            // Setelah sukses, kita hapus isi field form password
            onSuccess: () => reset(), 
            // Jika ada error (misalnya, password lama salah), kita atur fokus
            onError: (errors) => {
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
            {/* Header Card yang sinkron */}
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                    Ensure your account is using a long, random password to stay secure.
                </CardDescription>
            </CardHeader>
            
            <CardContent>
                <form onSubmit={updatePassword} className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-1">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="block w-full"
                            autoComplete="current-password"
                        />
                        <InputError message={errors.current_password} />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="block w-full"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="block w-full"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        {/* Menggunakan komponen Button kustom */}
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>

                        <Transition
                             // Menggunakan `recentlySuccessful` dari useForm untuk menampilkan pesan sukses
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-green-700 font-semibold">Berhasil disimpan!</p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}