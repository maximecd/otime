import { authGuard } from '$lib/guards/authGuard.js'

export async function load() {
  authGuard()
}
