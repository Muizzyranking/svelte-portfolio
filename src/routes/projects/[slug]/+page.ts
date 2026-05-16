import { getProject, projects } from '$lib/data/projects';
import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
  return projects.map(p => ({ slug: p.slug }));
};

export const load: PageLoad = ({ params }) => {
  const project = getProject(params.slug);
  if (!project) throw error(404, 'Project not found');
  return { project };
};
