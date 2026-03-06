"use client"
import Image from "next/image";
import { Card, Button } from "@/app/user/_components/Shared";
import { useAuth } from "@/app/context/AuthContext";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";
import { HelpCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { user, logout, loading, checkAuth } = useAuth();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [removedExisting, setRemovedExisting] = useState(false);
    const [fullname, setFullname] = useState('');
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('fullname', fullname || user?.fullname);
            if (selectedFile) formData.append('profilePicture', selectedFile);
            if (removedExisting) formData.append('removeProfilePicture', 'true');

            const res = await handleUpdateProfile(formData);
            if (res.success) {
                await checkAuth();
                setPreviewImage(null);
                setSelectedFile(undefined);
                setRemovedExisting(false);
                toast.success('Profile updated successfully');
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            toast.error(err.message || 'Profile update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        setSelectedFile(file);
    };

    const handleDismissImage = () => {
        setPreviewImage(null);
        setSelectedFile(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDiscard = () => {
        handleDismissImage();
        setRemovedExisting(false);
        setFullname(user?.fullname ?? '');
    };

    const handleForgotPassword = () => {
        router.push("/request-password-reset");
    }

    if (loading) {
        return (
            <section className="space-y-8 max-w-4xl mx-auto mt-8 mb-16">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
            </section>
        );
    }

    if (!user) return null;

    return (
        <section className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Your Profile</h2>
                <p className="text-slate-500 mt-1">Manage your personal information and application preferences.</p>
            </div>
            <Card>
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8 pb-8 border-b border-slate-100">
                    <div className="relative group">
                        <Image
                            src={
                                previewImage ??
                                (!removedExisting && user?.profilePicture
                                    ? `http://localhost:5050/uploads/${user.profilePicture}`
                                    : "/images/profile-placeholder.png")
                            }
                            width={150}
                            height={150}
                            className="rounded-full border-4 border-teal-50 shadow-md object-cover w-[150px] h-[150px]"
                            alt="Profile Picture"
                        />

                        {previewImage && (
                            <button
                                type="button"
                                onClick={handleDismissImage}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow"
                            >
                                ✕
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-200 hover:text-teal-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            className="hidden"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                        />
                    </div>

                    <div className="text-center sm:text-left pt-4">
                        <h3 className="text-2xl font-bold text-slate-800">{user?.fullname}</h3>
                        <p className="text-slate-500">{user?.email}</p>
                        {previewImage && (
                            <p className="text-xs text-teal-600 font-medium mt-1">
                                New photo staged — save to apply.
                            </p>
                        )}
                        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 uppercase tracking-wider">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                            value={fullname || user?.fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                            value={user?.email}
                            readOnly
                        />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
                        <div className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 cursor-pointer">
                            <HelpCircle size={18} />
                            <button onClick={handleForgotPassword} className="hover:cursor-pointer">Forgot Password</button>
                        </div>
                        <button
                            onClick={logout}
                            className="text-rose-600 font-bold text-sm hover:underline cursor-pointer"
                        >
                            Log out from all devices
                        </button>
                    </div>
                    <div className="flex space-x-3">
                        <Button variant="outline" type="button" onClick={handleDiscard}>
                            Discard Changes
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </div>
            </Card>
        </section>
    );
}