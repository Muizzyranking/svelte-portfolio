<script lang="ts">
  import { onMount } from 'svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import ParticleCanvas from '$lib/components/ParticleCanvas.svelte';
  import { projects } from '$lib/data/projects';

  const skillGroups = [
    {
      label: 'Frontend',
      color: '#9fbf6b',
      items: [
        { name: 'React / Next.js',  level: 88 },
        { name: 'TypeScript',       level: 90 },
        { name: 'Svelte',           level: 80 },
        { name: 'Vue',              level: 75 },
        { name: 'CSS / Tailwind',   level: 90 },
      ],
    },
    {
      label: 'Backend',
      color: '#c3a868',
      items: [
        { name: 'Python',           level: 90 },
        { name: 'FastAPI / Django', level: 85 },
        { name: 'PostgreSQL',       level: 88 },
        { name: 'Redis',            level: 80 },
        { name: 'Docker / Linux',   level: 88 },
      ],
    },
    {
      label: 'AI / ML',
      color: '#6b9fbf',
      items: [
        { name: 'LLM APIs',         level: 75 },
        { name: 'RAG / Embeddings', level: 60 },
        { name: 'PyTorch',          level: 45 },
        { name: 'MLflow',           level: 40 },
        { name: 'Rust',             level: 30 },
      ],
    },
  ];

  const timeline = [
    { year: '2021', head: 'HTML → JavaScript', text: "Things worked. I didn't know why. That bothered me more than it should have." },
    { year: '2022', head: 'ALX, C & Python', text: "C first. Memory, pointers, what the machine actually does. Then Python. Then Bash, Vim, humility." },
    { year: '2023', head: 'Frontend & first real users', text: "Built UIs people actually touched. Learned React. Also shipped a booking system that broke once at the worst time. Fixed it under pressure." },
    { year: '2024', head: 'Thinking full-stack', text: "Not just features — systems. APIs, state management, background jobs, data flow, failure modes, and the gap between what you ship and what users experience." },
    { year: '2025–26', head: 'The AI thread', text: "LLMs, RAG, fine-tuning. One paper led to five more. Sleep took a hit. Still worth it. Also: Rust, because apparently I enjoy difficulty." },
  ];

  const topics = [
    'Distributed systems', 'How things fail', 'History of computing',
    'Why anything works at all', 'The philosophy of debugging', 'Bad dad jokes',
  ];

  /* ── Rotating hero word ── */
  const heroWords = ['systems', 'products', 'interfaces', 'pipelines'];
  let wordIdx = 0;
  let currentWord = heroWords[0];
  let wordVisible = true;

  /* ── Contact form ── */
  let formState: 'idle' | 'sending' | 'sent' = 'idle';
  let formName = '', formEmail = '', formMessage = '';

  function handleForm(e: SubmitEvent) {
    e.preventDefault();
    formState = 'sending';
    setTimeout(() => {
      formState = 'sent';
      formName = ''; formEmail = ''; formMessage = '';
      setTimeout(() => (formState = 'idle'), 3000);
    }, 900);
  }

  onMount(() => {
    // Rotating word
    const iv = setInterval(async () => {
      wordVisible = false;
      await new Promise(r => setTimeout(r, 320));
      wordIdx = (wordIdx + 1) % heroWords.length;
      currentWord = heroWords[wordIdx];
      wordVisible = true;
    }, 2800);

    // Skill bar animation on scroll into view
    const skillSection = document.getElementById('skills');
    if (skillSection) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          skillSection.querySelectorAll<HTMLElement>('.skill-fill').forEach(bar => {
            const lvl = bar.dataset.level ?? '0';
            setTimeout(() => { bar.style.width = lvl + '%'; }, 120);
          });
          obs.disconnect();
        }
      }, { threshold: 0.15 });
      obs.observe(skillSection);
    }

    return () => clearInterval(iv);
  });
</script>

