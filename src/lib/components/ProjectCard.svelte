<script lang="ts">
  import type { Project } from '$lib/data/projects';
  export let project: Project;
  export let index = 0;

  const icons: Record<string, string> = {
    Backend: '⚙', 'AI/ML': '◈', 'Full-stack': '⚡', Infra: '▦', Other: '○',
  };
</script>

<a
  href="/projects/{project.slug}"
  class="card"
  style="transition-delay: {index * 80}ms"
  aria-label="View {project.title}"
>
  <div class="card-img">
    <span class="card-icon" aria-hidden="true">{icons[project.category] ?? '○'}</span>
    <div class="card-img-overlay" aria-hidden="true"></div>
    <span class="cat-tag">{project.category}</span>
    <span class="year-tag">{project.year}</span>
  </div>

  <div class="card-body">
    <div class="card-top">
      <h3 class="card-title">{project.title}</h3>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </div>
    <p class="card-desc">{project.tagline}</p>

    <div class="stack">
      {#each project.stack.slice(0, 5) as tag}
        <span class="stack-tag">{tag}</span>
      {/each}
      {#if project.stack.length > 5}
        <span class="stack-tag more">+{project.stack.length - 5}</span>
      {/if}
    </div>

    <div class="card-links">
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <span
        class="card-link"
        role="link"
        tabindex="0"
        aria-label="Live demo for {project.title}"
        on:click|stopPropagation|preventDefault={() => window.open(project.liveUrl, '_blank')}
      >↗ Live</span>
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <span
        class="card-link"
        role="link"
        tabindex="0"
        aria-label="GitHub repo for {project.title}"
        on:click|stopPropagation|preventDefault={() => window.open(project.githubUrl, '_blank')}
      >⌥ GitHub</span>
    </div>
  </div>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.3s,
      transform 0.35s var(--ease-out),
      box-shadow 0.35s;
    will-change: transform;
  }

  .card:hover {
    border-color: var(--border2);
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(159,191,107,0.08);
    opacity: 1;
  }

  .card:hover .card-arrow  { transform: translate(3px, -3px); opacity: 1; }
  .card:hover .card-img-overlay { opacity: 1; }
  .card:hover .card-icon { opacity: 0.2; transform: scale(1.1); }

  /* Image area */
  .card-img {
    height: 160px;
    background: var(--bg3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }

  .card-icon {
    font-size: 3rem;
    opacity: 0.1;
    transition: opacity 0.35s, transform 0.35s var(--ease-out);
  }

  .card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--green-faint), transparent);
    opacity: 0;
    transition: opacity 0.35s;
  }

  .cat-tag {
    position: absolute;
    top: 0.7rem; right: 0.7rem;
    font-family: var(--mono);
    font-size: 0.58rem;
    color: var(--green);
    background: rgba(11,12,9,0.8);
    border: 1px solid var(--border2);
    padding: 0.18rem 0.5rem;
    border-radius: var(--radius-sm);
    letter-spacing: 0.06em;
    backdrop-filter: blur(4px);
  }

  .year-tag {
    position: absolute;
    top: 0.7rem; left: 0.7rem;
    font-family: var(--mono);
    font-size: 0.58rem;
    color: var(--text3);
    letter-spacing: 0.06em;
  }

  /* Body */
  .card-body { padding: 1.3rem; display: flex; flex-direction: column; flex: 1; }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.45rem;
    gap: 0.5rem;
  }

  .card-title {
    font-family: var(--display);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .card-arrow {
    color: var(--green);
    opacity: 0.35;
    transition: transform 0.3s var(--ease-spring), opacity 0.3s;
    flex-shrink: 0;
    font-size: 1.1rem;
    margin-top: 0.1rem;
  }

  .card-desc {
    font-size: 0.78rem;
    color: var(--text2);
    line-height: 1.7;
    margin-bottom: 1rem;
    flex: 1;
  }

  .stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: 1rem;
  }

  .more { color: var(--text4); }

  .card-links {
    display: flex;
    gap: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--border);
  }

  .card-link {
    font-family: var(--mono);
    font-size: 0.64rem;
    color: var(--green);
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .card-link:hover { opacity: 0.65; }
</style>
