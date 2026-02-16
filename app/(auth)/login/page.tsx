'use client'

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginForm, loginSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-actions";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const {register, handleSubmit, formState:{errors}} = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email:"", password:""} // Changed from 'values' to 'defaultValues'
    });

    const [error, setError] = useState("");
    
    const onSubmit = async (data: LoginForm) => {
        setError("");
        console.log("Form submitted with:", data); // Debug log
        
        startTransition(async () => {
            try {
                const res = await handleLogin(data);
                console.log("Login response:", res); // Debug log
                
                if(!res.success) {
                    throw new Error(res.message || "Login failed")
                }

                console.log("Login successful, redirecting..."); // Debug log
                
                // Use startTransition for the redirect
                router.push("/user/dashboard");
                router.refresh(); // Force a refresh after redirect
                
            } catch(err: Error | any){
                console.error("Login error:", err); // Debug log
                setError(err.message || "Login failed");
            }
        });
    }

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-center mb-6">FixMyTown</h1>
            <h2 className="text-center font-bold mb-4">Welcome back!</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <div>
                <label className="label">Email</label>
                <input 
                    className="input" 
                    type="email"
                    {...register("email")}
                    disabled={isPending}
                />
                <p className="error-text">{errors.email?.message}</p>
            </div>
            
            <div>
                <label className="label">Password</label>
                <input 
                    className="input" 
                    type="password"
                    {...register("password")}
                    disabled={isPending}
                />
                <p className="error-text">{errors.password?.message}</p>
            </div>
        
            <div>
                <button 
                    className="form-btn" 
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Loading..." : "Submit"}
                </button>
            </div>
            
            <div className="text-center mb-3">
                <Link href={"/signup"} className="text-slate-500 text-sm">
                    Create a new account
                </Link>
            </div>
        </form>
    );
}