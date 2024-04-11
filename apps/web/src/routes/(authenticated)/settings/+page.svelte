<script lang="ts">
  import { authStore } from '$lib/stores/authStore'
  import Button from '$lib/components/ui/button/button.svelte'
  import { fetcher } from '@/fetcher'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod } from 'sveltekit-superforms/adapters'
  import { changePasswordSchema } from '@maximecd/schemas'
  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import * as Tabs from '$lib/components/ui/tabs'
  import * as AlertDialog from '$lib/components/ui/alert-dialog'

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

<h1 class="text-4xl font-bold tracking-tight mb-6">Settings</h1>

<Tabs.Root value="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="danger-zone">Danger Zone</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account" class="pt-8">
    <h2 class="font-medium pb-2 text-lg border-b border-gray-200 mb-8">Change password</h2>
    <form use:enhanceChangePassword method="POST">
      <Form.Field form={changePasswordForm} name="currentPassword">
        <Form.Control let:attrs>
          <Form.Label>Current password</Form.Label>
          <Input {...attrs} bind:value={$formDataChangePassword.currentPassword} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={changePasswordForm} name="newPassword">
        <Form.Control let:attrs>
          <Form.Label>New password</Form.Label>
          <Input {...attrs} bind:value={$formDataChangePassword.newPassword} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={changePasswordForm} name="newPasswordConfirmation">
        <Form.Control let:attrs>
          <Form.Label>Confirm new password</Form.Label>
          <Input
            {...attrs}
            bind:value={$formDataChangePassword.newPasswordConfirmation}
            type="password"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button>Change Password</Form.Button>
      {#if $errorsChangePassword?._errors}
        <p class="text-red-500 text-sm text-center mt-2">{$errorsChangePassword._errors}</p>
      {/if}
    </form>
  </Tabs.Content>
  <Tabs.Content value="danger-zone" class="pt-8">
    <h2 class="font-medium pb-2 text-lg border-b border-gray-200 mb-8">Account deletion</h2>

    <AlertDialog.Root closeOnOutsideClick={true}>
      <AlertDialog.Trigger asChild let:builder>
        <Button variant="destructive" builders={[builder]}>Delete Account</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete account</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. Are you sure you want to delete your account? It will be
            permanently deleted from our servers, along with all associated data, projects, clients,
            and time entries.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action on:click={deleteAccount}>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </Tabs.Content>
</Tabs.Root>
