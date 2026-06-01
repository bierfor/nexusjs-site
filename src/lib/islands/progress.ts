export default function initProgress() {
  const bar = document.getElementById('read-progress-bar');
  const toTop = document.getElementById('to-top');

  function onScroll() {
    const doc = document.documentElement;
    const st = window.scrollY || doc.scrollTop;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, st / max) : 0;
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (toTop) toTop.classList.toggle('is-visible', st > 420);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
