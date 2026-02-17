import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const reportIssueSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
    category: z.string(),
    location: z.string().min(5, "Location must be at least 5 characters").max(200, "Location is too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
    issueImages: z
            .instanceof(File)
            .optional()
            .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
                message: "Max file size is 5MB",
            })
            .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
                message: "Only .jpg, .jpeg, .png and .webp formats are supported",
            }),
});

export type ReportIssueForm = z.infer<typeof reportIssueSchema>;