<svelte:head>
  <title>muizzyranking — Full-stack Engineer & AI/ML</title>
  <meta name="description" content="Full-stack engineer who builds the systems nobody sees — and the interfaces everyone does. React, Next.js, Svelte, Vue, Python, FastAPI. Now pointing all of it at AI/ML." />
</svelte:head>

<!-- ══════════════ HERO ══════════════ -->
<section id="hero">
  <div class="bg-grid" aria-hidden="true"></div>
  <ParticleCanvas />
  <div class="bg-glow-tl" aria-hidden="true"></div>
  <div class="bg-glow-br" aria-hidden="true"></div>

  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-eyebrow">
        <span class="eyebrow-dot" aria-hidden="true"></span>
        Available for work &amp; collaboration
      </div>

      <h1 class="hero-name">
        <span class="name-line">Muiz</span>
        <span class="name-line accent">Oyebowale</span>
      </h1>

      <p class="hero-tagline">
        I build
        <span class="rotating-word" class:visible={wordVisible} aria-live="polite">
          {currentWord}
        </span>
        end to end —<br/>
        the part you see and the part you don't.
      </p>

      <p class="hero-sub">
        Full-stack by craft. Frontend by care. Backend by instinct.<br/>
        Now teaching systems to think with AI.
      </p>

      <div class="hero-badges">
        {#each ['React', 'Next.js', 'Svelte', 'Vue', 'Python', 'FastAPI'] as badge}
          <span class="badge">{badge}</span>
        {/each}
      </div>

      <div class="hero-ctas">
        <a class="btn-primary" href="#contact">Get in touch</a>
        <a class="btn-outline" href="/resume.pdf" target="_blank" rel="noopener noreferrer">↓ Resume</a>
      </div>

      <div class="hero-social">
        <a href="https://github.com/muizzyranking" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <a href="https://x.com/muizzyranking" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter
        </a>
        <a href="https://linkedin.com/in/muizzyrankin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </div>
    </div>

    <div class="hero-right">
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-num">5+</div>
          <div class="stat-label">Years building</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">4</div>
          <div class="stat-label">JS frameworks</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">0</div>
          <div class="stat-label">Console warnings</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">3am</div>
          <div class="stat-label">Best debug hour</div>
        </div>
      </div>

      <div class="code-card">
        <div class="code-titlebar">
          <span class="code-dot" style="background:#ff5f57"></span>
          <span class="code-dot" style="background:#febc2e"></span>
          <span class="code-dot" style="background:#28c840"></span>
          <span class="code-filename">muiz.config.ts</span>
        </div>
        <div class="code-body">
          <div class="code-ln"><span class="c">// full-stack engineer</span></div>
          <div class="code-ln"><span class="kw">const</span> frontend = [<span class="s">'React'</span>, <span class="s">'Next'</span>, <span class="s">'Svelte'</span>, <span class="s">'Vue'</span>]</div>
          <div class="code-ln"><span class="kw">const</span> backend  = [<span class="s">'Python'</span>, <span class="s">'FastAPI'</span>, <span class="s">'PostgreSQL'</span>]</div>
          <div class="code-ln"><span class="kw">const</span> now      = [<span class="s">'LLMs'</span>, <span class="s">'RAG'</span>, <span class="s">'MLOps'</span>, <span class="s">'Rust'</span>]</div>
          <div class="code-ln"><span class="kw">const</span> editor   = <span class="s">'Neovim'</span> <span class="c">// still. 2026.</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="scroll-hint" aria-hidden="true">
    <div class="scroll-line"></div>
    <span>scroll</span>
  </div>
</section>

<!-- ══════════════ ABOUT ══════════════ -->
<section id="about">
  <div class="section-inner">
    <div class="reveal">
      <div class="section-label">01 — origin</div>
      <h2 class="section-title">The <span>actual</span> story</h2>
    </div>

    <div class="about-grid">
      <div class="about-body reveal">
        <blockquote class="pull-quote">
          "I didn't pick engineering. Engineering picked me — and then I had a lot of questions about why."
        </blockquote>
        <p>It started with curiosity — not about what things looked like, but what they were doing underneath. <strong>What was the computer actually doing? Why did this line of code produce that result?</strong> The questions didn't stop, and at some point I realised I was an engineer.</p>
        <p>I started with C. Brutal, unforgiving, and exactly right. It taught me fundamentals in a way that made every language after it feel comprehensible. Then JavaScript, then Python — and suddenly the whole stack was open.</p>
        <p><strong>I care about the full picture.</strong> The API that serves the data. The component that renders it. The loading state when it's slow. The error message when it fails. The background job that processes it overnight. I've worked on all of it, and I think that's what makes the work better.</p>
        <p>Now I'm pointing that same obsession at AI and ML. Not because it's a trend. Because I started pulling the thread and couldn't stop. The intersection of systems engineering and intelligence is the most interesting problem space I've encountered — and I'm still early.</p>
      </div>

      <div class="timeline reveal reveal-delay-2" aria-label="Career timeline">
        {#each timeline as item}
          <div class="tl-item">
            <div class="tl-dot" aria-hidden="true"></div>
            <div class="tl-content">
              <div class="tl-year">{item.year}</div>
              <div class="tl-head">{item.head}</div>
              <div class="tl-text">{item.text}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- ══════════════ PROJECTS ══════════════ -->
<section id="projects">
  <div class="section-inner">
    <div class="reveal">
      <div class="section-label">02 — work</div>
      <h2 class="section-title">Selected <span>projects</span></h2>
    </div>

    <div class="projects-grid reveal">
      {#each projects.filter(p => p.featured) as project, i}
        <ProjectCard {project} index={i} />
      {/each}
    </div>

    <div class="projects-footer reveal">
      <a href="/projects" class="btn-outline">View all projects →</a>
    </div>
  </div>
</section>

<!-- ══════════════ SKILLS ══════════════ -->
<section id="skills">
  <div class="section-inner">
    <div class="reveal">
      <div class="section-label">03 — tools</div>
      <h2 class="section-title">Stack &amp; <span>tooling</span></h2>
    </div>

    <div class="skills-grid reveal">
      {#each skillGroups as group}
        <div class="skill-group">
          <div class="skill-group-label" style="border-color:{group.color}22">
            <span class="group-dot" style="background:{group.color}"></span>
            {group.label}
          </div>
          {#each group.items as skill}
            <div class="skill-pill">{skill.name}</div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ══════════════ CONTACT ══════════════ -->
<section id="contact">
  <div class="section-inner">
    <div class="reveal">
      <div class="section-label">04 — contact</div>
      <h2 class="section-title">Let's <span>talk</span></h2>
    </div>

    <div class="contact-grid">
      <div class="contact-left reveal">
        <p>I'm bad at small talk. I'm very good at the kind of conversation that starts with "wait, but why does that work?" and ends ninety minutes later with everyone slightly smarter.</p>
        <p>If you have a problem worth solving, a product worth building, or a question worth asking — reach out.</p>

        <a class="contact-email" href="mailto:oyebowaleabdulmuiz@gmail.com">
          <span class="ce-arrow">→</span>
          oyebowaleabdulmuiz@gmail.com
        </a>

        <div class="topics">
          <div class="topics-label">// good conversation topics</div>
          {#each topics as topic}
            <div class="topic-item">{topic}</div>
          {/each}
        </div>
      </div>

      <form class="contact-form reveal reveal-delay-2" on:submit={handleForm} novalidate>
        <div class="form-group">
          <label for="c-name">Name</label>
          <input id="c-name" type="text" bind:value={formName}
            placeholder="Your name" required disabled={formState !== 'idle'} />
        </div>
        <div class="form-group">
          <label for="c-email">Email</label>
          <input id="c-email" type="email" bind:value={formEmail}
            placeholder="your@email.com" required disabled={formState !== 'idle'} />
        </div>
        <div class="form-group">
          <label for="c-msg">Message</label>
          <textarea id="c-msg" bind:value={formMessage}
            placeholder="What's on your mind?" required disabled={formState !== 'idle'}></textarea>
        </div>
        <button
          type="submit" class="form-submit"
          class:sent={formState === 'sent'}
          disabled={formState !== 'idle'}
        >
          {#if formState === 'idle'}Send message →
          {:else if formState === 'sending'}Sending...
          {:else}✓ Sent!{/if}
        </button>
      </form>
    </div>
  </div>
</section>

<style>
/* ── Hero ── */
#hero {
  min-height: 100vh;
  display: flex; align-items: center;
  position: relative; overflow: hidden;
  padding: 7rem 3rem 5rem;
}

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.28; z-index: 0; pointer-events: none;
}

.bg-glow-tl {
  position: absolute; top: -8%; left: -4%;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(159,191,107,0.07), transparent 65%);
  z-index: 0; pointer-events: none;
}

.bg-glow-br {
  position: absolute; bottom: -12%; right: -4%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(159,191,107,0.04), transparent 65%);
  z-index: 0; pointer-events: none;
}

.hero-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 5rem; max-width: 1100px; margin: 0 auto; width: 100%;
}

.hero-left {
  display: flex; flex-direction: column; justify-content: center;
}

.hero-eyebrow {
  display: flex; align-items: center; gap: 0.6rem;
  font-family: var(--mono); font-size: 0.67rem;
  color: var(--text3); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 1.8rem;
  animation: fadeUp 0.7s 0.1s var(--ease-out) both;
}

.eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green);
  animation: pulse 2.2s ease-in-out infinite;
}

