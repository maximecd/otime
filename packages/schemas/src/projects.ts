import { z } from 'zod'

export const storeProject = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  clientId: z.coerce.number(),
})
