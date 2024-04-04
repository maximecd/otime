import { fetcher } from '@/fetcher.js'

export async function load({ fetch }) {
  const projects = await fetcher('projects', {
    fetcher: fetch,
  })

  return {
    projects,
  }
}
