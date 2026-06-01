export interface NavItem {
  slug: string;
  labelKey: string;
  section: string;
  emoji: string;
}

export interface NavSection {
  key: string;
  labelKey: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    key: 'gettingStarted',
    labelKey: 'nav.gettingStarted',
    items: [
      { slug: 'install', labelKey: 'install.title', section: 'gettingStarted', emoji: '⚡' },
      { slug: 'quickstart', labelKey: 'qs.title', section: 'gettingStarted', emoji: '🚀' },
      { slug: 'project-structure', labelKey: 'struct.title', section: 'gettingStarted', emoji: '📁' },
    ],
  },
  {
    key: 'core',
    labelKey: 'nav.core',
    items: [
      { slug: 'nx-format', labelKey: 'nx.title', section: 'core', emoji: '📄' },
      { slug: 'routing', labelKey: 'routing.title', section: 'core', emoji: '🗺️' },
      { slug: 'islands', labelKey: 'islands.title', section: 'core', emoji: '🏝️' },
      { slug: 'runes', labelKey: 'runes.title', section: 'core', emoji: '⚡' },
    ],
  },
  {
    key: 'data',
    labelKey: 'nav.data',
    items: [
      { slug: 'server-actions', labelKey: 'actions.title', section: 'data', emoji: '⚙️' },
      { slug: 'cache', labelKey: 'cache.title', section: 'data', emoji: '💾' },
      { slug: 'database', labelKey: 'db.title', section: 'data', emoji: '🗄️' },
      { slug: 'streaming', labelKey: 'streaming.title', section: 'data', emoji: '🌊' },
    ],
  },
  {
    key: 'advanced',
    labelKey: 'nav.advanced',
    items: [
      { slug: 'store', labelKey: 'store.title', section: 'advanced', emoji: '🌐' },
      { slug: 'navigation', labelKey: 'nav.title', section: 'advanced', emoji: '↔️' },
      { slug: 'middleware', labelKey: 'mw.title', section: 'advanced', emoji: '🔒' },
      { slug: 'seo', labelKey: 'seo.title', section: 'advanced', emoji: '🔍' },
      { slug: 'assets', labelKey: 'assets.title', section: 'advanced', emoji: '🖼️' },
      { slug: 'css', labelKey: 'css.title', section: 'advanced', emoji: '🎨' },
    ],
  },
  {
    key: 'tooling',
    labelKey: 'nav.tooling',
    items: [
      { slug: 'cli', labelKey: 'cli.title', section: 'tooling', emoji: '🛠️' },
      { slug: 'studio', labelKey: 'studio.title', section: 'tooling', emoji: '🎛️' },
      { slug: 'testing', labelKey: 'testing.title', section: 'tooling', emoji: '🧪' },
      { slug: 'deployment', labelKey: 'deploy.title', section: 'tooling', emoji: '🚀' },
    ],
  },
  {
    key: 'security',
    labelKey: 'nav.security',
    items: [
      { slug: 'security', labelKey: 'security.title', section: 'security', emoji: '🛡️' },
      { slug: 'audit', labelKey: 'audit.title', section: 'security', emoji: '🔍' },
    ],
  },
  {
    key: 'reference',
    labelKey: 'nav.reference',
    items: [
      { slug: 'comparison', labelKey: 'cmp.title', section: 'reference', emoji: '⚖️' },
      { slug: 'packages', labelKey: 'pkg.title', section: 'reference', emoji: '📦' },
    ],
  },
];

export function findDocBySlug(slug: string): NavItem | undefined {
  for (const section of NAV_SECTIONS) {
    const item = section.items.find((i) => i.slug === slug);
    if (item) return item;
  }
  return undefined;
}

export function getAllSlugs(): string[] {
  return NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.slug));
}
