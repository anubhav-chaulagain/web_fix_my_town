'use client'

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import Image from "next/image";
import { Card, Button } from "@/app/user/_components/Shared";

const DEPARTMENTS = [
    { value: "Public Works", label: "Public Works" },
    { value: "Water & Sanitation", label: "Water & Sanitation" },
    { value: "Roads & Transportation", label: "Roads & Transportation" },
    { value: "Waste Management", label: "Waste Management" },
    { value: "Electrical Services", label: "Electrical Services" },
    { value: "Parks & Recreation", label: "Parks & Recreation" },
    { value: "Environmental Services", label: "Environmental Services" },
];

const inputClass = "w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700";
const labelClass = "text-sm font-medium text-slate-700";
const errorClass = "text-xs text-red-500 mt-1";

export default function CreateUserPage() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm<UserData>({
        resolver: zodResolver(UserSchema)
    });

    const selectedRole = watch("role", "citizen");

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

    const onSubmit = async (data: UserData) => {
        try {
            const formData = new FormData();
            formData.append('fullname', data.fullname);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('role', data.role);
            if (data.profilePicture) formData.append('profilePicture', data.profilePicture);
            if (data.role === 'authority') {
                if (data.department) formData.append('department', data.department);
                if (data.employeeId) formData.append('employeeId', data.employeeId);
                if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
            }

            const response = await handleCreateUser(formData);
            if (!response.success) throw new Error(response.message || 'Create user failed');

            reset();
            handleDismissImage();
            toast.success('User created successfully');
        } catch (error: any) {
            toast.error(error.message || 'Create user failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40 max-w-3xl">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Create User</h2>
                <p className="text-slate-500 mt-1">Add a new citizen or authority account.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Avatar picker */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
                        <div className="relative">
                            {previewImage ? (
                                <>
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        width={80}
                                        height={80}
                                        className="rounded-full border-4 border-teal-50 shadow-md object-cover w-20 h-20"
                                    />
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
                                </>
                            ) : (
                                <Image
                                    src="/images/profile-placeholder.png"
                                    alt="Placeholder"
                                    width={80}
                                    height={80}
                                    className="rounded-full border-4 border-teal-50 shadow-md object-cover w-20 h-20"
                                />
                            )}

                            {/* Camera button */}
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

                            <Controller
                                name="profilePicture"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Profile Photo</p>
                            <p className="text-xs text-slate-400">JPG, PNG up to 5MB</p>
                            {errors.profilePicture && <p className={errorClass}>{errors.profilePicture.message}</p>}
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Role</label>
                        <select className={inputClass} {...register("role")}>
                            <option value="citizen">Citizen</option>
                            <option value="authority">Authority</option>
                        </select>
                        {errors.role && <p className={errorClass}>{errors.role.message}</p>}
                    </div>

                    {/* Core fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Full Name</label>
                            <input className={inputClass} {...register("fullname")} placeholder="Jane Doe" />
                            {errors.fullname && <p className={errorClass}>{errors.fullname.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Email</label>
                            <input className={inputClass} type="email" {...register("email")} placeholder="jane@example.com" />
                            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Password</label>
                            <input className={inputClass} type="password" {...register("password")} placeholder="Min. 6 characters" />
                            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                        </div>
                    </div>

                    {/* Authority fields */}
                    {selectedRole === 'authority' && (
                        <div className="p-5 bg-teal-50 rounded-xl border border-teal-100 space-y-4">
                            <h3 className="text-sm font-bold text-teal-900 uppercase tracking-wider">Authority Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Department</label>
                                    <select className={inputClass} {...register("department")}>
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept.value} value={dept.value}>{dept.label}</option>
                                        ))}
                                    </select>
                                    {errors.department && <p className={errorClass}>{errors.department.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Employee ID</label>
                                    <input
                                        className={inputClass}
                                        placeholder="Auto-generated if empty"
                                        {...register("employeeId")}
                                    />
                                    {errors.employeeId && <p className={errorClass}>{errors.employeeId.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Phone Number</label>
                                    <input
                                        className={inputClass}
                                        placeholder="e.g. 9876543210"
                                        {...register("phoneNumber")}
                                    />
                                    {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber.message}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Creating...'
                                : `Create ${selectedRole === 'authority' ? 'Authority' : 'Citizen'} Account`
                            }
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}