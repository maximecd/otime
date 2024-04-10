<script lang="ts">
  import { fetcher } from '$lib/fetcher'
  import TextSkeleton from '$lib/components/skeletons/text-skeleton.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Table from '$lib/components/ui/table'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import { Ellipsis } from 'lucide-svelte'
  import { formatDuration } from 'date-fns'
  import TimeEntryDialog from '@/components/time-entry-dialog.svelte'

  const query = createQuery({
    queryKey: ['time_entries'],
    queryFn: () => fetcher('time-entries'),
  })

  let modalOpen = false
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
      modalOpen = true
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
            {formatDuration(
              {
                minutes: entry.duration,
              },
              {
                format: ['hours', 'minutes'],
              }
            )}
          </Table.Cell>
          <Table.Cell>
            {entry.project.name}</Table.Cell
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
                      modalOpen = true
                    }}>Edit entry</DropdownMenu.Item
                  >
                  <DropdownMenu.Item>Delete</DropdownMenu.Item>
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

<TimeEntryDialog bind:modalOpen />
