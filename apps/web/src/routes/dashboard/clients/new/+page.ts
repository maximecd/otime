import { storeClient } from '@maximecd/schemas'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

export const load = async () => {
  const form = await superValidate(zod(storeClient))

  return {
    form,
  }
}
