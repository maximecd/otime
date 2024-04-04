<script lang="ts">
  import Button from '@/components/ui/button/button.svelte'
  import { Trash } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { goto, invalidate } from '$app/navigation'
  import { fetcher } from '@/fetcher.js'
  import TimeEntryDialog from '../time-entry-dialog.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import TextSkeleton from '@/components/skeletons/text-skeleton.svelte'

  async function deleteProject() {
    await fetcher(`projects/${$page.params.id}`, {
      method: 'DELETE',
    })

    await invalidate('/dashboard/projects')
    goto('/dashboard/projects')
  }

  let modalOpen = false

  const query = createQuery({
    queryKey: ['project-' + $page.params.id],
    queryFn: () => fetcher(`projects/${$page.params.id}`),
  })
</script>

<h1>
  {#if $query.isSuccess}
    {$query.data.name}
  {:else}
    <TextSkeleton />
  {/if}
</h1>

<h2>Time entries</h2>

<ul>
  {#if $query.isSuccess}
    {#each $query.data.time_entries as timeEntry}
      <li>
        {timeEntry.description}
      </li>
    {/each}
  {:else}
    {#each Array.from({ length: 10 }).map((_, i) => i) as _}
      <li>
        <TextSkeleton />
      </li>
    {/each}
  {/if}
</ul>

<Button on:click={() => (modalOpen = true)}>New time entry</Button>

<Button variant="destructive" on:click={deleteProject}>
  <Trash class="h-4 w-4 mr-2" />
  Delete
</Button>

<TimeEntryDialog bind:modalOpen project={$query.data} />
