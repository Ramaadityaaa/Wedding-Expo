import React from 'react';

// --- START MOCKING SECTION FOR CANVAS COMPILATION ---
// Mock Inertia useForm
const useForm = (initialData) => { 
    const [data, setData] = React.useState(initialData);
    const [errors, setErrors] = React.useState({});
    const [processing, setProcessing] = React.useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = React.useState(false);
    
    const patch = (route) => {
        console.log(`Patching data to route: ${route}`, data);
        setProcessing(true);
        // Simulasikan success
        setTimeout(() => {
            setProcessing(false);
            setRecentlySuccessful(true);
            console.log('Update Successful (Mock)');
            setTimeout(() => setRecentlySuccessful(false), 2000);
        }, 1000);
    };
    return { data, setData, patch, errors, processing, recentlySuccessful };
};

// Mock Inertia usePage and Link
const usePage = () => ({ 
    props: { auth: { user: { name: 'Customer Mock', email: 'customer.mock@example.com', email_verified_at: null } } }
});
const Link = ({ href, children, ...props }) => <a href={href} className={props.className} {...props}>{children}</a>;
const route = (name) => `/${name}`;

// Mock Komponen UI (dengan gaya Amber/Emas)
const Label = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>;
const Input = ({ className = '', type = 'text', ...props }) => <input type={type} className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out ${className}`} {...props} />;
const Button = ({ children, disabled, type, className = '', ...props }) => <button disabled={disabled} type={type} className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 ${disabled ? 'bg-gray-300 text-gray-600' : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/50 hover:from-amber-600 hover:to-yellow-700 active:from-amber-700 active:to-yellow-800'} ${className}`} {...props}>{children}</button>;
const InputError = ({ message }) => (message ? <p className="text-sm font-medium text-red-600 mt-1">{message}</p> : null);

// Mock Card Components
const Card = ({ children, className = '' }) => <div className={`rounded-3xl border border-gray-100 bg-white text-gray-800 shadow-2xl shadow-gray-200/50 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 p-6 rounded-t-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-100 ${className}`}>{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-3xl font-bold leading-none tracking-tight text-amber-700">{children}</h3>;
const CardDescription = ({ children }) => <p className="text-base text-gray-500 mt-1">{children}</p>;
const CardContent = ({ children }) => <div className="p-6">{children}</div>;
// --- END MOCKING SECTION ---


export default function UpdateProfileInformationForm({ mustVerifyEmail = false, status, className = '' }) {
    // Menggunakan usePage mock
    const user = usePage().props.auth.user;

    // Menggunakan useForm mock
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan fungsi route mock
        patch(route('profile.update'));
    };

    return (
        <Card className={`max-w-xl mx-auto ${className}`}>
            <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                    Perbarui informasi profil dan alamat email akun Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    {/* Nama */}
                    <div className="space-y-1">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            className="block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            className="block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-lg">
                            <p className="text-sm text-amber-800">
                                Alamat email Anda belum diverifikasi.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="underline text-sm font-medium text-amber-600 hover:text-amber-800 ml-1 focus:outline-none"
                                >
                                    Klik di sini untuk mengirim ulang email verifikasi.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-700">
                                    Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>

                        {recentlySuccessful && (
                            <p className="text-sm text-green-700 font-semibold transition-opacity duration-300">Berhasil disimpan!</p>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}