import { defineCollection, renderMarkdown, renderMarkdownAsync, parseFrontmatter } from '@nexus_js/content';
import type { CollectionItem } from '@nexus_js/content';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface DocEntry {
  slug: string;
  titleKey: string;
  section: string;
  body: string;
  headings?: Array<{ level: number; text: string; id: string }>;
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
  { slug: 'css', titleKey: 'css.title', section: 'tooling' },
  { slug: 'cli', titleKey: 'cli.title', section: 'tooling' },
  { slug: 'studio', titleKey: 'studio.title', section: 'tooling' },
  { slug: 'testing', titleKey: 'testing.title', section: 'tooling' },
  { slug: 'deployment', titleKey: 'deploy.title', section: 'tooling' },
  { slug: 'security', titleKey: 'security.title', section: 'security' },
  { slug: 'audit', titleKey: 'audit.title', section: 'security' },
  { slug: 'comparison', titleKey: 'cmp.title', section: 'reference' },
  { slug: 'packages', titleKey: 'pkg.title', section: 'reference' },
];

const docsCollection = defineCollection({
  name: 'docs',
  dir: 'src/content/docs',
  defaultLocale: 'en',
  locales: ['en', 'es', 'pt'],
});

function resolveDocPath(slug: string, locale?: string): string | undefined {
  // Basic slug sanitization to prevent path traversal (only allow safe chars for filenames)
  if (!/^[a-z0-9_-]+$/i.test(slug)) return undefined;

  const baseDir = join(process.cwd(), 'src/content/docs');
  const candidates: string[] = [];
  if (locale && locale !== 'en') {
    candidates.push(join(baseDir, `${slug}.${locale}.md`));
  }
  candidates.push(join(baseDir, `${slug}.md`));

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/** Load a single doc by slug, with i18n locale fallback (sync, no syntax highlighting). */
export function getDocBySlug(slug: string, locale?: string): DocEntry | undefined {
  const meta = DOCS_METADATA.find(d => d.slug === slug);
  if (!meta) return undefined;

  const item = docsCollection.get(slug, { locale, contentDir: 'src/content/docs' });

  return {
    ...meta,
    body: item.html,
    headings: item.headings || [],
  };
}

/** Load a single doc by slug, with i18n locale fallback and Shiki syntax highlighting (async, using @nexus_js/content in modo correcto). */
export async function getDocBySlugAsync(slug: string, locale?: string): Promise<DocEntry | undefined> {
  const meta = DOCS_METADATA.find(d => d.slug === slug);
  if (!meta) return undefined;

  const filePath = resolveDocPath(slug, locale);
  if (!filePath) return undefined;

  const raw = readFileSync(filePath, 'utf-8');
  const { body } = parseFrontmatter(raw);
  // Use the package's renderMarkdownAsync with highlight: true — this is the "modo correcto"
  // (it handles data-lang, highlightCode internally with Shiki, and proper escaping).
  const { html, headings } = await renderMarkdownAsync(body, { extractHeadings: true, highlight: true });

  return {
    ...meta,
    body: html,
    headings: headings || [],
  };
}

/** List all docs (for index page or sitemap). Uses collection auto-discovery. */
export function listDocs(locale?: string): CollectionItem[] {
  return docsCollection.list({ locale, contentDir: 'src/content/docs' });
}

/** Static list of all docs with default locale (used by nav). */
export const DOCS: DocEntry[] = DOCS_METADATA.map(meta => {
  const item = docsCollection.get(meta.slug, { contentDir: 'src/content/docs' });
  return { ...meta, body: item.html, headings: item.headings || [] };
});
