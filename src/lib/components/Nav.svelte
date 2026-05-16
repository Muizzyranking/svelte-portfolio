<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ThemePicker from './ThemePicker.svelte';

  const dispatch = createEventDispatcher();

  let scrolled = false;
  let showHint = false;
  let mobileOpen = false;

  const navLinks = [
    { href: '/#about',    label: 'about'    },
    { href: '/#projects', label: 'projects' },
    { href: '/#skills',   label: 'skills'   },
    { href: '/#contact',  label: 'contact'  },
  ];

  onMount(() => {
    const handleScroll = () => { scrolled = window.scrollY > 20; };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const t = setTimeout(() => { showHint = true; }, 5000);
    const handleOutside = (e: MouseEvent) => {
      if (mobileOpen && !(e.target as HTMLElement).closest('.nav-inner') && !(e.target as HTMLElement).closest('.mobile-menu')) {
        mobileOpen = false;
      }
    };
    document.addEventListener('click', handleOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(t);
      document.removeEventListener('click', handleOutside);
    };
  });

  function dismissHint() { showHint = false; }

  function openTerminal() {
    dispatch('openTerminal');
    showHint = false;
    mobileOpen = false;
  }

  function navTo(href: string) {
    mobileOpen = false;
    if ($page.url.pathname === '/') {
      const id = href.split('#')[1];
      if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      goto(href);
    }
  }
</script>

<a href="#main-content" class="skip-link">Skip to content</a>

