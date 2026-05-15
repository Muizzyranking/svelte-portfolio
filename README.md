# muiz.dev — Portfolio

Personal portfolio built with SvelteKit. Terminal-inspired aesthetic, phosphor-green accent (`#9fbf6b`), Syne + JetBrains Mono typography.

## Quick start

```bash
git clone https://github.com/placeholder/portfolio
cd portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Adding a project

All project data lives in one file: **`src/lib/data/projects.ts`**

Add an object to the `projects` array:

```ts
{
  slug: 'my-project',           // URL: /projects/my-project
  title: 'My Project',
  tagline: 'One-line summary shown on the card',
  description: `Full description shown on the detail page.

  Write multiple paragraphs — each blank-line-separated paragraph renders as its own <p>.`,
  category: 'Backend',          // Backend | AI/ML | Full-stack | Infra | Other
  stack: ['Python', 'FastAPI', 'PostgreSQL'],
  highlights: [
    'Key technical decision or outcome',
    'What made this interesting or hard',
  ],
  liveUrl: 'https://yourproject.dev',
  githubUrl: 'https://github.com/you/project',
  year: '2025',
  featured: true,               // true = shows on homepage
}
```

That's it. The card, the listing page, and the detail page all update automatically.

---

## Adding a project screenshot

1. Put the image in `/static/projects/my-project.webp` (webp preferred)
2. Add `image: '/projects/my-project.webp'` to the project object
3. The detail page will render it instead of the placeholder

---

## Updating your resume

Drop your resume PDF into `/static/resume.pdf`. The "↓ Resume" button in the hero links there.

---

## Updating social links

In `src/routes/+page.svelte`, find the `.hero-social` block and replace the three `href` placeholders with your actual URLs.

---

## Architecture

```
src/
├── app.css                    ← global design tokens & resets
├── lib/
│   ├── components/
│   │   ├── Nav.svelte         ← fixed nav with scroll-aware border
│   │   ├── Terminal.svelte    ← interactive terminal overlay (Ctrl+K)
│   │   └── ProjectCard.svelte ← reusable card used on home + /projects
│   └── data/
│       └── projects.ts        ← single source of truth for all projects
└── routes/
    ├── +layout.svelte         ← nav, footer, terminal, scroll-reveal observer
    ├── +page.svelte           ← homepage (hero, about, projects, skills, contact)
    └── projects/
        ├── +page.svelte       ← /projects — filterable listing
        └── [slug]/
            ├── +page.ts       ← data loader (404 if slug not found)
            └── +page.svelte   ← project detail page
```

### Key decisions

**Single data file.** All project content lives in `projects.ts`, typed with a `Project` interface. No CMS, no markdown files, no external fetch. Fast, type-safe, zero friction to update.

**Terminal as creative feature.** The `Terminal` component is self-contained with its own command registry. Commands are plain functions returning arrays of `Line` objects. Add a command by adding a key to the `COMMANDS` object.

**Scroll reveal via `IntersectionObserver`.** One shared observer in `+layout.svelte` watches all `.reveal` elements. Components just get the class — they don't need to know about animation.

**No animation library.** All animations are CSS keyframes and transitions. No GSAP, no Motion One. Small bundle, zero dependency risk.

---

## Performance

- Google Fonts loaded with `display=swap` and `preconnect`
- Images: use `.webp` for project screenshots, keep under 200kb
- No heavy JS libraries — Svelte compiles components away
- Vercel adapter handles edge caching automatically

---

## Accessibility

- Terminal is `role="dialog"` with `aria-modal` and Esc to close
- Skill bars use `role="meter"` with `aria-valuenow/min/max`
- Focus states via `:focus-visible` in `app.css`
- Add `alt` text when you add real project images

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Or push to GitHub and connect the repo in vercel.com — it auto-detects SvelteKit. The `@sveltejs/adapter-vercel` is already configured.

---

## Local commands

```bash
npm run dev        # dev server at localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
npm run check      # TypeScript + Svelte type checking
```

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| Static project data in `.ts` | Fast & type-safe, but adding a project requires a redeploy |
| No animation library | Smaller bundle; GSAP would enable more complex timelines if needed |
| Contact form is frontend-only | Wire to Formspree or a SvelteKit form action to send real emails |

---

## Wiring up the contact form

Replace `handleForm` in `+page.svelte`:

```ts
async function handleForm(e: SubmitEvent) {
  e.preventDefault();
  formState = 'sending';
  const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify({ name: formName, email: formEmail, message: formMessage }),
  });
  formState = res.ok ? 'sent' : 'idle';
}
```
