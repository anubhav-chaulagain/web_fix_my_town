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
        <form onSubmit={handleSubmit(()=>{})}>
            <h1>FixMyTown</h1>
            <h2>Welcome back!</h2>
            
            <div>
                <label>Email</label>
                <input {...register("email")}/>
                <p>{errors.email?.message}</p>
            </div>
            <div>
                <label>Password</label>
                <input {...register("password")}/>
                <p>{errors.password?.message}</p>
            </div>
            
            <div>
                <button type="submit">Sumbit</button>
            </div>
        </form>
    );
}