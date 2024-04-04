<script lang="ts">
  import { ModeWatcher } from 'mode-watcher'

  import '../app.pcss'
</script>

<ModeWatcher />
<div data-vaul-drawer-wrapper class="bg-background">
  <slot />
</div>
