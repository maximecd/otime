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
    if (value.status !== 'loaded') return

    state = value

    if (value.user) {
      localStorage.setItem(localStorageKey, JSON.stringify(value.user))
    } else {
      localStorage.removeItem(localStorageKey)
    }
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
    if (!browser) return

    const user = localStorage.getItem(localStorageKey)

    if (!user) {
      set({ user: null, status: 'loaded' })
      return
    }

    // set the user from local storage
    set({ user: JSON.parse(user), status: 'loading' })

    // refetch the user to make sure it's still valid
    try {
      const res: UserRes = await fetcher('auth/me')
      set({ user: res.user, status: 'loaded' })
    } catch (error) {
      set({ user: null, status: 'loaded' })
      localStorage.removeItem(localStorageKey)
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
