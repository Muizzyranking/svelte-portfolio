<script lang="ts">
  import { tick } from 'svelte';

  export let open = false;

  let inputEl: HTMLInputElement;
  let bodyEl: HTMLDivElement;
  let inputValue = '';
  let cmdHistory: string[] = [];
  let histIdx = -1;
  let isAutoTyping = false;
  let hasShownHelp = false;

  type LineType = 'prompt' | 'out' | 'err' | 'info' | 'success' | 'divider' | 'blank';
  type Line = { type: LineType; text: string };

  let lines: Line[] = [];

  /* ── 15+ jokes, randomly selected ── */
  const JOKES = [
    [
      { type: 'success', text: '  "I\'m reading a book about anti-gravity."' },
      { type: 'out',     text: '  "It\'s impossible to put down."' },
    ],
    [
      { type: 'success', text: '  "Why do programmers prefer dark mode?"' },
      { type: 'out',     text: '  "Because light attracts bugs."' },
    ],
    [
      { type: 'success', text: '  "A SQL query walks into a bar..."' },
      { type: 'out',     text: '  "...walks up to two tables and asks: \'Can I join you?\'"' },
    ],
    [
      { type: 'success', text: '  "Why did the developer go broke?"' },
      { type: 'out',     text: '  "Because he used up all his cache."' },
    ],
    [
      { type: 'success', text: '  "There are 10 types of people in the world."' },
      { type: 'out',     text: '  "Those who understand binary, and those who don\'t."' },
    ],
    [
      { type: 'success', text: '  "Why do Java developers wear glasses?"' },
      { type: 'out',     text: '  "Because they can\'t C#."' },
    ],
    [
      { type: 'success', text: '  "A programmer\'s wife says: \'Go to the store and get milk.\'" ' },
      { type: 'out',     text: '  "\'If they have eggs, get a dozen.\'"' },
      { type: 'out',     text: '  "He comes back with 12 cartons of milk."' },
      { type: 'out',     text: '  "They had eggs."' },
    ],
    [
      { type: 'success', text: '  "How many programmers does it take to change a light bulb?"' },
      { type: 'out',     text: '  "None. That\'s a hardware problem."' },
    ],
    [
      { type: 'success', text: '  "Debugging is like being the detective"' },
      { type: 'out',     text: '  "in a crime movie where you\'re also the murderer."' },
    ],
    [
      { type: 'success', text: '  "I would tell you a UDP joke..."' },
      { type: 'out',     text: '  "...but you might not get it."' },
    ],
    [
      { type: 'success', text: '  "Why did the Python programmer move out?"' },
      { type: 'out',     text: '  "Because he couldn\'t handle the Gils."' },
      { type: 'out',     text: '  // (GIL = Global Interpreter Lock)" ' },
    ],
    [
      { type: 'success', text: '  "A byte walks into a bar looking tired."' },
      { type: 'out',     text: '  "Bartender asks: \'What\'s wrong?\'"' },
      { type: 'out',     text: '  "Byte says: \'I\'ve been doing too many bit operations.\'"' },
    ],
    [
      { type: 'success', text: '  "Why can\'t a nose be 12 inches long?"' },
      { type: 'out',     text: '  "Because then it would be a foot."' },
      { type: 'out',     text: '  // not a programming joke. still counts.' },
    ],
    [
      { type: 'success', text: '  "Knock knock."' },
      { type: 'out',     text: '  "Race condition."' },
      { type: 'out',     text: '  "Who\'s there?"' },
    ],
    [
      { type: 'success', text: '  "Why do backend devs make great therapists?"' },
      { type: 'out',     text: '  "They\'re used to handling a lot of issues without crashing."' },
    ],
    [
      { type: 'success', text: '  "My code never has bugs."' },
      { type: 'out',     text: '  "It just develops unexpected features." ' },
    ],
    [
      { type: 'success', text: '  "To understand recursion..."' },
      { type: 'out',     text: '  "...you must first understand recursion."' },
    ],
    [
      { type: 'success', text: '  "An SEO expert walks into a bar, pub, tavern,"' },
      { type: 'out',     text: '  "watering hole, drinks, beer, alcohol..."' },
    ],
  ] as Line[][];

  const usedJokeIndices = new Set<number>();

  function getRandomJoke(): Line[] {
    if (usedJokeIndices.size >= JOKES.length) usedJokeIndices.clear();
    let idx: number;
    do { idx = Math.floor(Math.random() * JOKES.length); } while (usedJokeIndices.has(idx));
    usedJokeIndices.add(idx);
    return JOKES[idx];
  }

  /* ── Commands ── */
  const COMMANDS: Record<string, () => Line[] | '__clear__' | '__close__'> = {
    help: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  NAVIGATION' },
      { type: 'out',     text: '  nav about        → about section' },
      { type: 'out',     text: '  nav projects      → projects section' },
      { type: 'out',     text: '  nav skills        → skills section' },
      { type: 'out',     text: '  nav contact       → contact section' },
      { type: 'divider', text: '' },
      { type: 'info',    text: '  INFORMATION' },
      { type: 'out',     text: '  whoami            → who is this person' },
      { type: 'out',     text: '  stack             → full tech stack' },
      { type: 'out',     text: '  frontend          → frontend skills & story' },
      { type: 'out',     text: '  backend           → backend skills & story' },
      { type: 'out',     text: '  projects          → list all projects' },
      { type: 'out',     text: '  skills            → proficiency breakdown' },
      { type: 'out',     text: '  uses              → daily tools & setup' },
      { type: 'out',     text: '  now               → what I\'m working on' },
      { type: 'out',     text: '  contact           → how to reach me' },
      { type: 'out',     text: '  philosophy        → how I think about work' },
      { type: 'divider', text: '' },
      { type: 'info',    text: '  FUN' },
      { type: 'out',     text: '  joke              → a random joke (15+ available)' },
      { type: 'out',     text: '  clear             → clear terminal' },
      { type: 'out',     text: '  exit              → close terminal' },
      { type: 'divider', text: '' },
      { type: 'out',     text: '  tip: press ↑ ↓ to navigate history' },
    ],

    whoami: () => [
      { type: 'divider', text: '' },
      { type: 'success', text: '  Muiz Oyebowale  /  muizzyranking' },
      { type: 'out',     text: '  Full-stack engineer → AI/ML' },
      { type: 'out',     text: '  5+ years building things end to end.' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Frontend: React, Next.js, Svelte, Vue, TypeScript' },
      { type: 'out',     text: '  Backend:  Python, FastAPI, Django, PostgreSQL' },
      { type: 'out',     text: '  Now:      LLMs, RAG, MLOps' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Terminal-first. Neovim forever.' },
      { type: 'out',     text: '  I ask why until it makes sense.' },
      { type: 'divider', text: '' },
    ],

    frontend: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // frontend story' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  I don\'t just make things look good.' },
      { type: 'out',     text: '  I understand what\'s underneath the interface.' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Frameworks    React · Next.js · Svelte · Vue' },
      { type: 'out',     text: '  Languages     TypeScript · JavaScript (ES2022+)' },
      { type: 'out',     text: '  Styling       Tailwind · CSS Modules · SCSS' },
      { type: 'out',     text: '  State         Zustand · Pinia · Svelte stores' },
      { type: 'out',     text: '  Testing       Vitest · Playwright · Testing Library' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  I care about: accessibility, performance,' },
      { type: 'out',     text: '  loading states, error boundaries, and the' },
      { type: 'out',     text: '  gap between what designers hand off and' },
      { type: 'success', text: '  what users actually experience.' },
      { type: 'divider', text: '' },
    ],

    backend: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // backend story' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  I like the parts nobody sees.' },
      { type: 'out',     text: '  Performance work. Data modelling. Failure modes.' },
      { type: 'out',     text: '  3am alerts that teach you more than docs.' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Languages    Python (primary) · C · Bash' },
      { type: 'out',     text: '  Frameworks   FastAPI · Django · DRF' },
      { type: 'out',     text: '  Databases    PostgreSQL · Redis · pgvector' },
      { type: 'out',     text: '  Queue        Celery · background jobs' },
      { type: 'out',     text: '  Infra        Docker · Nginx · Linux (Arch btw)' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  If I did it right, nobody knows I was there.' },
      { type: 'divider', text: '' },
    ],

    stack: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // full stack — May 2026' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  FRONTEND' },
      { type: 'out',     text: '  React · Next.js · Svelte · SvelteKit · Vue' },
      { type: 'out',     text: '  TypeScript · Tailwind · CSS Modules' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  BACKEND' },
      { type: 'out',     text: '  Python · FastAPI · Django · PostgreSQL · Redis' },
      { type: 'out',     text: '  Celery · Docker · Nginx · Linux · Bash' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  AI / ML' },
      { type: 'out',     text: '  LLM APIs · RAG · Embeddings · PyTorch · MLflow' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  LEARNING' },
      { type: 'out',     text: '  Rust · advanced MLOps · fine-tuning' },
      { type: 'divider', text: '' },
    ],

    projects: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // projects' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  [1]  Project Alpha   ·  Backend    ·  FastAPI + PostgreSQL' },
      { type: 'out',     text: '  [2]  Project Beta    ·  Full-stack ·  Next.js + PostgreSQL' },
      { type: 'out',     text: '  [3]  Project Gamma   ·  AI/ML      ·  RAG pipeline' },
      { type: 'out',     text: '  [4]  Project Delta   ·  Frontend   ·  Vue + TypeScript' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  → type: nav projects  to see full cards' },
      { type: 'divider', text: '' },
    ],

    skills: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // proficiency (honestly)' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  FRONTEND' },
      { type: 'out',     text: '  React / Next.js  ███████████░   88%' },
      { type: 'out',     text: '  TypeScript       ████████████   90%' },
      { type: 'out',     text: '  Svelte           ██████████░░   80%' },
      { type: 'out',     text: '  Vue              █████████░░░   75%' },
      { type: 'out',     text: '  CSS / Tailwind   ████████████   90%' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  BACKEND' },
      { type: 'out',     text: '  Python           ████████████   90%' },
      { type: 'out',     text: '  PostgreSQL        ████████████   88%' },
      { type: 'out',     text: '  FastAPI / Django  ████████████   85%' },
      { type: 'out',     text: '  Docker / Linux    ████████████   88%' },
      { type: 'blank',   text: '' },
      { type: 'info',    text: '  AI / ML' },
      { type: 'out',     text: '  LLM APIs         ██████████░░   75%' },
      { type: 'out',     text: '  RAG / Embeddings ████████░░░░   60%' },
      { type: 'out',     text: '  PyTorch          ██████░░░░░░   45%' },
      { type: 'divider', text: '' },
    ],

    uses: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // daily setup' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Editor     Neovim  (done rewriting config. probably.)' },
      { type: 'out',     text: '  Also       VSCode  (don\'t we all)' },
      { type: 'out',     text: '  Shell      Zsh + Tmux + lazygit + lazydocker' },
      { type: 'out',     text: '  Tools      fzf · ripgrep · bat · curl · httpie' },
      { type: 'out',     text: '  OS         Arch Linux (btw) · Ubuntu on servers' },
      { type: 'out',     text: '  DB         PostgreSQL. I don\'t debate this.' },
      { type: 'divider', text: '' },
    ],

    now: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // what I\'m doing now — May 2026' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  → Pulling on the LLM thread' },
      { type: 'out',     text: '    papers · RAG · fine-tuning · embeddings' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  → Learning Rust (borrow checker and I' },
      { type: 'out',     text: '    have a mutual understanding. mostly.)' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  → Building MLOps: MLflow, model serving' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  → Reading: Chip Huyen\'s ML Engineering' },
      { type: 'divider', text: '' },
    ],

    contact: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // get in touch' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  hello@muizoyebowale.dev' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  GitHub    github.com/placeholder' },
      { type: 'out',     text: '  Twitter   x.com/placeholder' },
      { type: 'out',     text: '  LinkedIn  linkedin.com/in/placeholder' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  Good topics: distributed systems · how things fail' },
      { type: 'out',     text: '  why anything works · bad dad jokes' },
      { type: 'divider', text: '' },
    ],

    philosophy: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // core operating principle' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  I ask why until it makes sense.' },
      { type: 'out',     text: '  Not because I\'m difficult.' },
      { type: 'out',     text: '  Because I genuinely cannot move forward' },
      { type: 'out',     text: '  until I understand the thing underneath the thing.' },
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  It makes me slower sometimes.' },
      { type: 'out',     text: '  It makes the work better, always.' },
      { type: 'blank',   text: '' },
      { type: 'success', text: '  And once in a while, the why reveals that' },
      { type: 'success', text: '  we\'re solving the wrong problem entirely.' },
      { type: 'divider', text: '' },
    ],

    joke: () => [
      { type: 'divider', text: '' },
      { type: 'info',    text: '  // free sample' },
      { type: 'blank',   text: '' },
      ...getRandomJoke(),
      { type: 'blank',   text: '' },
      { type: 'out',     text: '  // type joke again for another one. there are 18+.' },
      { type: 'divider', text: '' },
    ],

    clear:  () => '__clear__',
    exit:   () => '__close__',
  };

  const NAV_SECTIONS = ['about', 'projects', 'skills', 'contact'];

  async function scrollToBottom() {
    await tick();
    if (bodyEl) {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }
  }

  async function runCommand(raw: string) {
    if (!raw.trim()) return;

    cmdHistory = [...cmdHistory, raw];
    histIdx = -1;

    lines = [...lines, { type: 'prompt', text: raw }];

    const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/);

    if (cmd === 'nav') {
      const target = args[0];
      if (target && NAV_SECTIONS.includes(target)) {
        lines = [...lines, { type: 'info', text: `  → navigating to #${target}...` }];
        await scrollToBottom();
        open = false;
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 320);
      } else {
        lines = [
          ...lines,
          { type: 'err', text: `  section not found: "${args[0] ?? ''}"` },
          { type: 'out', text: `  available: ${NAV_SECTIONS.join(', ')}` },
        ];
      }
    } else if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd]();
      if (result === '__clear__') {
        lines = [];
      } else if (result === '__close__') {
        lines = [...lines, { type: 'info', text: '  goodbye.' }];
        await scrollToBottom();
        setTimeout(() => { open = false; }, 400);
      } else {
        lines = [...lines, ...result];
      }
    } else {
      lines = [
        ...lines,
        { type: 'err', text: `  command not found: ${cmd}` },
        { type: 'out', text: `  type 'help' for available commands.` },
      ];
    }

    await scrollToBottom();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const v = inputValue.trim();
      inputValue = '';
      if (v) runCommand(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        inputValue = cmdHistory[cmdHistory.length - 1 - histIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        inputValue = cmdHistory[cmdHistory.length - 1 - histIdx];
      } else {
        histIdx = -1;
        inputValue = '';
      }
    } else if (e.key === 'Escape') {
      open = false;
    }
  }

  // Show help page on open (not whoami, not autotype)
  let hasInitialised = false;

  $: if (open) {
    tick().then(() => {
      inputEl?.focus();
      if (!hasInitialised) {
        hasInitialised = true;
        // Show welcome + help immediately
        const helpLines = COMMANDS.help() as Line[];
        lines = [
          { type: 'info', text: '  muizzyranking — interactive terminal' },
          { type: 'out',  text: '  press ↑ ↓ to navigate history · Esc to close' },
          ...helpLines,
        ];
        scrollToBottom();
      }
    });
  }

  function overlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) open = false;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="overlay" class:open on:click={overlayClick} aria-hidden={!open}>
  <div
    class="window"
    role="dialog"
    aria-label="Interactive terminal"
    aria-modal="true"
  >
    <!-- Titlebar -->
    <div class="titlebar">
      <div class="dots" aria-hidden="true">
        <span class="dot dot-red"    on:click={() => (open = false)}></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <span class="title-text">muizzyranking@portfolio — bash</span>
      <button class="close-btn" on:click={() => (open = false)} aria-label="Close terminal">
        esc
      </button>
    </div>

    <!-- Output body -->
    <div class="body" bind:this={bodyEl} aria-live="polite" aria-atomic="false">
      {#each lines as line}
        <div class="line line-{line.type}">
          {#if line.type === 'prompt'}
            <span class="prompt-glyph">muizzyranking:~$</span>
            <span class="prompt-cmd">{line.text}</span>
          {:else if line.type === 'divider'}
            <div class="divider-rule"></div>
          {:else if line.type === 'blank'}
            &nbsp;
          {:else}
            {line.text}
          {/if}
        </div>
      {/each}
    </div>

    <!-- Input row -->
    <div class="input-row">
      <span class="prompt-glyph-static">muizzyranking:~$</span>
      <input
        bind:this={inputEl}
        bind:value={inputValue}
        on:keydown={handleKeydown}
        class="input"
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="type a command and press Enter"
        aria-label="Terminal input"
      />
      <span class="cursor-blink" aria-hidden="true">▋</span>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.78);
    z-index: 200;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.25s;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    padding: 1rem;
  }

  .overlay.open { opacity: 1; pointer-events: all; }

  .window {
    width: min(700px, 100%);
    max-height: min(560px, 90vh);
    background: #0c0e0a;
    border: 1px solid var(--border2);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transform: translateY(24px) scale(0.96);
    transition: transform 0.35s var(--ease-spring);
    box-shadow:
      0 48px 120px rgba(0,0,0,0.85),
      0 0 0 1px rgba(159,191,107,0.04);
    display: flex; flex-direction: column;
  }

  .overlay.open .window { transform: translateY(0) scale(1); }

  /* Titlebar */
  .titlebar {
    background: #111309;
    padding: 0.6rem 1.1rem;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; user-select: none;
  }

  .dots { display: flex; gap: 0.42rem; }

  .dot {
    width: 11px; height: 11px; border-radius: 50%;
    cursor: pointer; transition: opacity 0.15s;
  }
  .dot:hover { opacity: 0.7; }
  .dot-red    { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green  { background: #28c840; }

  .title-text {
    font-family: var(--mono); font-size: 0.63rem;
    color: var(--text3); letter-spacing: 0.06em;
  }

  .close-btn {
    background: none; border: 1px solid var(--border);
    color: var(--text3); cursor: pointer;
    font-family: var(--mono); font-size: 0.62rem;
    padding: 0.18rem 0.5rem;
    border-radius: var(--radius-sm); letter-spacing: 0.06em;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .close-btn:hover { color: var(--text); border-color: var(--border2); background: var(--surface); }

  /* Body */
  .body {
    padding: 1rem 1.3rem 0.4rem;
    flex: 1; overflow-y: auto;
    font-family: var(--mono); font-size: 0.73rem;
    line-height: 1.7;
    scroll-behavior: smooth;
  }

  .line { word-break: break-word; min-height: 1em; }

  .line-prompt {
    display: flex; gap: 0.6rem;
    align-items: baseline;
    margin: 0.35rem 0 0.05rem;
  }

  .line-out     { color: var(--text2); }
  .line-err     { color: #e06c75; }
  .line-info    { color: #c3a868; font-weight: 500; }
  .line-success { color: var(--green-bright); }
  .line-blank   { line-height: 0.6; }
  .line-divider { padding: 0.15rem 0; }

  .divider-rule {
    height: 1px; background: var(--border);
    margin: 0.2rem 0;
  }

  .prompt-glyph { color: var(--green); flex-shrink: 0; font-weight: 500; }
  .prompt-cmd   { color: var(--text); }

  /* Input row */
  .input-row {
    display: flex; align-items: center; gap: 0.55rem;
    padding: 0.6rem 1.3rem 0.8rem;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
    background: rgba(0,0,0,0.2);
  }

  .prompt-glyph-static {
    font-family: var(--mono); font-size: 0.73rem;
    color: var(--green); flex-shrink: 0; font-weight: 500;
    white-space: nowrap;
  }

  .input {
    flex: 1; background: transparent;
    border: none; outline: none;
    font-family: var(--mono); font-size: 0.73rem;
    color: var(--text);
    caret-color: var(--green);
    min-width: 0;
  }

  .input::placeholder {
    color: var(--text4); font-size: 0.68rem;
  }

  .cursor-blink {
    color: var(--green);
    animation: blink 0.9s step-end infinite;
    line-height: 1; flex-shrink: 0; font-size: 0.75rem;
  }

  @keyframes blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }

  @media (max-width: 600px) {
    .window { border-radius: var(--radius); }
    .body   { font-size: 0.68rem; }
    .input  { font-size: 0.68rem; }
    .title-text { display: none; }
  }
</style>
