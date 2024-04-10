<script lang="ts">
  import Nav from '@/components/nav.svelte'
  import { onMount } from 'svelte'
  import { authStore } from '@/stores/authStore'
  import { goto } from '$app/navigation'

  onMount(async () => {
    await authStore.init()

    if (!authStore.isLoggedIn()) {
      goto('/login')
    }
  })
</script>

<div class="min-h-screen flex">
  <Nav />
  <main class="flex-1 p-4">
    <slot />
  </main>
</div>
