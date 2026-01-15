import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`${className}`}>
            <header>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Profile Information
                </h2>

                <p className="text-slate-600 text-base">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className={`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError
                        className="mt-2 text-red-600 text-sm flex items-center gap-1"
                        message={errors.name}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className={`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError
                        className="mt-2 text-red-600 text-sm flex items-center gap-1"
                        message={errors.email}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-700">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-sm text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-600">Saved.</p>
                    </Transition>
                </div>

            </form>

            {/* Optional custom styles */}
            <style jsx>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: calc(200px + 100%) 0; }
                }
                .shimmer-button {
                    background: linear-gradient(135deg, #2563EB, #3B82F6, #1D4ED8);
                    background-size: 200% 200%;
                    animation: gradientShift 3s ease infinite;
                    position: relative;
                    overflow: hidden;
                }
                .shimmer-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    animation: shimmer 2s infinite;
                }
                .card-blur {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }
                .card-blur:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
                }
                .form-input {
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                    background: rgba(255, 255, 255, 0.9);
                }
                .form-input:focus {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 25px -3px rgb(37 99 235 / 0.1);
                    background: rgba(255, 255, 255, 1);
                }
            `}</style>
        </section>
    );
}
