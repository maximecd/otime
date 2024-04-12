<script lang="ts">
  import { BookUser, LayoutDashboard, LogOut, type Icon, FolderKanban } from 'lucide-svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import * as Avatar from '$lib/components/ui/avatar'
  import { authStore } from '$lib/stores/authStore'
  import { page } from '$app/stores'
  import type { ComponentType } from 'svelte'
  import { toggleMode, mode } from 'mode-watcher'

  type Route = {
    name: string
    path: string
    icon: ComponentType<Icon>
  }

  let routes: Route[] = []

  $: routes = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Clients',
      path: '/clients',
      icon: BookUser,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban,
    },
  ]
</script>

<nav class="border rounded-r-md p-2 min-w-52 flex flex-col">
  <p class="font-bold text-md my-4 text-center pointer-events-none select-none">otime</p>

  <ul class="flex flex-col gap-1">
    {#each routes as route}
      <li>
        <Button
          variant={$page.url.pathname.startsWith(route.path) ? 'default' : 'ghost'}
          href={route.path}
          class="w-full justify-start"
        >
          <svelte:component this={route.icon} class="h-4 w-4 mr-2" />
          {route.name}
        </Button>
      </li>
    {/each}
  </ul>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button builders={[builder]} class="mt-auto justify-start h-14 gap-2 p-2" variant="outline">
        <Avatar.Root>
          <Avatar.Fallback>
            {$authStore.user?.fullName
              ? $authStore.user.fullName
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
              : ''}
          </Avatar.Fallback>
        </Avatar.Root>

        {#if $authStore.user}
          {$authStore.user.fullName.split(' ')[0]}
          {#if $authStore.user.fullName.split(' ').length > 1}
            {$authStore.user.fullName.split(' ')[1].charAt(0)}.
          {/if}
        {:else}
          <div class="h-2 w-16 bg-slate-200 rounded animate-pulse"></div>
        {/if}
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>
        <DropdownMenu.Item on:click={toggleMode}
          >Toggle
          {$mode === 'light' ? 'dark' : 'light'} mode
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          class="flex justify-between"
          on:click={async () => await authStore.logout()}
          >Logout

          <LogOut class="h-4 w-4" />
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</nav>
