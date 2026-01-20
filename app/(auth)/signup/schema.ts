import z from "zod";

export const signupSchema = z.object({
    fullname: z.string().min(4, "Minimum length is 4!"),
    email: z.email("Invalid email format!"),
    password: z.string().min(6, "Password should be at least 6 characters long!").max(20, "Password should be at max 20 characters!"),
    role: z.enum(["citizen", "authority"]),
});

export type SignupForm = z.infer<typeof signupSchema>;