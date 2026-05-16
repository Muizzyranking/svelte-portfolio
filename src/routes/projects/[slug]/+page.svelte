<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  $: p = data.project;

  const catColor: Record<string, string> = {
    'Backend':    '#9fbf6b',
    'AI/ML':      '#c3a868',
    'Full-stack': '#6b9fbf',
    'Frontend':   '#bf6b9f',
    'Infra':      '#9a9fbf',
    'Other':      '#6b7f5e',
  };
</script>

<svelte:head>
  <title>{p.title} — muizzyranking</title>
  <meta name="description" content={p.tagline} />
</svelte:head>

<div class="page">
  <div class="page-inner">

    <!-- Back -->
    <a href="/projects" class="back-link">← All projects</a>

    <!-- ── Header ── -->
    <header class="proj-header">
      <div class="proj-meta">
        <span class="cat-badge" style="color:{catColor[p.category]};border-color:{catColor[p.category]}33;">
          {p.category}
        </span>
        <span class="proj-year">{p.year}</span>
      </div>

      <h1 class="proj-title">{p.title}</h1>
      <p class="proj-tagline">{p.tagline}</p>

      <div class="proj-actions">
        <a class="btn-primary" href={p.liveUrl} target="_blank" rel="noopener noreferrer">↗ Live</a>
        <a class="btn-outline" href={p.githubUrl} target="_blank" rel="noopener noreferrer">⌥ GitHub</a>
      </div>
    </header>

    <!-- ── Main layout ── -->
    <div class="proj-body">

      <!-- Left column — sections -->
      <div class="proj-content">

        <!-- OVERVIEW -->
        <div class="content-section">
          <div class="cs-label">
            <span class="cs-num">01</span>
            Overview
          </div>
          <div class="cs-body">
            {#each p.overview.split('\n\n').filter(s => s.trim()) as para}
              <p>{para.trim()}</p>
            {/each}
          </div>
        </div>

        <!-- SCREENSHOTS -->
        {#if p.screenshots && p.screenshots.length > 0}
          <div class="content-section">
            <div class="cs-label">
              <span class="cs-num">02</span>
              Screenshots
            </div>
            <div class="screenshots-grid">
              {#each p.screenshots as src, i}
                <figure class="screenshot">
                  <img src={src} alt="Screenshot {i + 1} of {p.title}" loading="lazy" />
                </figure>
              {/each}
            </div>
          </div>
        {/if}

        <!-- THE CHALLENGE -->
        <div class="content-section">
          <div class="cs-label">
            <span class="cs-num">03</span>
            The Challenge
          </div>
          <div class="cs-body">
            {#each p.challenge.split('\n\n').filter(s => s.trim()) as para}
              <p>{para.trim()}</p>
            {/each}
          </div>
        </div>

        <!-- WHAT I LEARNED -->
        <div class="content-section">
          <div class="cs-label">
            <span class="cs-num">04</span>
            What I Learned
          </div>
          <ul class="learned-list">
            {#each p.learned as item}
              <li>
                <span class="learned-arrow" aria-hidden="true">→</span>
                <span>{item}</span>
              </li>
            {/each}
          </ul>
        </div>

      </div>

      <!-- Right sidebar -->
      <aside class="proj-sidebar">

        <div class="sidebar-card">
          <div class="sidebar-label">// highlights</div>
          <ul class="highlights-list">
            {#each p.highlights as item}
              <li>
                <span class="hi-dot" aria-hidden="true"></span>
                {item}
              </li>
            {/each}
          </ul>
        </div>

        <div class="sidebar-card">
          <div class="sidebar-label">// tech stack</div>
          <div class="stack-list">
            {#each p.stack as tag}
              <span class="stack-tag">{tag}</span>
            {/each}
          </div>
        </div>

        <div class="sidebar-card">
          <div class="sidebar-label">// links</div>
          <div class="link-list">
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" class="sidebar-link">
              ↗ Live project
            </a>
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" class="sidebar-link">
              ⌥ GitHub repository
            </a>
          </div>
        </div>

      </aside>
    </div>
  </div>
</div>

<style>
  .page { min-height: 60vh; }

  .page-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 4rem 3rem 7rem;
  }

  .back-link {
    display: inline-block;
    font-family: var(--mono); font-size: 0.72rem;
    color: var(--text3); letter-spacing: 0.06em;
    text-decoration: none; margin-bottom: 2.5rem;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--green); opacity: 1; }

  /* Header */
  .proj-header { margin-bottom: 3rem; }

  .proj-meta {
    display: flex; align-items: center; gap: 0.9rem;
    margin-bottom: 1rem;
  }

  .cat-badge {
    font-family: var(--mono); font-size: 0.62rem;
    border: 1px solid; padding: 0.2rem 0.6rem;
    border-radius: var(--radius-sm); letter-spacing: 0.06em;
    background: transparent;
  }

  .proj-year {
    font-family: var(--mono); font-size: 0.62rem;
    color: var(--text3); letter-spacing: 0.06em;
  }

  .proj-title {
    font-family: var(--display);
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 700; letter-spacing: -0.04em;
    color: var(--text); line-height: 1.02; margin-bottom: 0.75rem;
  }

  .proj-tagline {
    font-family: var(--sans); font-size: 1rem;
    color: var(--text2); line-height: 1.65;
    max-width: 560px; margin-bottom: 1.5rem;
  }

  .proj-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; }

  /* Body layout */
  .proj-body {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 4rem; align-items: start;
  }

  /* ── Content sections ── */
  .proj-content {
    display: flex; flex-direction: column; gap: 0;
  }

  .content-section {
    padding: 2.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  .content-section:last-child { border-bottom: none; }

  .cs-label {
    font-family: var(--display);
    font-size: 1.3rem; font-weight: 700;
    letter-spacing: -0.03em; color: var(--text);
    margin-bottom: 1.3rem;
    display: flex; align-items: baseline; gap: 0.6rem;
  }

  .cs-num {
    font-family: var(--mono); font-size: 0.65rem;
    color: var(--green); letter-spacing: 0.1em;
    font-weight: 400;
  }

  .cs-body p {
    font-family: var(--sans); font-size: 0.9rem;
    color: var(--text2); line-height: 1.85;
    margin-bottom: 1rem;
  }
  .cs-body p:last-child { margin-bottom: 0; }

  /* Screenshots */
  .screenshots-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

  .screenshot {
    margin: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--bg3);
    transition: border-color 0.3s;
  }
  .screenshot:hover { border-color: var(--border2); }

    .screenshot img {
      width: 100%;
      height: auto;
      display: block;
    }

  .screenshot-placeholder {
    height: 180px;
    border: 1px dashed var(--border2);
    border-radius: var(--radius);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 0.8rem; background: var(--bg3);
  }

  .placeholder-icon {
    font-size: 2rem; opacity: 0.1; line-height: 1;
  }

  .placeholder-text {
    font-family: var(--mono); font-size: 0.65rem;
    color: var(--text4); letter-spacing: 0.04em;
    text-align: center; line-height: 1.8;
  }

  .placeholder-text code {
    color: var(--green); background: var(--green-faint);
    padding: 0.05rem 0.3rem; border-radius: 2px;
  }

  /* What I learned */
  .learned-list {
    list-style: none;
    display: flex; flex-direction: column; gap: 1rem;
  }

  .learned-list li {
    display: flex; gap: 0.75rem; align-items: flex-start;
    font-family: var(--sans); font-size: 0.875rem;
    color: var(--text2); line-height: 1.65;
  }

  .learned-arrow {
    color: var(--green); flex-shrink: 0;
    margin-top: 0.05rem; font-size: 0.85rem;
  }

  /* ── Sidebar ── */
  .proj-sidebar {
    display: flex; flex-direction: column; gap: 1.2rem;
    position: sticky; top: 5rem;
  }

  .sidebar-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.15rem;
    transition: border-color 0.3s;
  }
  .sidebar-card:hover { border-color: var(--border2); }

  .sidebar-label {
    font-family: var(--mono); font-size: 0.6rem;
    color: var(--green); letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 0.85rem; padding-bottom: 0.55rem;
    border-bottom: 1px solid var(--border);
  }

  .highlights-list {
    list-style: none;
    display: flex; flex-direction: column; gap: 0.65rem;
  }

  .highlights-list li {
    font-family: var(--sans); font-size: 0.76rem;
    color: var(--text2); line-height: 1.55;
    display: flex; gap: 0.5rem; align-items: flex-start;
  }

  .hi-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--green); flex-shrink: 0; margin-top: 0.42rem;
  }

  .stack-list {
    display: flex; flex-wrap: wrap; gap: 0.38rem;
  }

  .link-list {
    display: flex; flex-direction: column; gap: 0.6rem;
  }

  .sidebar-link {
    font-family: var(--mono); font-size: 0.72rem;
    color: var(--green); text-decoration: none;
    transition: opacity 0.2s;
  }
  .sidebar-link:hover { opacity: 0.65; }

  /* Mobile */
  @media (max-width: 768px) {
    .page-inner { padding: 3rem 1.4rem 5rem; }
    .proj-body  { grid-template-columns: 1fr; gap: 2.5rem; }
    .proj-sidebar { position: static; }
    .cs-label { font-size: 1.1rem; }
  }
</style>
