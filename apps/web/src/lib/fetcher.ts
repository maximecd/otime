import { dev } from '$app/environment'
import { ApiFormError } from '@/errors'
import { setError, type SuperValidated } from 'sveltekit-superforms'

const baseUrl = dev ? 'http://localhost:5173/api/' : 'https://api.timetracker.maximecd.com/'

type FetcherOptions<T extends Record<string, unknown>> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: object
  fetcher?: typeof fetch
  headers?: object
  form?: SuperValidated<T>
}

/**
 * When passing a form, the form errors will be parsed and the body will be set to the form data (if data is not provided)
 */
export async function fetcher<T extends Record<string, unknown>>(
  url: string,
  { method = 'GET', fetcher, data = {}, headers = {}, form }: FetcherOptions<T> = {}
) {
  const fetcherFn = fetcher ? fetcher : fetch

  const controller = new AbortController()
  const { signal } = controller

  let response

  let body = undefined

  if (method !== 'GET') {
    if (form && Object.keys(data).length === 0) {
      body = JSON.stringify(form.data)
    } else {
      body = JSON.stringify(data)
    }
  }

  try {
    response = await fetcherFn(`${baseUrl}${url}`, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal,
    })

    const json = await response.json()

    if (!response.ok) {
      if (form) {
        if (response.status === 422 && (json.fieldErrors || json.globalError)) {
          throw new ApiFormError(form, json.fieldErrors || [], json.globalError || '')
        }
        setError(form, json.errors[0].message)
      }
      throw new Error(json.message)
    }

    return json
  } catch (e) {
    console.error('Error fetching data', e)
    throw e
  }
}
