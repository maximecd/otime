<script lang="ts">
  import { registerSchema } from '@maximecd/schemas'

  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'
  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import * as Card from '$lib/components/ui/card'
  import { fetcher } from '@/fetcher.js'
  import { authStore } from '@/stores/authStore.js'
  import { goto } from '$app/navigation'

  const form = superForm(defaults(zod(registerSchema)), {
    SPA: true,
    validators: zod(registerSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }

      let data = null

      try {
        data = await fetcher('auth/register', {
          method: 'POST',
          form,
        })
      } catch (error) {
        return
      }
      if (!data) {
        return
      }

      authStore.set({
        user: data.user,
        status: 'loaded',
      })

      goto('/dashboard')
    },
  })

  const { form: formData, enhance, errors } = form
</script>

<main class="min-h-screen flex flex-col items-center justify-center">
  <div class="max-w-md w-full">
    <Card.Root>
      <form method="POST" use:enhance>
        <Card.Header>
          <Card.Title>Register</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form.Field {form} name="fullName">
            <Form.Control let:attrs>
              <Form.Label>Full Name</Form.Label>
              <Input {...attrs} bind:value={$formData.fullName} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="email">
            <Form.Control let:attrs>
              <Form.Label>Email</Form.Label>
              <Input {...attrs} bind:value={$formData.email} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="password">
            <Form.Control let:attrs>
              <Form.Label>Password</Form.Label>
              <Input {...attrs} bind:value={$formData.password} type="password" />
            </Form.Control>
            <Form.Description>Must be at least 6 characters.</Form.Description>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="passwordConfirmation">
            <Form.Control let:attrs>
              <Form.Label>Password</Form.Label>
              <Input {...attrs} bind:value={$formData.passwordConfirmation} type="password" />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
        <Card.Footer>
          {#if $errors?._errors}
            <p class="text-red-500 text-sm text-center">{$errors._errors}</p>
          {/if}
          <Form.Button class="w-full">Register</Form.Button>
        </Card.Footer>
      </form>
    </Card.Root>
    <p class="mt-2 text-center">
      Already have an account? <a href="/login" class="underline">Login</a>
    </p>
  </div>
</main>
