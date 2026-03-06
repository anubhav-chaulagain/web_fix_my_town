import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import UpdateUserForm from "../../../_components/UpdateUserForm";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response = await handleGetOneUser(id);

    if (!response.success) throw new Error(response.message || 'Failed to load user');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-2 mb-16 ml-40 max-w-3xl">
            <div className="flex items-center space-x-4">
                <Link href={`/admin/users/${id}`} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Edit User</h2>
                    <p className="text-slate-500 mt-1">Update user information.</p>
                </div>
            </div>
            <UpdateUserForm user={response.data} />
        </div>
    );
}