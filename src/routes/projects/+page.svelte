<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { projects } from '$lib/data/projects';

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  let active = 'All';

  $: filtered = active === 'All' ? projects : projects.filter(p => p.category === active);
</script>

<svelte:head>
  <title>Projects — muizzyranking</title>
  <meta name="description" content="Full-stack projects — frontend, backend, AI/ML by Muiz Oyebowale." />
</svelte:head>

<div class="page-wrap">
  <div class="section-inner">
    <div in:fly={{ y: 16, duration: 400, delay: 80 }}>
      <a href="/" class="back-link">← Back</a>
      <div class="section-label">// work</div>
      <h1 class="section-title">All <span>projects</span></h1>
    </div>

    <!-- Filter tabs -->
    <div
      class="filter-row"
      role="tablist"
      aria-label="Filter by category"
      in:fly={{ y: 12, duration: 350, delay: 160 }}
    >
      {#each categories as cat}
        <button
          class="filter-btn"
          class:active={active === cat}
          on:click={() => (active = cat)}
          role="tab"
          aria-selected={active === cat}
        >
          {cat}
          <span class="filter-count">
            {cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length}
          </span>
        </button>
      {/each}
    </div>

    <!-- Grid with FLIP animation on filter -->
    <div class="projects-grid">
      {#each filtered as project, i (project.slug)}
        <div
          animate:flip={{ duration: 350 }}
          in:fly={{ y: 20, duration: 380, delay: i * 80 }}
          out:fade={{ duration: 150 }}
        >
          <ProjectCard {project} index={i} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .page-wrap { min-height: 80vh; }

  .back-link {
    display: inline-block; font-family: var(--mono); font-size: 0.72rem;
    color: var(--text3); letter-spacing: 0.06em; text-decoration: none;
    margin-bottom: 2rem; transition: color 0.2s;
  }
  .back-link:hover { color: var(--green); opacity: 1; }

  .filter-row {
    display: flex; gap: 0.45rem; flex-wrap: wrap; margin-bottom: 2.5rem;
  }

  .filter-btn {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: var(--mono); font-size: 0.68rem; color: var(--text3);
    background: transparent; border: 1px solid var(--border);
    padding: 0.3rem 0.75rem; border-radius: var(--radius-sm);
    cursor: pointer; letter-spacing: 0.06em; transition: all 0.2s;
  }
  .filter-btn:hover, .filter-btn.active {
    color: var(--green); border-color: var(--border2); background: var(--green-faint);
  }
  .filter-btn.active { font-weight: 600; }

  .filter-count {
    font-size: 0.58rem; color: var(--text4); background: var(--surface2);
    border-radius: 99px; padding: 0.05rem 0.35rem; min-width: 1.2rem;
    text-align: center;
  }

  .filter-btn.active .filter-count { color: var(--green); background: var(--green-faint); }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.4rem;
  }

  /* Make ProjectCard fill wrapper div */
  .projects-grid > div { display: contents; }

  @media (max-width: 600px) {
    .projects-grid { grid-template-columns: 1fr; }
    .projects-grid > div { display: block; }
  }
</style>
