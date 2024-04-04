import { fetcher } from '@/fetcher.js'

export async function load({ fetch, params }) {
  const project = await fetcher(`projects/${params.id}`, {
    fetcher: fetch,
  })

  return {
    project,
  }
}
