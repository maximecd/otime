import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const registerSchema = z
    .object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirmation: z.string(),
})
    .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
});