.hero-name {
  display: flex; flex-direction: column;
  font-family: var(--display);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 700; letter-spacing: -0.04em; line-height: 0.94;
  margin-bottom: 1.4rem;
}

.name-line { display: block; animation: fadeUp 0.7s var(--ease-out) both; }
.name-line:nth-child(1) { animation-delay: 0.2s; }
.name-line:nth-child(2) { animation-delay: 0.32s; }
.name-line.accent { color: var(--green); }

.hero-tagline {
  font-family: var(--sans);
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  color: var(--text2); line-height: 1.7;
  margin-bottom: 0.55rem;
  animation: fadeUp 0.7s 0.44s var(--ease-out) both;
}

.rotating-word {
  color: var(--green); font-weight: 600;
  display: inline-block;
  transition: opacity 0.28s, transform 0.28s var(--ease-out);
  opacity: 0; transform: translateY(5px);
}
.rotating-word.visible { opacity: 1; transform: none; }

.hero-sub {
  font-family: var(--sans); font-size: 0.85rem;
  color: var(--text3); line-height: 1.7; margin-bottom: 1.4rem;
  animation: fadeUp 0.7s 0.52s var(--ease-out) both;
}

.hero-badges {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  margin-bottom: 1.8rem;
  animation: fadeUp 0.7s 0.58s var(--ease-out) both;
}

