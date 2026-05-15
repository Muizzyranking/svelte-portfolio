<script lang="ts">
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { projects } from '$lib/data/projects';

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  let active = 'All';

  $: filtered = active === 'All' ? projects : projects.filter(p => p.category === active);
</script>

<svelte:head>
  <title>Projects — Muiz Oyebowale</title>
  <meta name="description" content="A collection of projects by Muiz Oyebowale — backend systems, AI/ML, and full-stack engineering." />
</svelte:head>

<div class="section-inner">
  <a href="/" class="back-link">← Back</a>

  <div class="page-header">
    <div class="section-label">// work</div>
    <h1 class="section-title">All <span>projects</span></h1>
  </div>

  <div class="filter-row" role="tablist" aria-label="Filter projects by category">
    {#each categories as cat}
      <button
        class="filter-btn"
        class:active={active === cat}
        on:click={() => (active = cat)}
        role="tab"
        aria-selected={active === cat}
      >
        {cat}
      </button>
    {/each}
  </div>

  <div class="projects-grid">
    {#each filtered as project (project.slug)}
      <ProjectCard {project} />
    {/each}
  </div>
</div>

<style>
  .back-link {
    display: inline-block;
    font-size: 0.72rem;
    color: var(--text3);
    letter-spacing: 0.06em;
    margin-bottom: 2rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--green); opacity: 1; }

  .page-header { margin-bottom: 2rem; }

  .filter-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }

  .filter-btn {
    font-family: var(--mono);
    font-size: 0.68rem;
    color: var(--text3);
    background: transparent;
    border: 1px solid var(--border);
    padding: 0.3rem 0.8rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    letter-spacing: 0.06em;
    transition: all 0.2s;
  }

  .filter-btn:hover,
  .filter-btn.active {
    color: var(--green);
    border-color: var(--border2);
    background: var(--green-faint);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    .projects-grid { grid-template-columns: 1fr; }
  }
</style>
