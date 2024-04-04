<script lang="ts">
  import Nav from '@/components/nav.svelte'
</script>

<div class="min-h-screen flex">
  <Nav />
  <main class="flex-1 p-4">
    <slot />
  </main>
</div>
