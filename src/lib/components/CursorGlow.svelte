<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme';

  let x = -400, y = -400;
  let visible = false;
  let rgb = '159,191,107';

  $: rgb = $theme.rgb;

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    visible = true;
    let targetX = -400, targetY = -400;
    let rafId: number;

    function onMove(e: MouseEvent) { targetX = e.clientX; targetY = e.clientY; }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function animate() {
      x = lerp(x, targetX, 0.08);
      y = lerp(y, targetY, 0.08);
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  });
</script>

{#if visible}
  <div
    class="cursor-glow"
    style="transform:translate({x - 200}px,{y - 200}px);background:radial-gradient(circle at center,rgba({rgb},0.06) 0%,transparent 70%)"
    aria-hidden="true"
  ></div>
{/if}

<style>
  .cursor-glow {
    position: fixed; top: 0; left: 0;
    width: 400px; height: 400px; border-radius: 50%;
    pointer-events: none; z-index: 9998;
    will-change: transform; mix-blend-mode: screen;
    transition: background 0.6s ease;
  }
  @media (prefers-reduced-motion: reduce) { .cursor-glow { display: none; } }
</style>
