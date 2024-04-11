<script lang="ts">
  import { fetcher } from '$lib/fetcher'
  import TextSkeleton from '$lib/components/skeletons/text-skeleton.svelte'
  import { createQuery, useQueryClient } from '@tanstack/svelte-query'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Table from '$lib/components/ui/table'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import * as AlertDialog from '$lib/components/ui/alert-dialog'
  import { Ellipsis } from 'lucide-svelte'
  import TimeEntryDialog from '@/components/time-entry-dialog.svelte'

  const query = createQuery({
    queryKey: ['time-entries'],
    queryFn: () => fetcher('time-entries'),
  })

  let entryModal: {
    open: boolean
    entry: {
      id: number
      projectId: number
      description: string
      duration: number
    } | null
    type: 'create' | 'edit'
  } = {
    open: false,
    entry: null,
    type: 'create',
  }

  let deleteModal = {
    open: false,
    id: null,
  }

  const client = useQueryClient()

  function getDuration(durationInMins: number) {
    const hours = Math.floor(durationInMins / 60)
    const minutes = durationInMins % 60

    return `${hours}h${minutes}`
  }
</script>

<h1 class="text-4xl font-bold tracking-tight mb-6">Dashboard</h1>

<div class="flex justify-between mb-2 items-end">
  <h2 class="text-lg font-semibold">
    {#if $query.isSuccess}
      {$query.data.length} Time entr{$query.data.length > 1 ? 'ies' : 'y'}
    {:else}
      <TextSkeleton />
    {/if}
  </h2>
  <Button
    on:click={() => {
      entryModal.open = true
      entryModal.type = 'create'
      entryModal.entry = null
    }}>Add a time entry</Button
  >
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[30%]">Description</Table.Head>
      <Table.Head class="w-[30%]">Duration</Table.Head>
      <Table.Head class="w-[30%]">Project</Table.Head>
      <Table.Head class="text-right w-[10%]">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#if $query.isSuccess}
      {#each $query.data as entry}
        <Table.Row>
          <Table.Cell class="font-medium">
            {entry.description}
          </Table.Cell>
          <Table.Cell>
            {getDuration(entry.duration)}
          </Table.Cell>
          <Table.Cell>
            {entry.project_name}</Table.Cell
          >
          <Table.Cell class="text-right">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button size="icon" variant="ghost" builders={[builder]}>
                  <Ellipsis class="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    on:click={() => {
                      entryModal.open = true
                      entryModal.entry = {
                        id: entry.id,
                        projectId: entry.project_id,
                        description: entry.description,
                        duration: entry.duration,
                      }
                      entryModal.type = 'edit'
                    }}>Edit entry</DropdownMenu.Item
                  >
                  <DropdownMenu.Item
                    on:click={() => {
                      deleteModal.open = true
                      deleteModal.id = entry.id
                    }}
                  >
                    Delete entry
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    {:else if $query.isError}
      An error has occurred
    {:else}
      {#each Array.from({ length: 10 }).map((_, i) => i) as _}
        <Table.Row>
          <Table.Cell><TextSkeleton /></Table.Cell>
          <Table.Cell><TextSkeleton /></Table.Cell>
          <Table.Cell><TextSkeleton /></Table.Cell>
          <Table.Cell class="text-right">
            <Button size="icon" variant="ghost">
              <Ellipsis class="h-4 w-4" />
            </Button>
          </Table.Cell>
        </Table.Row>
      {/each}
    {/if}
  </Table.Body>
</Table.Root>

<TimeEntryDialog bind:modalState={entryModal} />

<AlertDialog.Root bind:open={deleteModal.open}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete entry</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. Are you sure you want to delete this entry?
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        on:click={async () => {
          await fetcher(`time-entries/${deleteModal.id}`, {
            method: 'DELETE',
          })
          client.invalidateQueries({
            queryKey: ['time-entries'],
          })
        }}>Delete</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
