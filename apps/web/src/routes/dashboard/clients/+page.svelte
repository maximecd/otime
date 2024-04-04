<script lang="ts">
  import * as Table from '$lib/components/ui/table'
  import Button from '$lib/components/ui/button/button.svelte'

  export let data
</script>

<div class="flex justify-between mb-2 items-end">
  <h2 class="text-lg font-semibold">
    {data.clients.length} Client{data.clients.length > 1 ? 's' : ''}
  </h2>
  <Button href="/dashboard/clients/new">New client</Button>
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">ID</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head class="text-right">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.clients as client}
      <Table.Row>
        <Table.Cell>#{client.id}</Table.Cell>
        <Table.Cell class="font-medium">{client.name}</Table.Cell>
        <Table.Cell class="text-right">
          <Button href="/dashboard/clients/{client.id}" size="sm">View</Button>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
