'use client'

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginForm, loginSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-actions";

export default function LoginPage() {
    const router = useRouter();
    const [pending, setTransition] = useTransition();
    const {register, handleSubmit, formState:{errors}} = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        values : {email:"", password:""}
    });

    const [error, setError] = useState("");
    const onSubmit = async (data: LoginForm) => {
        console.log("front end ko onsubmit")
        // call action here
        setError("");
        try {
            const res = await handleLogin(data);
            if(!res.success) {
                throw new Error(res.message || "Login failed")
            }

            // hanlde redirect (optional)
            // setTransition(()=>{
            //     router.push("/dashboard");
            // });
            router.push("/dashboard");
        } catch(err: Error|any){
            setError(err.message || "Login failed");
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-center mb-6">FixMyTown</h1>
            <h2 className="text-center font-bold mb-4">Welcome back!</h2>
            
            <div>
                <label className="label">Email</label>
                <input className="input" {...register("email")}/>
                <p className="error-text">{errors.email?.message}</p>
            </div>
            <div>
                <label className="label">Password</label>
                <input className="input" {...register("password")}/>
                <p className="error-text">{errors.password?.message}</p>
            </div>
        
            <div>
                <button className="form-btn" type="submit">Sumbit</button>
            </div>
        </form>
    );
}