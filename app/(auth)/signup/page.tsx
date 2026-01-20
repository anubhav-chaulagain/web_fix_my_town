'use client'

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignupForm, signupSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";


export default function SignupPage() {
    const router = useRouter();
    const {register, handleSubmit, formState:{errors}} = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        values : {
            fullname: "", email: "", password: "", role: "citizen",
        }
    });
    const onSubmit = () => {
        router.push("/login");
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h1 className="text-3xl font-bold text-center mb-6">FixMyTown</h1>
            <h2 className="text-center font-bold mb-4">Create an new account!</h2>
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
                <select className="input text-sm" name="role" id="role">
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