.badge {
  font-family: var(--mono); font-size: 0.62rem;
  color: var(--green); letter-spacing: 0.05em;
  border: 1px solid var(--border2);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
  background: var(--green-faint);
  transition: background 0.2s, border-color 0.2s;
}
.badge:hover { background: var(--green-mid); border-color: var(--green); }

.hero-ctas {
  display: flex; gap: 0.8rem; flex-wrap: wrap;
  margin-bottom: 1.8rem;
  animation: fadeUp 0.7s 0.66s var(--ease-out) both;
}

.hero-social {
  display: flex; gap: 1.5rem; flex-wrap: wrap;
  animation: fadeUp 0.7s 0.76s var(--ease-out) both;
}

.hero-social a {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: var(--sans); font-size: 0.75rem; font-weight: 500;
  color: var(--text3); text-decoration: none; transition: color 0.2s;
}
.hero-social a:hover { color: var(--green); opacity: 1; }

/* Right */
.hero-right {
  display: flex; flex-direction: column; gap: 1rem; justify-content: center;
  animation: fadeLeft 0.8s 0.4s var(--ease-out) both;
}

.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.2rem; border-radius: var(--radius);
  position: relative; overflow: hidden;
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.stat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg,transparent,var(--green),transparent);
  opacity: 0.3;
}
.stat-card:hover { border-color: var(--border2); transform: translateY(-2px); }

