import z from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email format!"),
    password: z.string().min(6, "Password should be at least 6 characters long!").max(20, "Password should be at max 20 characters!"),
});

export type LoginForm = z.infer<typeof loginSchema>;