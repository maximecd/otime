import { fetcher } from '@/fetcher.js'

export async function load({ fetch, params }) {
  const client = await fetcher(`clients/${params.id}`, {
    fetcher: fetch,
  })
  return {
    client,
  }
}