<nav class:scrolled>
  <div class="nav-inner">
    <a href="/" class="nav-logo" aria-label="Home — muizzyranking">
      muizzy<span class="logo-accent">ranking</span>
    </a>

    <!-- Desktop links -->
    <div class="nav-links" role="navigation" aria-label="Main navigation">
      {#each navLinks as link}
        <button class="nav-link" on:click={() => navTo(link.href)}>
          {link.label}
        </button>
      {/each}
      <ThemePicker />
      <button
        class="nav-terminal-btn"
        on:click={openTerminal}
        aria-label="Open terminal (Ctrl+K)"
      >
        <span class="term-dollar">$</span>
        <span>terminal</span>
        <kbd>⌘K</kbd>
      </button>
    </div>

    <!-- Mobile controls -->
    <div class="mobile-controls">
      <ThemePicker />
      <button class="mobile-term-btn" on:click={openTerminal} aria-label="Open terminal">$</button>
      <button
        class="hamburger"
        class:open={mobileOpen}
        on:click|stopPropagation={() => (mobileOpen = !mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <!-- Mobile dropdown -->
  {#if mobileOpen}
    <div class="mobile-menu" role="navigation" aria-label="Mobile navigation">
      {#each navLinks as link}
        <button class="mobile-link" on:click={() => navTo(link.href)}>{link.label}</button>
      {/each}
      <button class="mobile-link mobile-link-terminal" on:click={openTerminal}>
        <span class="term-dollar">$</span> terminal <kbd>⌘K</kbd>
      </button>
    </div>
  {/if}

  <!-- Terminal hint strip -->
  {#if showHint}
    <div class="hint-strip" role="status" aria-live="polite">
      <span class="hint-blink" aria-hidden="true">▋</span>
      <span class="hint-text">Try the terminal — type <code>help</code> to explore</span>
      <button class="hint-dismiss" on:click={dismissHint} aria-label="Dismiss hint">✕</button>
    </div>
  {/if}
</nav>

<style>
  /* Skip link */
  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    z-index: 9999;
    background: var(--green);
    color: #0b0c09;
    font-family: var(--sans);
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.6rem 1.2rem;
    border-radius: 0 0 var(--radius) var(--radius);
    text-decoration: none;
    transition: top 0.2s;
  }
  .skip-link:focus { top: 0; }

  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(11,12,9,0.6);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid transparent;
    transition: border-color 0.35s, background 0.35s;
  }
  nav.scrolled { background: rgba(11,12,9,0.95); border-bottom-color: var(--border); }

  .nav-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 3rem;
    height: 58px; display: flex; align-items: center; justify-content: space-between;
  }

  .nav-logo {
    font-family: var(--display); font-size: 1.05rem; font-weight: 700;
    color: var(--text); letter-spacing: -0.03em; text-decoration: none;
    transition: opacity 0.2s; flex-shrink: 0;
  }
  .nav-logo:hover { opacity: 0.8; }
  .logo-accent { color: var(--green); }

  .nav-links { display: flex; align-items: center; gap: 1.6rem; }

  .nav-link {
    font-family: var(--sans); font-size: 0.78rem; font-weight: 500;
    color: var(--text3); background: none; border: none; cursor: pointer;
    letter-spacing: 0.03em; padding: 0; transition: color 0.2s; position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -3px; left: 0; right: 0;
    height: 1px; background: var(--green); transform: scaleX(0);
    transition: transform 0.25s var(--ease-out);
  }
  .nav-link:hover { color: var(--text); }
  .nav-link:hover::after { transform: scaleX(1); }

  .nav-terminal-btn {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: var(--mono); font-size: 0.72rem; color: var(--green);
    border: 1px solid var(--border2); padding: 0.32rem 0.8rem;
    border-radius: var(--radius-sm); cursor: pointer; background: transparent;
    transition: all 0.2s; letter-spacing: 0.03em;
  }
  .nav-terminal-btn:hover {
    background: var(--green-faint); border-color: var(--green);
    transform: translateY(-1px); box-shadow: 0 4px 12px rgba(159,191,107,0.15);
  }
  .term-dollar { font-weight: 700; color: var(--green-bright); }
  kbd {
    font-family: var(--mono); font-size: 0.57rem; color: var(--text3);
    border: 1px solid var(--border); padding: 0.07rem 0.27rem;
    border-radius: 2px; background: var(--surface);
  }

  /* Mobile */
  .mobile-controls { display: none; align-items: center; gap: 0.6rem; }

  .mobile-term-btn {
    font-family: var(--mono); font-size: 1rem; font-weight: 700; color: var(--green);
    background: var(--green-faint); border: 1px solid var(--border2);
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .mobile-term-btn:hover { background: var(--green-mid); border-color: var(--green); }

  .hamburger {
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; gap: 5px;
    width: 36px; height: 36px; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    cursor: pointer; transition: border-color 0.2s; flex-shrink: 0;
  }
  .hamburger:hover { border-color: var(--border2); }
  .hamburger span {
    display: block; width: 16px; height: 1.5px; background: var(--text2);
    border-radius: 2px; transition: all 0.25s var(--ease-out); transform-origin: center;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .mobile-menu {
    background: rgba(11,12,9,0.98); border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border); padding: 0.5rem 1.4rem 1rem;
    display: flex; flex-direction: column;
    animation: dropDown 0.25s var(--ease-out) both;
  }
  .mobile-link {
    font-family: var(--sans); font-size: 0.9rem; font-weight: 500; color: var(--text2);
    background: none; border: none; border-bottom: 1px solid var(--border);
    padding: 0.9rem 0; text-align: left; cursor: pointer;
    transition: color 0.2s, padding-left 0.2s; letter-spacing: 0.01em;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .mobile-link:last-child { border-bottom: none; }
  .mobile-link:hover { color: var(--green); padding-left: 0.3rem; }
  .mobile-link-terminal { color: var(--green); font-family: var(--mono); font-size: 0.8rem; }

  /* Hint strip */
  .hint-strip {
    background: rgba(159,191,107,0.06); border-top: 1px solid var(--border2);
    padding: 0.32rem 3rem; display: flex; align-items: center; gap: 0.6rem;
    animation: dropDown 0.4s var(--ease-out) both;
  }
  .hint-blink { color: var(--green); animation: blink 1s step-end infinite; font-size: 0.72rem; line-height: 1; }
  .hint-text { font-family: var(--mono); font-size: 0.66rem; color: var(--text3); letter-spacing: 0.04em; flex: 1; }
  .hint-text code { color: var(--green); background: var(--green-faint); padding: 0.05rem 0.28rem; border-radius: 2px; }
  .hint-dismiss { background: none; border: none; color: var(--text4); cursor: pointer; font-size: 0.64rem; padding: 0.2rem; transition: color 0.2s; line-height: 1; }
  .hint-dismiss:hover { color: var(--text2); }

  @keyframes dropDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

  @media (max-width: 768px) {
    .nav-inner { padding: 0 1.4rem; }
    .nav-links { display: none; }
    .mobile-controls { display: flex; }
    .hint-strip { padding: 0.32rem 1.4rem; }
  }
</style>
