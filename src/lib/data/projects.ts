export interface Project {
  slug: string;
  title: string;
  image?: string;
  tagline: string;
  overview: string;
  challenge: string;
  learned: string[];
  category: "Backend" | "AI/ML" | "Full-stack" | "Frontend" | "Infra" | "Other";
  stack: string[];
  highlights: string[];
  screenshots: string[];
  liveUrl: string | null;
  githubUrl: string;
  extraLinks?: { label: string; url: string }[];
  year: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "pagelens",
    title: "PageLens",
    image: "/projects/pagelens/1.png",
    tagline:
      "Chrome extension that summarises any webpage using Gemini AI — with in-page keyword highlighting and a FastAPI backend.",
    overview: `PageLens is a Chrome Extension (Manifest V3) that extracts meaningful content from whatever page you're on, sends it to a FastAPI backend that calls the Gemini API, and returns a structured summary directly in the extension popup.

When you click the icon, you get a bullet-point summary, key insights, and an estimated reading time. You can also trigger in-page keyword highlighting — the extension marks the important terms directly on the page after the summary is generated. There's also a sidebar view, a settings page, and dark mode support.

The AI never runs in the extension itself. All API calls go through the FastAPI server, which means the Gemini API key is never exposed to the browser.`,
    challenge: `The biggest challenge was understanding how Chrome extensions actually work — specifically that the different parts of the system (popup, content script, background service worker, sidebar) cannot call each other directly. Everything has to go through Chrome's message passing API, and designing that communication layer cleanly took real thought.

State and caching were the other hard parts. Summaries are cached per URL using chrome.storage so you're not hitting the API every time you revisit a page. Getting that right — including cache invalidation — was non-trivial. On the UI side, making the sidebar behave correctly and ensuring keyword highlights were injected safely (without XSS risk) required careful sanitisation of all injected content.`,
    learned: [
      "How Chrome Manifest V3 works — service workers, message passing, content scripts, and why they can't talk directly",
      "Designing a clean communication layer between extension contexts using chrome.runtime.sendMessage",
      "Caching strategies with chrome.storage — per-URL summary caching to avoid redundant API calls",
      "Safe DOM injection for keyword highlighting — sanitising content before inserting it into arbitrary pages",
      "Building a FastAPI proxy so the Gemini API key never touches the browser",
    ],
    category: "Full-stack",
    stack: [
      "JavaScript",
      "Python",
      "FastAPI",
      "Gemini API",
      "Chrome Extensions MV3",
    ],
    highlights: [
      "Manifest V3 with background service worker, content script, popup, and sidebar",
      "FastAPI backend proxies all Gemini calls — no secrets in the browser",
      "Per-URL summary caching via chrome.storage",
      "In-page keyword highlighting with XSS-safe DOM injection",
      "Settings page, dark mode, and sidebar view",
    ],
    screenshots: [
      "/projects/pagelens/1.png",
      "/projects/pagelens/2.png",
      "/projects/pagelens/3.png",
    ],
    liveUrl: null,
    githubUrl: "https://github.com/Muizzyranking/pagelens",
    year: "2025",
    featured: true,
  },
  {
    slug: "insighta-labs",
    title: "Insighta Labs",
    image: "/projects/insighta-labs/1.png",
    tagline:
      "Analyst tool with a web frontend, CLI, and FastAPI backend — query demographic data in plain English.",
    overview: `Insighta Labs is a data analytics platform built in three parts: a web frontend, a command-line interface, and a FastAPI backend. An admin uploads a CSV of demographic records — name, gender, age, country, and probability scores — and analysts can then query that data using either the web UI or the CLI.

Queries can be written in natural language. "Young males from Nigeria" and "Nigeria young males" return the same result. The system normalises and caches queries so repeated or semantically equivalent queries don't hit the database again. The platform also includes rate limiting and handles CSV uploads of over 500,000 rows in under 40 seconds.`,
    challenge: `The natural language query normalisation was the most interesting engineering problem. Analysts phrase things differently — word order, synonyms, different ways of specifying age groups — and the system needs to treat equivalent queries as identical for caching purposes. Getting that normalisation right so the cache actually hit on semantically similar queries took real work.

CSV processing at scale was the other challenge. Getting 500k+ row uploads to complete in under 40 seconds required careful streaming, batching, and database insertion strategies. The CLI presented a separate problem: building it in Python, compiling it for macOS, Windows, and Arch Linux, setting up CI to do that automatically, and writing platform-specific install scripts for each.`,
    learned: [
      "How to build a Python CLI tool and distribute it — compiling for macOS, Windows, and Arch Linux via CI",
      "Writing platform-specific install scripts and automating releases with GitHub Actions",
      "Query normalisation for better cache hit rates — treating semantically equivalent natural language queries as identical",
      "High-throughput CSV processing — 500k+ rows in under 40 seconds using streaming and batched inserts",
      "Rate limiting strategies on a FastAPI backend",
    ],
    category: "Full-stack",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
    highlights: [
      "Three-part system: web frontend, CLI, and FastAPI backend",
      "Natural language query interface with normalisation for consistent caching",
      "CSV uploads: 500k+ rows processed in under 40 seconds",
      "CLI compiled and distributed for macOS, Windows, and Arch Linux via CI",
      "Rate limiting and per-query result caching",
    ],
    screenshots: [
      "/projects/insighta-labs/1.png",
      "/projects/insighta-labs/2.png",
      "/projects/insighta-labs/3.png",
      "/projects/insighta-labs/4.png",
      "/projects/insighta-labs/5.png",
      "/projects/insighta-labs/6.png",
    ],
    liveUrl: "https://insighta-web-gamma.vercel.app/",
    githubUrl: "https://github.com/Muizzyranking/insighta-web",
    extraLinks: [
      {
        label: "Backend",
        url: "https://github.com/Muizzyranking/insighta-backend",
      },
      { label: "CLI", url: "https://github.com/Muizzyranking/insighta-cli" },
    ],
    year: "2025",
    featured: true,
  },
  {
    slug: "hushedbox",
    title: "HushedBox",
    tagline:
      "End-to-end encrypted real-time chat — the server stores only encrypted blobs it cannot read.",
    overview: `HushedBox is a secure, real-time messaging application where every message is encrypted on the sender's device using the recipient's public key before it is ever transmitted. The backend stores and forwards only encrypted blobs — it has no ability to read your messages.

Registration generates an RSA-OAEP 2048-bit keypair in the browser. The private key is wrapped with an AES-GCM-256 key derived from the user's password (PBKDF2, 600,000 iterations) and stored server-side — but the server cannot use it without the user's password. The private key lives in IndexedDB as a CryptoKey object and never touches the network.

Each message uses a one-time AES-GCM-256 key. The plaintext is encrypted with that key, the key itself is encrypted with the recipient's RSA public key, and a copy is encrypted with the sender's own key so they can read their sent messages. The server stores the blob and forwards it over WebSocket.`,
    challenge: `Understanding the WebSockets protocol was the first thing to figure out — how connections are maintained, how messages are pushed, and how to handle reconnection gracefully. The cryptography was the deeper challenge.

The original implementation used AES-KW for key wrapping during registration and login, which requires an 8-byte aligned key. That constraint caused subtle bugs that were hard to trace. After working through it, the solution was to switch to AES-GCM for key wrapping (registration and login flow) while keeping AES-GCM for actual message encryption — consistent across the whole system, fewer edge cases.`,
    learned: [
      "How WebSockets work — persistent connections, message pushing, and reconnection handling",
      "The Web Cryptography API — RSA-OAEP, AES-GCM, PBKDF2, and how to use them correctly in the browser",
      "Why AES-KW's 8-byte key alignment requirement caused bugs, and how switching to AES-GCM for key wrapping fixed them",
      "IndexedDB for storing CryptoKey objects — keeping the private key off the network entirely",
      "Designing an encryption scheme where the server is architecturally incapable of reading messages",
    ],
    category: "Full-stack",
    stack: [
      "JavaScript",
      "WebSockets",
      "Web Crypto API",
      "RSA-OAEP",
      "AES-GCM",
      "Python",
      "FastAPI",
    ],
    highlights: [
      "Full E2EE — server stores only encrypted blobs, cannot read any message",
      "RSA-OAEP 2048-bit keypair generated in-browser; private key never touches the network",
      "AES-GCM-256 per-message encryption with one-time keys",
      "Private key wrapped with PBKDF2-derived key (600k iterations) and stored server-side safely",
      "Real-time delivery via WebSocket with IndexedDB key storage",
    ],
    screenshots: [],
    liveUrl: "https://whisperbox.koyeb.app",
    githubUrl: "https://github.com/Muizzyranking/hushedbox",
    year: "2025",
    featured: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
