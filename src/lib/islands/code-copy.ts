export default function initCodeCopy() {
  // Add copy buttons to all pre > code blocks (docs, releases, examples)
  document.querySelectorAll('pre code').forEach((codeEl) => {
    const pre = codeEl.parentElement as HTMLElement | null;
    if (!pre || pre.querySelector('.copy-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'copy-btn absolute top-2 right-2 z-10 text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg2)] border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = codeEl.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = 'copied!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
        }, 1800);
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'copied!';
        setTimeout(() => { btn.textContent = 'copy'; }, 1800);
      }
    });

    // ensure pre is positioned for absolute btn
    if (getComputedStyle(pre).position === 'static') {
      pre.style.position = 'relative';
    }
    pre.appendChild(btn);
  });
}
