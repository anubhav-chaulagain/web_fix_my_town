import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const UserSchema = z.object({
    email: z.email({ message: "Enter a valid email" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    fullname: z.string().min(6, {message: "Minimum 6 characters"}),
    role: z.enum(["citizen", "authority"]),
    profilePicture: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
    // Authority-specific fields
    department: z.string().min(2, { message: "Department is required" }).optional(),
    employeeId: z.string().optional(),
    phoneNumber: z.string().min(10, { message: "Phone number is required" }).max(10, { message: "Phone number is required" }).optional(),
}).superRefine((data, ctx) => {
    // Make authority fields required when role is authority
    if (data.role === 'authority') {
        if (!data.department) {
            ctx.addIssue({
                code: "custom", // Use string literal instead
                message: "Department is required for authority users",
                path: ["department"],
            });
        }
        if (!data.phoneNumber) {
            ctx.addIssue({
                code: "custom", // Use string literal instead
                message: "Phone number is required for authority users",
                path: ["phoneNumber"],
            });
        }
    }
});

export type UserData = z.infer<typeof UserSchema>;


export const UpdateUserSchema = z.object({
    email: z.email({ message: "Enter a valid email" }).optional(),
    fullname: z.string().min(6, { message: "Minimum 6 characters" }).optional(),
    role: z.enum(["citizen", "authority", "admin"]).optional(),
    profilePicture: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
});

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;