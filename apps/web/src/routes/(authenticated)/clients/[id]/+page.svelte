<script lang="ts">
  import Button from '@/components/ui/button/button.svelte'
  import { Trash } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { goto, invalidate } from '$app/navigation'
  import { fetcher } from '@/fetcher.js'
  import { createQuery } from '@tanstack/svelte-query'
  import TextSkeleton from '@/components/skeletons/text-skeleton.svelte'

  async function deleteClient() {
    await fetcher(`clients/${$page.params.id}`, {
      method: 'DELETE',
    })

    /**
     * Reload the data table
     */
    await invalidate('/clients')
    /**
     * Redirect to the clients page
     */
    goto('/clients')
  }

  const query = createQuery({
    queryKey: ['clients', $page.params.id],
    queryFn: () => fetcher(`clients/${$page.params.id}`),
  })
</script>

<h1>
  {#if $query.isSuccess}
    {$query.data.name}
  {:else}
    <TextSkeleton />
  {/if}
</h1>

<Button variant="destructive" on:click={deleteClient}>
  <Trash class="h-4 w-4 mr-2" />
  Delete
</Button>
