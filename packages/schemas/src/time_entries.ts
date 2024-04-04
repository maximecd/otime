import { z } from 'zod'

export const storeTimeEntry = z.object({
  projectId: z.coerce.number(),
  description: z.string().min(1, 'Description must be at least 1 character long'),
  duration: z.coerce.number().positive(),
})