.stat-num {
  font-family: var(--display); font-size: 2rem; font-weight: 700;
  color: var(--green); line-height: 1; letter-spacing: -0.03em;
}
.stat-label {
  font-family: var(--mono); font-size: 0.58rem;
  color: var(--text3); letter-spacing: 0.08em;
  text-transform: uppercase; margin-top: 0.3rem;
}

.code-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden;
}
.code-titlebar {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 0.5rem 0.9rem;
  display: flex; align-items: center; gap: 0.38rem;
}
.code-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.code-filename {
  font-family: var(--mono); font-size: 0.6rem;
  color: var(--text3); margin-left: 0.3rem; letter-spacing: 0.04em;
}
.code-body {
  padding: 0.9rem 1.1rem;
  font-family: var(--mono); font-size: 0.7rem;
  line-height: 1.9; color: var(--text2);
}
.code-ln { white-space: pre-wrap; }
.c  { color: var(--text4); }
.kw { color: var(--green); }
.s  { color: #c3a868; }

/* Scroll hint */
.scroll-hint {
  position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  font-family: var(--mono); font-size: 0.57rem;
  color: var(--text4); letter-spacing: 0.12em; text-transform: uppercase;
  animation: fadeUp 1s 1.1s var(--ease-out) both;
}
.scroll-line {
  width: 1px; height: 38px;
  background: linear-gradient(to bottom, var(--green), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

/* ── About ── */
#about { border-top: 1px solid var(--border); }

.about-grid {
  display: grid; grid-template-columns: 1.15fr 1fr;
  gap: 5rem; align-items: start;
}

.about-body p {
  font-family: var(--sans); font-size: 0.9rem;
  color: var(--text2); line-height: 1.85; margin-bottom: 1.1rem;
}
.about-body strong { color: var(--text); }

.pull-quote {
  font-family: var(--display); font-size: 1.15rem; font-weight: 600;
  color: var(--text); line-height: 1.45;
  margin-bottom: 1.8rem;
  padding-left: 1.2rem; border-left: 2px solid var(--green);
  font-style: normal; letter-spacing: -0.02em;
}

/* Timeline */
.timeline { display: flex; flex-direction: column; }

.tl-item {
  display: flex; gap: 1rem;
  padding-bottom: 1.5rem; position: relative;
}
.tl-item:not(:last-child)::before {
  content: '';
  position: absolute; left: 0.3rem; top: 1.1rem; bottom: 0;
  width: 1px; background: var(--border);
}

.tl-dot {
  width: 0.65rem; height: 0.65rem;
  border-radius: 50%;
  border: 1.5px solid var(--green);
  background: var(--bg);
  flex-shrink: 0; margin-top: 0.3rem;
  transition: background 0.2s;
}
.tl-item:hover .tl-dot { background: var(--green); }

.tl-year { font-family: var(--mono); font-size: 0.62rem; color: var(--green); margin-bottom: 0.12rem; letter-spacing: 0.05em; }
.tl-head { font-family: var(--sans); font-size: 0.85rem; color: var(--text); margin-bottom: 0.2rem; font-weight: 600; }
.tl-text { font-family: var(--sans); font-size: 0.76rem; color: var(--text2); line-height: 1.68; }

/* ── Projects ── */
#projects { border-top: 1px solid var(--border); }

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.4rem; margin-bottom: 2.5rem;
}
.projects-footer { text-align: center; }

/* ── Skills ── */
#skills { border-top: 1px solid var(--border); }

.skill-pill {
  font-family: var(--sans);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text2);
  padding: 0.45rem 0.75rem;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.skill-pill:hover {
  color: var(--green);
  border-color: var(--border2);
  background: var(--green-faint);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 1.4rem;
}

.skill-group {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius); padding: 1.4rem;
  transition: border-color 0.3s;
}
.skill-group:hover { border-color: var(--border2); }

.skill-group-label {
  font-family: var(--display); font-size: 0.88rem; font-weight: 700;
  color: var(--text); letter-spacing: -0.01em;
  margin-bottom: 1.1rem; padding-bottom: 0.7rem;
  border-bottom: 1px solid;
  display: flex; align-items: center; gap: 0.5rem;
}

.group-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}

