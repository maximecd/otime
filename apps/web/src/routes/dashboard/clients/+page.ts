import { fetcher } from '@/fetcher.js'

export async function load({ fetch }) {
  const clients = await fetcher('clients', {
    fetcher: fetch,
  })

  return {
    clients,
  }
}
