<script lang="ts">
  import { page } from '$app/stores'
  import { ArrowLeft } from 'lucide-svelte'

  $: shouldShow = $page.url.pathname !== '/dashboard/clients'
</script>

<div class="flex flex-col mb-6">
  <h1 class="text-4xl font-bold tracking-tight">Clients</h1>
  {#if shouldShow}
    <a
      href={$page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))}
      class="flex items-center gap-2 text-neutral-600 text-sm"
    >
      <ArrowLeft class="h-3 w-3" /> Back
    </a>
  {/if}
</div>

<slot />
