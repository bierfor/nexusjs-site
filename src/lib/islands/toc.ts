export default function initToc() {
  const toc = document.querySelector('.doc-toc');
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('.toc-link')) as HTMLAnchorElement[];
  const headings = links.map(link => {
    const id = link.getAttribute('href')?.slice(1);
    return id ? document.getElementById(id) : null;
  }).filter(Boolean) as HTMLElement[];

  if (headings.length === 0) return;

  function onScroll() {
    const scrollY = window.scrollY + 100; // offset for header
    let activeId = headings[0]?.id;

    for (const h of headings) {
      if (h.offsetTop <= scrollY) {
        activeId = h.id;
      } else {
        break;
      }
    }

    links.forEach(link => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
