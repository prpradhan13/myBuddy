import { z } from "zod";

export const signUpSchema = z.object({
    fullname: z.string().min(3, "Name must be at least 3 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export type SignUpSchemaTypes = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginSchemaTypes = z.infer<typeof loginSchema>;

export const profileUpdateSchema = z.object({
    fullname: z.string().min(3, "Name must be at least 5 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    bio: z.string().nullable(),
    avatar_url: z.any().optional(),
});

export type ProfileUpdateType = z.infer<typeof profileUpdateSchema>;