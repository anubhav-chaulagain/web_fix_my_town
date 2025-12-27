'use client'

import { useForm } from "react-hook-form";
import { LoginForm, loginSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage() {
    const {register, handleSubmit, formState:{errors}} = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        values : {email:"", password:""}
    });
    return (
        <form className="form" onSubmit={handleSubmit(()=>{})}>
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