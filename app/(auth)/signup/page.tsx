'use client'

import { useForm } from "react-hook-form";
import { SignupForm, signupSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupPage() {
    const {register, handleSubmit, formState:{errors}} = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        values : {username:"", email:"", password:"", role:"citizen"}
    });
    return (
        <form onSubmit={handleSubmit(()=>{})}>
            <h1>FixMyTown</h1>
            <h2>Create an new account!</h2>
            <div>
                <label>Username</label>
                <input {...register("username")}/>
                <p>{errors.username?.message}</p>
            </div>
            <div>
                <label>Email</label>
                <input {...register("email")}/>
                <p>{errors.email?.message}</p>
            </div>
            <div>
                <label>Password</label>
                <input type="password" {...register("password")}/>
                <p>{errors.password?.message}</p>
            </div>
            <div>
                <label>Role</label>
                <select name="role" id="role">
                    <option value="citizen">Citizen</option>
                    <option value="authority">Authority</option>
                </select>
                <p>{errors.role?.message}</p>

            </div>
            <div>
                <button type="submit">Sumbit</button>
            </div>
        </form>
    );
}