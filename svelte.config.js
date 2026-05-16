import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (path.includes('favicon') || path.includes('resume') || path.includes('.pdf')) return;
        throw new Error(message);
      },
    },
  },
};

export default config;
