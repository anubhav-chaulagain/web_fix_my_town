import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/app/user/_components/Shared";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response = await handleGetOneUser(id);

    if (!response.success) throw new Error(response.message || 'Failed to load user');

    const user = response.data;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40 max-w-3xl">
            <div className="flex items-center space-x-4">
                <Link href="/admin/users" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">User Details</h2>
                    <p className="text-slate-500 mt-1 font-mono text-xs">{id}</p>
                </div>
            </div>

            <Card>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8 pb-8 border-b border-slate-100">
                    <div>
                        {user.profilePicture ? (
                            <Image
                                src={`http://localhost:5050/uploads/${user.profilePicture}`}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="rounded-full border-4 border-teal-50 shadow-md object-cover w-25 h-25"
                            />
                        ) : (
                            <Image
                                src="/images/profile-placeholder.png"
                                alt="Profile"
                                width={100}
                                height={100}
                                className="rounded-full border-4 border-teal-50 shadow-md object-cover w-25 h-25"
                            />
                        )}
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-slate-800">{user.fullname}</h3>
                        <p className="text-slate-500">{user.email}</p>
                        <div className="mt-3">
                            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 uppercase tracking-wider">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                        <p className="text-sm font-semibold text-slate-700">{user.fullname || '—'}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role</p>
                        <p className="text-sm font-semibold text-slate-700 capitalize">{user.role}</p>
                    </div>
                    {user.department && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</p>
                            <p className="text-sm font-semibold text-slate-700">{user.department}</p>
                        </div>
                    )}
                    {user.employeeId && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Employee ID</p>
                            <p className="text-sm font-mono text-slate-700">{user.employeeId}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                    <Link
                        href={`/admin/users/${id}/edit`}
                        className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-md"
                    >
                        Edit User
                    </Link>
                </div>
            </Card>
        </div>
    );
}