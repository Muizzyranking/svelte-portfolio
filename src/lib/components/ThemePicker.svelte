<script lang="ts">
  import { theme, ACCENTS } from '$lib/stores/theme';
  let open = false;

  function pick(acc: typeof ACCENTS[0]) {
    theme.setAccent(acc);
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="picker-wrap">
  <button
    class="picker-btn"
    on:click={() => (open = !open)}
    aria-label="Change accent colour"
    aria-expanded={open}
    title="Change accent colour"
  >
    <span class="swatch" style="background:{$theme.hex}"></span>
    <span class="picker-label">{$theme.label}</span>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>

  {#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="picker-backdrop" on:click={() => (open = false)}></div>
    <div class="picker-dropdown" role="menu" aria-label="Accent colour options">
      {#each ACCENTS as acc}
        <button
          class="accent-opt"
          class:active={$theme.name === acc.name}
          on:click={() => pick(acc)}
          role="menuitem"
          aria-label="Set accent to {acc.label}"
        >
          <span class="swatch" style="background:{acc.hex}"></span>
          <span>{acc.label}</span>
          {#if $theme.name === acc.name}
            <span class="check" aria-hidden="true">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .picker-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .picker-btn {
    display: flex; align-items: center; gap: 0.45rem;
    font-family: var(--mono); font-size: 0.66rem;
    color: var(--text3);
    background: transparent;
    border: 1px solid var(--border);
    padding: 0.28rem 0.65rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.04em;
  }

  .picker-btn:hover {
    color: var(--text);
    border-color: var(--border2);
    background: var(--surface);
  }

  .swatch {
    width: 9px; height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
    display: block;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.12);
  }

  .picker-label {
    font-size: 0.63rem;
  }

  /* Dropdown */
  .picker-backdrop {
    position: fixed; inset: 0; z-index: 49;
  }

  .picker-dropdown {
    position: absolute;
    top: calc(100% + 0.4rem);
    right: 0;
    background: #0e100b;
    border: 1px solid var(--border2);
    border-radius: var(--radius);
    padding: 0.35rem;
    z-index: 50;
    min-width: 130px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.7);
    animation: popIn 0.2s var(--ease-spring) both;
  }

  .accent-opt {
    display: flex; align-items: center; gap: 0.55rem;
    width: 100%;
    font-family: var(--sans); font-size: 0.76rem;
    color: var(--text2);
    background: none; border: none;
    padding: 0.5rem 0.6rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-align: left;
  }

  .accent-opt:hover { background: var(--surface2); color: var(--text); }
  .accent-opt.active { color: var(--green); }

  .check {
    margin-left: auto;
    font-size: 0.7rem;
    color: var(--green);
  }

  @keyframes popIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }

  /* Hide label on small nav */
  @media (max-width: 900px) {
    .picker-label { display: none; }
  }
</style>
