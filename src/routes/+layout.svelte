<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Terminal from '$lib/components/Terminal.svelte';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  let terminalOpen = false;
  function openTerminal() { terminalOpen = true; }

  // Single persistent observer — recreated after every navigation
  let revealObserver: IntersectionObserver | null = null;

  function teardown() {
    if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
  }

  function setupReveal() {
    teardown();
    revealObserver = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver?.unobserve(e.target);
        }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
    );
    // Also instantly reveal anything already on screen
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        el.classList.add('visible');
      } else {
        revealObserver!.observe(el);
      }
    });
  }

  onMount(() => {
    setupReveal();

    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        terminalOpen = !terminalOpen;
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      teardown();
      window.removeEventListener('keydown', handleKey);
    };
  });

  // Re-run after every client-side navigation (fixes back-navigation bug)
  afterNavigate(() => {
    // Small delay to let Svelte finish rendering new page DOM
    setTimeout(setupReveal, 80);
  });
</script>

<Nav on:openTerminal={openTerminal} />

<main id="main-content">
  <slot />
</main>

<footer>
  <div class="footer-inner">
    <span class="footer-note">© 2026 muizzyranking</span>
    <span class="footer-center footer-note">built with intention · shipped with Svelte</span>
    <span class="footer-note">$ nvim . | arch btw</span>
  </div>
</footer>

<Terminal bind:open={terminalOpen} />

<style>
  main { padding-top: 58px; }

  footer {
    border-top: 1px solid var(--border);
  }

  .footer-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 1.8rem 3rem;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
  }

  .footer-note {
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--text4);
    letter-spacing: 0.06em;
  }

  .footer-center { color: var(--text3); }

  @media (max-width: 768px) {
    .footer-inner {
      flex-direction: column; gap: 0.5rem;
      padding: 1.5rem 1.4rem; text-align: center;
    }
    .footer-center { display: none; }
  }
</style>
