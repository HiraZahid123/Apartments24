import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile Settings</h2>
            }
        >
            <Head title="Profile" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

