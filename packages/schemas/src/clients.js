import { z } from 'zod';
export const storeClient = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
});
