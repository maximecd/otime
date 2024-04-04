<script lang="ts">
  import * as Table from '$lib/components/ui/table'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import * as Dialog from '$lib/components/ui/dialog'
  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import Button from '$lib/components/ui/button/button.svelte'

  import { Ellipsis, SquareArrowOutUpRight } from 'lucide-svelte'
  import TimeEntryDialog from './time-entry-dialog.svelte'

  export let data

  type Project = {
    id: number
    name: string
  }

  let modalOpen = false

  let project: Project | null = null

  function openTimeEntryDialog(p: Project) {
    project = p
    modalOpen = true
  }
</script>

<div class="flex justify-between mb-2 items-end">
  <h2 class="text-lg font-semibold">
    {data.projects.length} Project{data.projects.length > 1 ? 's' : ''}
  </h2>
  <Button href="/dashboard/projects/new">New project</Button>
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">ID</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Client</Table.Head>
      <Table.Head>Total Duration</Table.Head>
      <Table.Head class="text-right">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.projects as project}
      <Table.Row>
        <Table.Cell>#{project.id}</Table.Cell>
        <Table.Cell class="font-medium">
          <a href="/dashboard/projects/{project.id}" class="hover:underline">
            {project.name}
          </a>
        </Table.Cell>
        <Table.Cell>
          <a href={`/dashboard/clients/${project.client.id}`} class="flex items-center"
            >{project.client.name}
            <SquareArrowOutUpRight class="h-3 w-3 ml-2" />
          </a>
        </Table.Cell>
        <Table.Cell>
          {project.totalDurationHuman}
        </Table.Cell>
        <Table.Cell class="text-right">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button size="icon" variant="ghost" builders={[builder]}>
                <Ellipsis class="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Group>
                <DropdownMenu.Item href="/dashboard/projects/{project.id}"
                  >View detail</DropdownMenu.Item
                >
                <DropdownMenu.Item on:click={() => openTimeEntryDialog(project)}
                  >Add time entry</DropdownMenu.Item
                >
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

<TimeEntryDialog bind:modalOpen {project} />
