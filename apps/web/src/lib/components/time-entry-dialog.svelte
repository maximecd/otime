<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'

  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'

  import { defaults, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'

  import { zod } from 'sveltekit-superforms/adapters'

  import { storeTimeEntry } from '@maximecd/schemas'

  import { fetcher } from '$lib/fetcher'
  import { useQueryClient } from '@tanstack/svelte-query'

  /*
  function mediaQuery(query: string) {
    if (!browser) return false
    return window.matchMedia(query).matches
  }
  const isDesktop = mediaQuery('(min-width: 768px)')
  */

  export let modalState: {
    open: boolean
    entry: {
      id: number
      projectId: number
      description: string
      duration: number
    } | null
    type: 'create' | 'edit'
  }

  const form = superForm(defaults(zod(storeTimeEntry)), {
    resetForm: false,
    SPA: true,
    validators: zod(storeTimeEntry),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }
      try {
        // await $addTimeEntryMutation.mutateAsync(form)

        if (modalState.type === 'create') {
          await fetcher('time-entries', {
            method: 'POST',
            form,
          })
        } else if (modalState.type === 'edit' && modalState.entry) {
          await fetcher(`time-entries/${modalState.entry.id}`, {
            method: 'PUT',
            form,
          })
        }

        client.invalidateQueries({ queryKey: [`time-entries`] })
        modalState.open = false
      } catch (error) {
        return
      }
    },
  })

  const { form: formData, enhance } = form

  const client = useQueryClient()

  function setFormValues() {
    if (modalState.entry) {
      $formData = {
        ...$formData,
        description: modalState.entry.description,
        duration: modalState.entry.duration,
        projectId: modalState.entry.projectId,
      }
    }
  }

  $: if (modalState.entry) {
    setFormValues()
  } else {
    form.reset()
  }

  // on Open state change
  // $: if (modalOpen && project) {
  //   form.reset({
  //     data: {
  //       projectId: project.id,
  //     },
  //   })
  // }
  /*
  const addTimeEntryMutation = createMutation({
    mutationFn: async (form: SuperValidated<Infer<typeof storeTimeEntry>>) => {
      await fetcher('time-entries', {
        method: 'POST',
        form,
      })
    },
    onMutate: async (form: SuperValidated<Infer<typeof storeTimeEntry>>) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await client.cancelQueries({ queryKey: [`project-${project.id}`] })

      // Snapshot the previous value
      const previousProjectData = client.getQueryData<Project>([`project-${project.id}`])

      // Optimistically update to the new value
      if (previousProjectData) {
        client.setQueryData<Project>([`project-${project.id}`], {
          ...previousProjectData,
          time_entries: [
            ...previousProjectData.time_entries,
            {
              description: form.data.description,
            },
          ],
        })
      }
      return { previousProjectData }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err: any, variables: any, context: any) => {
      if (context?.previousTodos) {
        client.setQueryData<Project>([`project-${project.id}`], context.previousProjectData)
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      client.invalidateQueries({ queryKey: [`project-${project.id}`] })
    },
  })*/
</script>

<Dialog.Root bind:open={modalState.open}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>
        {#if modalState.type === 'edit'}
          Edit time entry
        {:else}
          Add a time entry
        {/if}
      </Dialog.Title>
    </Dialog.Header>
    <form method="POST" use:enhance>
      <Form.Field {form} name="projectId">
        <Form.Control let:attrs>
          <Form.Label>Project</Form.Label>
          <Input
            {...attrs}
            bind:value={$formData.projectId}
            type="number"
            disabled={modalState.entry !== null}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="duration">
        <Form.Control let:attrs>
          <Form.Label>Duration (minutes)</Form.Label>
          <Input {...attrs} bind:value={$formData.duration} type="number" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <Form.Label>Description</Form.Label>
          <Input {...attrs} bind:value={$formData.description} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button class="w-full">
        {#if modalState.type === 'edit'}
          Update Entry
        {:else}
          Add Entry
        {/if}
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
<!-- <Drawer.Root bind:open={modalOpen}>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Add a time entry</Drawer.Title>
      <Drawer.Description>Project : {project?.name}</Drawer.Description>
    </Drawer.Header>
    <form method="POST" use:enhance class="p-4">
      <Form.Field {form} name="duration">
        <Form.Control let:attrs>
          <Form.Label>Duration (minutes)</Form.Label>
          <Input {...attrs} bind:value={$formData.duration} type="number" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <Form.Label>Description</Form.Label>
          <Input {...attrs} bind:value={$formData.description} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Drawer.Footer>
        <Form.Button class="w-full">Save Entry</Form.Button>
        <Drawer.Close asChild let:builder>
          <Button builders={[builder]} variant="secondary">Cancel</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </form>
  </Drawer.Content>
</Drawer.Root> -->
