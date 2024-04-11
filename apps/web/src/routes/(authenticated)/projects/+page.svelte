<script lang="ts">
  import * as Table from '$lib/components/ui/table'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import Button from '$lib/components/ui/button/button.svelte'

  import { Ellipsis, SquareArrowOutUpRight } from 'lucide-svelte'
  import TimeEntryDialog from '../../../lib/components/time-entry-dialog.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { fetcher } from '$lib/fetcher'
  import TextSkeleton from '$lib/components/skeletons/text-skeleton.svelte'

  type Project = {
    id: number
    name: string
  }

  const query = createQuery({
    queryKey: ['projects'],
    queryFn: () => fetcher('projects'),
  })
</script>

<h1 class="text-4xl font-bold tracking-tight mb-6">Projects</h1>

<div class="flex justify-between mb-2 items-end">
  <h2 class="text-lg font-semibold">
    {#if $query.isSuccess}
      {$query.data.length} Project{$query.data.length > 1 ? 's' : ''}
    {:else}
      <TextSkeleton />
    {/if}
  </h2>
  <Button href="/projects/new">New project</Button>
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[30%]">Name</Table.Head>
      <Table.Head class="w-[30%]">Client</Table.Head>
      <Table.Head class="w-[30%]">Total Duration</Table.Head>
      <Table.Head class="text-right w-[10%]">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#if $query.isSuccess}
      {#each $query.data as project}
        <Table.Row>
          <Table.Cell class="font-medium">
            <a href="/projects/{project.id}" class="hover:underline">
              {project.name}
            </a>
          </Table.Cell>
          <Table.Cell>
            <a href={`/clients/${project.client_id}`} class="flex items-center"
              >{project.client_name}
              <SquareArrowOutUpRight class="h-3 w-3 ml-2" />
            </a>
          </Table.Cell>
          <Table.Cell>//TODO</Table.Cell>
          <Table.Cell class="text-right">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button size="icon" variant="ghost" builders={[builder]}>
                  <Ellipsis class="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Group>
                  <DropdownMenu.Item href="/projects/{project.id}">View detail</DropdownMenu.Item>
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
