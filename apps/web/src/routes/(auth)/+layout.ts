import { guestGuard } from '@/guards/guestGuard.js'

export async function load() {
  guestGuard()
}
