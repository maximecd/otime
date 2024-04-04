<script lang="ts">
  import Button from '@/components/ui/button/button.svelte'
  import { Trash } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { goto, invalidate } from '$app/navigation'
  import { fetcher } from '@/fetcher.js'

  async function deleteClient() {
    await fetcher(`clients/${$page.params.id}`, {
      method: 'DELETE',
    })

    /**
     * Reload the data table
     */
    await invalidate('/dashboard/clients')
    /**
     * Redirect to the clients page
     */
    goto('/dashboard/clients')
  }

  export let data
</script>

<h1>
  {data.client.name}
</h1>

<Button variant="destructive" on:click={deleteClient}>
  <Trash class="h-4 w-4 mr-2" />
  Delete
</Button>
