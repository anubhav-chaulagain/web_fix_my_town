"use client";
import { Controller, useForm } from "react-hook-form";
import { UserData, UpdateUserSchema, UpdateUserData } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { Card, Button } from "@/app/user/_components/Shared";
import Image from "next/image";

export default function UpdateUserForm({ user }: { user: any }) {
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UpdateUserData>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            fullname: user.fullname || '',
            email: user.email || '',
            role: user.role || '',
            profilePicture: undefined,
        }
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (data: UpdateUserData) => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                if (data.fullname) formData.append('fullname', data.fullname);
                if (data.email) formData.append('email', data.email);
                if (data.role) formData.append('role', data.role);
                if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

                const response = await handleUpdateUser(user._id, formData);
                if (!response.success) throw new Error(response.message || 'Update failed');

                toast.success('User updated successfully');
            } catch (error: any) {
                toast.error(error.message || 'Update failed');
            }
        });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
                    <div className="relative">
                        <Image
                            src={
                                previewImage ??
                                (user.profilePicture
                                    ? `http://localhost:5050/uploads/${user.profilePicture}`
                                    : "/images/profile-placeholder.png")
                            }
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-teal-50 shadow-md object-cover w-20 h-20"
                        />
                        {previewImage && (
                            <Controller
                                name="profilePicture"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleDismissImage(onChange)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow"
                                    >
                                        ✕
                                    </button>
                                )}
                            />
                        )}
                        <Controller
                            name="profilePicture"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg border border-slate-200 hover:text-teal-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                    />
                                </>
                            )}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">{user.fullname}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                        {previewImage && (
                            <p className="text-xs text-teal-600 font-medium mt-1">New photo staged — save to apply.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                            {...register("fullname")}
                        />
                        {errors.fullname && <p className="text-xs text-red-600">{errors.fullname.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                            {...register("role")}
                        >
                            <option value="citizen">Citizen</option>
                            <option value="authority">Authority</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
                    <Button variant="outline" type="button" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting || pending}>
                        {isSubmitting || pending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}