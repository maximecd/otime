<script lang="ts">
  import { storeClient } from '@maximecd/schemas'
  import { defaults, setError, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'

  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import * as Card from '$lib/components/ui/card'
  import { goto, invalidate } from '$app/navigation'
  import { fetcher } from '@/fetcher.js'

  const form = superForm(defaults(zod(storeClient)), {
    SPA: true,
    validators: zod(storeClient),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }

      await fetcher('clients', {
        method: 'POST',
        data: form.data,
      })

      await invalidate('/dashboard/clients')
      goto('/dashboard/clients')
    },
  })

  const { form: formData, enhance, errors } = form
</script>

<Card.Root class="max-w-lg w-full mx-auto">
  <form method="POST" use:enhance>
    <Card.Header>
      <Card.Title>Create a new client</Card.Title>
    </Card.Header>
    <Card.Content>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
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