.skill-fill {
  height: 100%; border-radius: 99px; width: 0%;
  transition: width 1.25s var(--ease-out);
}

/* ── Contact ── */
#contact { border-top: 1px solid var(--border); }

.contact-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 5rem;
}

.contact-left p {
  font-family: var(--sans); font-size: 0.9rem;
  color: var(--text2); line-height: 1.85; margin-bottom: 1.1rem;
}

.contact-email {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: var(--sans); font-size: 0.95rem; font-weight: 500;
  color: var(--green); text-decoration: none;
  border-bottom: 1px solid var(--border2);
  padding-bottom: 0.22rem; margin-bottom: 2rem;
  transition: border-color 0.2s;
}
.contact-email:hover { border-color: var(--green); opacity: 1; }

.ce-arrow {
  display: inline-block;
  transition: transform 0.2s var(--ease-out);
}
.contact-email:hover .ce-arrow { transform: translateX(4px); }

.topics { display: flex; flex-direction: column; }
.topics-label {
  font-family: var(--mono); font-size: 0.6rem;
  color: var(--text3); letter-spacing: 0.1em; margin-bottom: 0.55rem;
}
.topic-item {
  font-family: var(--sans); font-size: 0.78rem; font-weight: 500;
  color: var(--text2); padding: 0.3rem 0;
  border-bottom: 1px solid var(--border);
  transition: color 0.2s, padding-left 0.2s;
}
.topic-item:last-child { border-bottom: none; }
.topic-item:hover { color: var(--green); padding-left: 0.4rem; }

/* Form */
.contact-form { display: flex; flex-direction: column; gap: 1rem; }

.form-group { display: flex; flex-direction: column; gap: 0.32rem; }

.form-group label {
  font-family: var(--mono); font-size: 0.6rem;
  color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase;
}

.form-group input, .form-group textarea {
  font-family: var(--sans); font-size: 0.85rem;
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text); padding: 0.72rem 1rem;
  border-radius: var(--radius); outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: none; width: 100%;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--border2);
  box-shadow: 0 0 0 3px rgba(159,191,107,0.06);
}

.form-group textarea { height: 108px; }

.form-submit {
  font-family: var(--sans); font-size: 0.85rem; font-weight: 600;
  background: var(--green); color: #0b0c09;
  border: none; padding: 0.72rem 1.5rem;
  cursor: pointer; border-radius: var(--radius-sm);
  transition: all 0.2s; align-self: flex-start;
}
.form-submit:hover:not(:disabled) {
  background: var(--green-bright);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(159,191,107,0.25);
}
.form-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.form-submit.sent { background: var(--green-dim); }

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fadeLeft {
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: none; }
}
@keyframes pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.45; transform: scale(0.65); }
}
@keyframes scrollPulse {
  0%,100% { opacity: 0.35; }
  50%      { opacity: 0.9; }
}

/* ── Mobile ── */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; gap: 3rem; }
  .hero-right { order: -1; }
  .stat-grid  { grid-template-columns: repeat(4, 1fr); gap: 0.6rem; }
  .stat-num   { font-size: 1.5rem; }
  .scroll-hint { display: none; }
}

@media (max-width: 768px) {
  #hero { padding: 6rem 1.4rem 4rem; }
  .hero-name { font-size: clamp(2.8rem, 12vw, 4rem); }
  .stat-grid  { grid-template-columns: 1fr 1fr; }
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .skills-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero-ctas { flex-direction: column; }
  .hero-ctas a { justify-content: center; }
  .hero-social { gap: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
