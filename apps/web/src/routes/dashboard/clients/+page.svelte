<script lang="ts">
  import * as Table from '$lib/components/ui/table'
  import Button from '$lib/components/ui/button/button.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { fetcher } from '@/fetcher.js'
  import TextSkeleton from '$lib/components/skeletons/text-skeleton.svelte'

  const query = createQuery({
    queryKey: ['clients'],
    queryFn: () => fetcher('clients'),
  })
</script>

<div class="flex justify-between mb-2 items-end">
  <h2 class="text-lg font-semibold">
    {#if $query.isSuccess}
      {$query.data.length} Client{$query.data.length > 1 ? 's' : ''}
    {:else}
      <TextSkeleton />
    {/if}
  </h2>

  <Button href="/dashboard/clients/new">New client</Button>
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head class="text-right">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#if $query.isSuccess}
      {#each $query.data as client}
        <Table.Row>
          <Table.Cell class="font-medium">{client.name}</Table.Cell>
          <Table.Cell class="text-right">
            <Button href="/dashboard/clients/{client.id}" size="sm">View</Button>
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
        </Table.Row>
      {/each}
    {/if}
  </Table.Body>
</Table.Root>
