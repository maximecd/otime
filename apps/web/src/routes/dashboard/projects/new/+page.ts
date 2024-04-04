import { fetcher } from '@/fetcher.js'
import { storeProject } from '@maximecd/schemas'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

export const load = async ({ fetch }) => {
  const form = await superValidate(zod(storeProject))

  const clients = await fetcher('clients', {
    fetcher: fetch,
  })

  return {
    form,
    clients,
  }
}
