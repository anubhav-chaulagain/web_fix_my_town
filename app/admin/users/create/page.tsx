'use client'

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";


export default function SignupPage() {
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {register, handleSubmit, control, reset, formState:{errors}} = useForm<UserData>({
        resolver: zodResolver(UserSchema)
    });

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: UserData) => {
        try {
                const formData = new FormData();
                if (data.fullname) {
                    formData.append('fullname', data.fullname);
                }

                formData.append('email', data.email);
                formData.append('password', data.password);
                formData.append('role', data.role);

                if (data.profilePicture) {
                    formData.append('profilePicture', data.profilePicture);
                }
                const response = await handleCreateUser(formData);

                if (!response.success) {
                    throw new Error(response.message || 'Create profile failed');
                }
                reset();
                handleDismissImage();
                toast.success('Profile Created successfully');

            } catch (error: Error | any) {
                toast.error(error.message || 'Create profile failed');
                setError(error.message || 'Create profile failed');
            }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h1 className="text-3xl font-bold text-center mb-6">FixMyTown</h1>
            <h2 className="text-center font-bold mb-4">Create an new account!</h2>

            {/* Profile Image Display */}
            <div className="mb-4">
                {previewImage ? (
                    <div className="relative w-24 h-24">
                        <img
                            src={previewImage}
                            alt="Profile Image Preview"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <Controller
                            name="profilePicture"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                    </div>
                )}

            </div>
            {/* Profile Image Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <Controller
                    name="profilePicture"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                            accept=".jpg,.jpeg,.png,.webp"
                        />
                    )}
                />
                {errors.profilePicture && <p className="text-sm text-red-600">{errors.profilePicture.message}</p>}
            </div>
            
            <div>
                <label className="label">Fullname</label>
                <input className="input" {...register("fullname")}/>
                <p className="error-text">{errors.fullname?.message}</p>
            </div>
            <div>
                <label className="label">Email</label>
                <input className="input" {...register("email")}/>
                <p className="error-text">{errors.email?.message}</p>
            </div>
            <div>
                <label className="label">Password</label>
                <input className="input" type="password" {...register("password")}/>
                <p className="error-text">{errors.password?.message}</p>
            </div>
            <div>
                <label className="label">Role</label>
                <select className="input text-sm" id="role" {...register("role")}>
                    <option value="citizen">Citizen</option>
                    <option value="authority">Authority</option>
                </select>
                <p className="error-text">{errors.role?.message}</p>

            </div>
            <div>
                <button className="form-btn" type="submit">Signup</button>
            </div>
        </form>
    );
}