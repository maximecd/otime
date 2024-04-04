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
    variant: 'default' | 'ghost'
  }

  let routes: Route[] = []

  $: routes = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      variant: getVariant($page.route.id, '/dashboard'),
    },
    {
      name: 'Clients',
      path: '/dashboard/clients',
      icon: BookUser,
      variant: getVariant($page.route.id, '/dashboard/clients'),
    },
    {
      name: 'Projects',
      path: '/dashboard/projects',
      icon: FolderKanban,
      variant: getVariant($page.route.id, '/dashboard/projects'),
    },
  ]

  function getVariant(routeId: string | null, path: string) {
    if (!routeId) return 'ghost'

    let routeSegments = routeId.split('/').filter(Boolean)

    let pathSegments = path.split('/').filter(Boolean)

    if (pathSegments.length === 1) {
      // dashboard
      return routeSegments[1] === pathSegments[1] ? 'default' : 'ghost'
    }

    return routeId.startsWith(path) ? 'default' : 'ghost'
  }
</script>

<nav class="border rounded-r-md p-2 min-w-52 flex flex-col">
  <p class="font-bold text-md my-4 text-center pointer-events-none select-none">Timetracker</p>

  <ul class="flex flex-col gap-1">
    {#each routes as route}
      <li>
        <Button variant={route.variant} href={route.path} class="w-full justify-start">
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
          {$authStore.user.fullName}
        {:else}
          <div class="h-2 w-16 bg-slate-200 rounded animate-pulse"></div>
        {/if}
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Separator />
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
