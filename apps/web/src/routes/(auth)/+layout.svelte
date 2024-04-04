<script lang="ts">
  import { goto } from '$app/navigation'
  import { authStore } from '@/stores/authStore'
  import { onMount } from 'svelte'

  onMount(async () => {
    await authStore.init()

    if (authStore.isLoggedIn()) {
      goto('/dashboard')
    }
  })
</script>

<slot />
