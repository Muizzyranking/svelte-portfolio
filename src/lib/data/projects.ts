export interface Project {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  challenge: string;
  learned: string[];
  category: 'Backend' | 'AI/ML' | 'Full-stack' | 'Frontend' | 'Infra' | 'Other';
  stack: string[];
  highlights: string[];
  screenshots: string[]; // paths relative to /static/
  liveUrl: string;
  githubUrl: string;
  year: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'project-alpha',
    title: 'Project Alpha',
    tagline: 'A backend system — replace with your real project',
    overview: `Replace this overview paragraph with what the project actually does and who it's for. Describe the core problem being solved in plain terms. What did users experience? What was the product?

Write 2–3 sentences here. Keep it accessible — not too technical yet.`,
    challenge: `This is where you describe the hard part. What was the constraint? What made this non-trivial? Was it scale, real-time requirements, a difficult data model, an infrastructure problem?

Be specific. "Had to handle 10k concurrent connections" is better than "it was a complex project."`,
    learned: [
      'Replace this with a real thing you learned — technical or otherwise',
      'Something about the architecture that surprised you',
      'A tradeoff you made and whether you would make it again',
      'What you would do differently with hindsight',
    ],
    category: 'Backend',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Celery'],
    highlights: [
      'Replace with a real technical highlight',
      'Something about performance or scale',
      'An interesting architecture decision',
      'A constraint that shaped everything',
    ],
    screenshots: [],
    liveUrl: 'https://placeholder.dev',
    githubUrl: 'https://github.com/placeholder',
    year: '2025',
    featured: true,
  },
  {
    slug: 'project-beta',
    title: 'Project Beta',
    tagline: 'Full-stack — replace with your real frontend project',
    overview: `Describe your frontend or full-stack project here. What does it look like? What does the user experience? This is a good place to mention if it's a web app, dashboard, or consumer product.

Mention any design thinking, UX considerations, or state management decisions you made.`,
    challenge: `What was hard about building this UI? Was it state complexity, performance, animation, responsiveness, or a tricky component architecture?

This is where you show you think beyond just making things look pretty — you understand the engineering behind the interface.`,
    learned: [
      'Something about component architecture or state management',
      'A performance optimisation you made on the frontend',
      'What you learned about UX from real user feedback',
      'A browser API or web platform feature that surprised you',
    ],
    category: 'Full-stack',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'PostgreSQL', 'Prisma'],
    highlights: [
      'Server components vs client components decision',
      'How you handled loading and error states',
      'Accessibility considerations you built in',
      'Performance metrics you hit',
    ],
    screenshots: [],
    liveUrl: 'https://placeholder.dev',
    githubUrl: 'https://github.com/placeholder',
    year: '2025',
    featured: true,
  },
  {
    slug: 'project-gamma',
    title: 'Project Gamma',
    tagline: 'AI/ML — replace with your real AI project',
    overview: `Describe your AI or ML project here. What does it do for the user? What model or approach powers it? Keep it understandable to a non-ML person first, then get technical in the challenge section.`,
    challenge: `What was technically hard? Was it the retrieval pipeline, latency, prompt engineering, data quality, evaluation? Describe the architecture — RAG, fine-tuning, embeddings — and why you chose it.`,
    learned: [
      'Something unexpected about working with LLMs in production',
      'How you approached evaluation and quality measurement',
      'A cost or latency tradeoff you had to navigate',
      'What you would design differently knowing what you know now',
    ],
    category: 'AI/ML',
    stack: ['Python', 'LangChain', 'Anthropic', 'pgvector', 'FastAPI', 'Docker'],
    highlights: [
      'RAG architecture and retrieval strategy',
      'How you handled hallucination or quality issues',
      'Latency optimisation approach',
      'Evaluation methodology',
    ],
    screenshots: [],
    liveUrl: 'https://placeholder.dev',
    githubUrl: 'https://github.com/placeholder',
    year: '2024',
    featured: true,
  },
  {
    slug: 'project-delta',
    title: 'Project Delta',
    tagline: 'Frontend — replace with a React or Vue project',
    overview: `Put a React, Vue, or Svelte project here. Describe what it does visually and functionally. What was the product goal?`,
    challenge: `What frontend problem did you solve? Complex state? Real-time updates? A custom component library? Data-heavy tables? Describe the engineering, not just the aesthetics.`,
    learned: [
      'Something about the framework you chose',
      'A performance win you found',
      'What users taught you through feedback',
      'A browser compatibility problem and how you solved it',
    ],
    category: 'Frontend',
    stack: ['Vue', 'TypeScript', 'Pinia', 'Vite', 'TailwindCSS'],
    highlights: [
      'State architecture decision',
      'Component reusability approach',
      'Bundle size optimisation',
      'Testing strategy',
    ],
    screenshots: [],
    liveUrl: 'https://placeholder.dev',
    githubUrl: 'https://github.com/placeholder',
    year: '2024',
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export const featuredProjects = projects.filter(p => p.featured);
