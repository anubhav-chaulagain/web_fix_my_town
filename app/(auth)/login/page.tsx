'use client'

import { useForm } from "react-hook-form";

export default function LoginPage() {
    const {register, handleSubmit, formState:{errors}} = useForm({
        values : {email:"", password:""}
    });
    return (
        <form onSubmit={handleSubmit(()=>{})}>
            <h1>FixMyTown</h1>
            <h2>Welcome back!</h2>
            
            <div>
                <label>Email</label>
                <input {...register("email", {required: "Email is required!", pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:"Invalid email format!"}})}/>
                <p>{errors.email?.message}</p>
            </div>
            <div>
                <label>Password</label>
                <input {...register("password", {required: "Password is required!", minLength:{value: 8, message:"Minimun length is 8!"},
                maxLength: {value:20, message:"Maximum length is 20!"}})}/>
                <p>{errors.password?.message}</p>
            </div>
            
            <div>
                <button type="submit">Sumbit</button>
            </div>
        </form>
    );
}