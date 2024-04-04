<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'
  import * as Drawer from '$lib/components/ui/drawer'
  import { Button } from '$lib/components/ui/button'

  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'

  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'

  import { browser } from '$app/environment'

  import { storeTimeEntry } from '@maximecd/schemas'

  import { fetcher } from '$lib/fetcher'

  type Project = {
    id: number
    name: string
  }

  function mediaQuery(query: string) {
    if (!browser) return false
    return window.matchMedia(query).matches
  }

  export let project: Project | null

  export let modalOpen: boolean

  const isDesktop = mediaQuery('(min-width: 768px)')

  const form = superForm(defaults(zod(storeTimeEntry)), {
    resetForm: false,
    SPA: true,
    validators: zod(storeTimeEntry),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }

      try {
        await fetcher('time-entries', {
          method: 'POST',
          form,
        })
      } catch (error) {
        return
      }

      modalOpen = false
    },
  })

  const { form: formData, enhance } = form

  // on Open state change
  $: if (modalOpen && project) {
    form.reset({
      data: {
        projectId: project.id,
      },
    })
  }
</script>

{#if isDesktop}
  <Dialog.Root bind:open={modalOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title class="">Add a time entry</Dialog.Title>
        <Dialog.Description>
          Project : {project?.name}
        </Dialog.Description>
      </Dialog.Header>
      <form method="POST" use:enhance>
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
{:else}
  <Drawer.Root bind:open={modalOpen}>
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
  </Drawer.Root>
{/if}
