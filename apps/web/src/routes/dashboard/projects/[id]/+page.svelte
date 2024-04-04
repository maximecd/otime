<script lang="ts">
  import Button from '@/components/ui/button/button.svelte'
  import { Trash } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { goto, invalidate } from '$app/navigation'
  import { fetcher } from '@/fetcher.js'
  import TimeEntryDialog from '../time-entry-dialog.svelte'

  async function deleteProject() {
    await fetcher(`projects/${$page.params.id}`, {
      method: 'DELETE',
    })

    await invalidate('/dashboard/projects')
    goto('/dashboard/projects')
  }

  export let data

  let modalOpen = false
</script>

<h1>
  {data.project.name}
</h1>

<h2>Time entries</h2>

<ul>
  {#each data.project.time_entries as timeEntry}
    <li>
      {timeEntry.description}
    </li>
  {/each}
</ul>

<Button on:click={() => (modalOpen = true)}>New time entry</Button>

<Button variant="destructive" on:click={deleteProject}>
  <Trash class="h-4 w-4 mr-2" />
  Delete
</Button>

<TimeEntryDialog bind:modalOpen project={data.project} />
