import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { fetcher } from '@/fetcher'
import { writable } from 'svelte/store'

type AuthStore = {
  user: null | {
    email: string
    fullName: string
  }
  status: 'init' | 'loading' | 'loaded'
}

type UserRes = {
  user: {
    email: string
    fullName: string
  }
}

const initialState: AuthStore = {
  user: null,
  status: 'init',
}

const localStorageKey = 'sv-auth-state'

const createAuthStore = () => {
  const { subscribe, set } = writable<AuthStore>(initialState)

  let state: AuthStore = initialState

  subscribe((value) => {
    if (!browser) return
    if (value.status === 'init') return
    state = value
    localStorage.setItem(localStorageKey, JSON.stringify(value))
  })

  /**
   * Initialize the store
  if (browser && state.status === 'init') {
    init()
  }
  */

  /**
   * Actions
   */

  async function init() {
    const localValue = localStorage.getItem(localStorageKey)

    if (!localValue || !JSON.parse(localValue).user) {
      set({ user: null, status: 'loaded' })
      return
    }

    // set the user from local storage
    set({ user: JSON.parse(localValue).user, status: 'loading' })

    // refetch the user to make sure it's still valid
    // dont await this, we don't want to block the UI
    refetchUser()
  }

  async function refetchUser() {
    let response

    try {
      response = await fetcher('auth/me')
      set({ user: response.user, status: 'loaded' })
      return
    } catch (e) {
      console.error('Error fetching user', e)
    }

    // if we get a 401, the user is no longer valid
    // else we just ignore this, it could be a network / server error
    if (response?.status === 401) {
      set({ user: null, status: 'loaded' })
      return
    }
  }

  async function logout() {
    await fetcher('auth/logout', { method: 'POST' })
    set({ user: null, status: 'loaded' })
    goto('/')
  }

  /**
   * Helper functions
   */

  const isLoggedIn = () => {
    return state.user !== null
  }

  return {
    subscribe,
    set,
    isLoggedIn,
    logout,
    init,
  }
}

export const authStore = createAuthStore()
