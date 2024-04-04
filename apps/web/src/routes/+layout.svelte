<script lang="ts">
  import { ModeWatcher } from 'mode-watcher'

  import '../app.pcss'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { authStore } from '@/stores/authStore'

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })
</script>

<QueryClientProvider client={queryClient}>
  <ModeWatcher />
  <div data-vaul-drawer-wrapper class="bg-background">
    <slot />
  </div>
</QueryClientProvider>
