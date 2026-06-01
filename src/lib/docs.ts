import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface DocEntry {
  slug: string;
  titleKey: string;
  section: string;
  body: string;
}

const DOCS_METADATA: Array<Omit<DocEntry, 'body'>> = [
  { slug: 'install', titleKey: 'install.title', section: 'gettingStarted' },
  { slug: 'quickstart', titleKey: 'qs.title', section: 'gettingStarted' },
  { slug: 'project-structure', titleKey: 'struct.title', section: 'gettingStarted' },
  { slug: 'nx-format', titleKey: 'nx.title', section: 'core' },
  { slug: 'routing', titleKey: 'routing.title', section: 'core' },
  { slug: 'islands', titleKey: 'islands.title', section: 'core' },
  { slug: 'runes', titleKey: 'runes.title', section: 'core' },
  { slug: 'server-actions', titleKey: 'actions.title', section: 'data' },
  { slug: 'cache', titleKey: 'cache.title', section: 'data' },
  { slug: 'database', titleKey: 'db.title', section: 'data' },
  { slug: 'streaming', titleKey: 'streaming.title', section: 'data' },
  { slug: 'store', titleKey: 'store.title', section: 'advanced' },
  { slug: 'navigation', titleKey: 'nav.title', section: 'advanced' },
  { slug: 'middleware', titleKey: 'mw.title', section: 'advanced' },
  { slug: 'seo', titleKey: 'seo.title', section: 'advanced' },
  { slug: 'assets', titleKey: 'assets.title', section: 'advanced' },
  { slug: 'css', titleKey: 'css.title', section: 'advanced' },
  { slug: 'cli', titleKey: 'cli.title', section: 'tooling' },
  { slug: 'studio', titleKey: 'studio.title', section: 'tooling' },
  { slug: 'testing', titleKey: 'testing.title', section: 'tooling' },
  { slug: 'deployment', titleKey: 'deploy.title', section: 'tooling' },
  { slug: 'security', titleKey: 'security.title', section: 'security' },
  { slug: 'audit', titleKey: 'audit.title', section: 'security' },
  { slug: 'comparison', titleKey: 'cmp.title', section: 'reference' },
  { slug: 'packages', titleKey: 'pkg.title', section: 'reference' },
];

const CONTENT_DIR = join(process.cwd(), 'src/content/docs');

function loadDocBody(slug: string): string {
  try {
    return readFileSync(join(CONTENT_DIR, `${slug}.md`), 'utf-8');
  } catch {
    return `# ${slug}\n\nDocumentation content for **${slug}** is not available yet.`;
  }
}

export const DOCS: DocEntry[] = DOCS_METADATA.map(meta => ({
  ...meta,
  body: loadDocBody(meta.slug),
}));

export function getDocBySlug(slug: string): DocEntry | undefined {
  return DOCS.find(d => d.slug === slug);
}
