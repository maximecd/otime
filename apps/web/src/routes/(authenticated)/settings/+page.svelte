<script lang="ts">
  import { authStore } from '$lib/stores/authStore'
  import Button from '$lib/components/ui/button/button.svelte'
  import { fetcher } from '@/fetcher'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'
  import { changePasswordSchema } from '@maximecd/schemas'
  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'

  async function deleteAccount() {
    await fetcher('auth/delete-account', {
      method: 'DELETE',
    })
    authStore.set({
      ...$authStore,
      user: null,
    })
  }

  const changePasswordForm = superForm(defaults(zod(changePasswordSchema)), {
    SPA: true,
    validators: zod(changePasswordSchema),
    onUpdate: async ({ form }) => {
      if (!form.valid) {
        return
      }
      try {
        await fetcher('auth/change-password', {
          method: 'POST',
          form,
        })
      } catch (error) {
        return
      }
    },
  })

  const {
    form: formDataChangePassword,
    enhance: enhanceChangePassword,
    errors: errorsChangePassword,
  } = changePasswordForm
</script>

<h1>Settings</h1>

{#if $authStore.user}
  Email : {$authStore.user.email}
  Name : {$authStore.user.fullName}

  <form use:enhanceChangePassword method="POST">
    <Form.Field form={changePasswordForm} name="currentPassword">
      <Form.Control let:attrs>
        <Form.Label>Current password</Form.Label>
        <Input {...attrs} bind:value={$formDataChangePassword.currentPassword} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={changePasswordForm} name="newPassword">
      <Form.Control let:attrs>
        <Form.Label>New password</Form.Label>
        <Input {...attrs} bind:value={$formDataChangePassword.newPassword} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={changePasswordForm} name="newPasswordConfirmation">
      <Form.Control let:attrs>
        <Form.Label>Confirm new password</Form.Label>
        <Input {...attrs} bind:value={$formDataChangePassword.newPasswordConfirmation} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Change Password</Form.Button>
    {#if $errorsChangePassword?._errors}
      <p class="text-red-500 text-sm text-center mt-2">{$errorsChangePassword._errors}</p>
    {/if}
  </form>

  <Button class="mt-12" variant="destructive" on:click={deleteAccount}>Delete account</Button>
{/if}
