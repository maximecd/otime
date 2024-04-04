<script lang="ts">
  import { loginSchema } from '@maximecd/schemas'

  import { setError, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'

  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import * as Card from '$lib/components/ui/card'
  import { fetcher } from '@/fetcher.js'
  import { goto } from '$app/navigation'
  import { authStore } from '@/stores/authStore.js'

  export let data

  type UserRes = {
    user: {
      email: string
      fullName: string
    }
  }

  const form = superForm(data.form, {
    SPA: true,
    validators: zod(loginSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }

      let data: UserRes | null = null

      try {
        data = await fetcher('auth/login', {
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
          <Card.Title>Login</Card.Title>
        </Card.Header>
        <Card.Content>
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
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
        <Card.Footer class="flex flex-col">
          <Form.Button class="w-full">Login</Form.Button>
          {#if $errors?._errors}
            <p class="text-red-500 text-sm text-center mt-2">{$errors._errors}</p>
          {/if}
        </Card.Footer>
      </form>
    </Card.Root>
    <p class="mt-2 text-center">
      Don't have an account? <a href="/register" class="underline">Register</a>
    </p>
  </div>
</main>
