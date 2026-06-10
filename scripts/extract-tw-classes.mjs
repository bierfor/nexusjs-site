#!/usr/bin/env node
/**
 * Extract Tailwind classes from .nx files so Tailwind v4 can scan them.
 * Tailwind v4 doesn't recognize .nx as a valid content extension, so we
 * generate an HTML file with all classes found in the project.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const srcDir = join(process.cwd(), 'src');
const outDir = join(process.cwd(), 'src', '.generated');
const outFile = join(outDir, 'tailwind-classes.html');

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const st = statSync(path);
    if (st.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

const classes = new Set();
for (const path of walk(srcDir)) {
  if (extname(path) !== '.nx') continue;
  const source = readFileSync(path, 'utf-8');
  // Match class="..." and class='...'
  for (const match of source.matchAll(/class\s*=\s*["']([^"']+)["']/g)) {
    for (const cls of match[1].trim().split(/\s+/)) {
      if (cls) classes.add(cls);
    }
  }
  // Also match class={... ? '...' : '...'} rough extraction
  for (const match of source.matchAll(/['"]([^'"]*[\w\-\[\]:/][^'"]*)['"]/g)) {
    const str = match[1];
    if (str.includes(' ') && /\b(bg-|text-|hidden|md:|flex|grid|border|rounded|p-|m-|w-|h-)/.test(str)) {
      for (const cls of str.split(/\s+/)) {
        if (cls) classes.add(cls);
      }
    }
  }
}

mkdirSync(outDir, { recursive: true });
const html = `<div class="${Array.from(classes).sort().join(' ')}"></div>\n`;
writeFileSync(outFile, html);
console.log(`[extract-tw-classes] ${classes.size} classes → ${outFile}`);
