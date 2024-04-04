import { browser } from '$app/environment'
import { authStore } from '@/stores/authStore'
import { redirect } from '@sveltejs/kit'

export async function authGuard() {
  /**
   * This guard redirects the user to the login page if they are not authenticated.
   * It is NOT a secure way to protect routes, as the user can still access the route in the code or at first load (flash of unauthenticated content)
   * Secure content is always protected on the server side.
   */

  if (!browser) {
    return true
  }

  await authStore.init()

  if (!authStore.isLoggedIn()) {
    redirect(307, '/login')
  }

  return true
}
