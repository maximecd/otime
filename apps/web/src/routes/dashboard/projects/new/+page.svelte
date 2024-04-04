<script lang="ts">
  import { storeClient } from '@maximecd/schemas'
  import { setError, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'

  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import * as Card from '$lib/components/ui/card'
  import { fetcher } from '$lib/fetcher.js'
  import { goto, invalidate } from '$app/navigation'
  import { Check, ChevronsUpDown } from 'lucide-svelte'

  import * as Popover from '$lib/components/ui/popover/index.js'
  import * as Command from '$lib/components/ui/command/index.js'
  import { cn } from '@/utils.js'
  import { buttonVariants } from '@/components/ui/button/index.js'
  import { tick } from 'svelte'

  export let data

  const form = superForm(data.form, {
    SPA: true,
    validators: zod(storeClient),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }

      await fetcher('projects', {
        method: 'POST',
        data: form.data,
      })

      await invalidate('/dashboard/projects')
      goto('/dashboard/projects')
    },
  })

  const { form: formData, enhance, errors } = form

  let open = false

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  $: selectedValue =
    data.clients.find((client) => client.id === $formData.clientId)?.name ?? 'Select a client'
</script>

<Card.Root class="max-w-lg w-full mx-auto">
  <form method="POST" use:enhance>
    <Card.Header>
      <Card.Title>Create a new project</Card.Title>
    </Card.Header>
    <Card.Content>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="clientId" class="flex flex-col">
        <Popover.Root bind:open let:ids>
          <Form.Control let:attrs>
            <Form.Label>Client</Form.Label>
            <Popover.Trigger
              class={cn(
                buttonVariants({ variant: 'outline' }),
                'w-[200px] justify-between',
                !$formData.clientId && 'text-muted-foreground'
              )}
              role="combobox"
              {...attrs}
            >
              {selectedValue}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Popover.Trigger>
            <input hidden value={$formData.name} name={attrs.name} />
          </Form.Control>
          <Popover.Content class="w-[200px] p-0">
            <Command.Root>
              <Command.Input autofocus placeholder="Search client..." class="h-9" />
              <Command.Empty>No client found.</Command.Empty>
              <Command.Group>
                {#each data.clients as client}
                  <Command.Item
                    value={`${client.id}`}
                    onSelect={() => {
                      $formData.clientId = client.id
                      closeAndFocusTrigger(ids.trigger)
                    }}
                  >
                    {client.name}
                    <Check
                      class={cn(
                        'ml-auto h-4 w-4',
                        client.id !== $formData.clientId && 'text-transparent'
                      )}
                    />
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>

        <Form.FieldErrors />
      </Form.Field>
    </Card.Content>
    <Card.Footer>
      {#if $errors?._errors}
        <p class="text-red-500 text-sm">{$errors._errors}</p>
      {/if}
      <Form.Button>Create</Form.Button>
    </Card.Footer>
  </form>
</Card.Root>
