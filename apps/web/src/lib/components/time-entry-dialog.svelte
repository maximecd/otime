<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'

  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'

  import { defaults, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'

  import { zod } from 'sveltekit-superforms/adapters'

  import { browser } from '$app/environment'

  import { storeTimeEntry } from '@maximecd/schemas'

  import { fetcher } from '$lib/fetcher'
  import { createMutation, useQueryClient } from '@tanstack/svelte-query'

  type Project = {
    id: number
    name: string
    time_entries: Array<{
      description: string
    }>
  }

  /*
  function mediaQuery(query: string) {
    if (!browser) return false
    return window.matchMedia(query).matches
  }
  const isDesktop = mediaQuery('(min-width: 768px)')
  */

  export let project: Project | null = null

  export let modalOpen: boolean

  const form = superForm(defaults(zod(storeTimeEntry)), {
    resetForm: false,
    SPA: true,
    validators: zod(storeTimeEntry),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }
      try {
        modalOpen = false
        await $addTimeEntryMutation.mutateAsync(form)
      } catch (error) {
        return
      }
    },
  })

  const { form: formData, enhance } = form

  const client = useQueryClient()

  // on Open state change
  // $: if (modalOpen && project) {
  //   form.reset({
  //     data: {
  //       projectId: project.id,
  //     },
  //   })
  // }

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
  })
</script>

<Dialog.Root bind:open={modalOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add a time entry</Dialog.Title>
      <Dialog.Description>
        Project : {project?.name}
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" use:enhance>
      <Form.Field {form} name="projectId">
        <Form.Control let:attrs>
          <Form.Label>Project</Form.Label>
          <Input {...attrs} bind:value={$formData.projectId} type="number" />
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
      <Form.Button class="w-full">Save Entry</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
<!--<Drawer.Root bind:open={modalOpen}>
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
