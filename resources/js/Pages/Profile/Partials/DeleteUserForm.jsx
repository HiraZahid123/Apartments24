import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Delete Account
                </h2>

                <p className="text-slate-600 text-base">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton
                onClick={confirmUserDeletion}
                className="shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form className="card-blur rounded-2xl p-8 space-y-6" onSubmit={deleteUser}>
                    <h2 className="text-xl font-semibold text-slate-800">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="text-slate-600 text-sm">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={`w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="Password"
                            isFocused
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2 text-red-600 text-sm flex items-center gap-1"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <SecondaryButton className="px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-transform" onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            type="submit"
                            disabled={processing}
                            className="shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>

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
