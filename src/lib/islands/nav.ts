export default function initNav() {
  // Mobile drawer
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('nav-backdrop');

  function openNav() {
    sidebar?.classList.add('is-open');
    backdrop?.classList.add('is-visible');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    sidebar?.classList.contains('is-open') ? closeNav() : openNav();
  });
  backdrop?.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
  document.querySelectorAll('#sidebar-nav a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeNav();
    });
  });

  // Nav filter
  const filter = document.getElementById('nav-filter') as HTMLInputElement | null;
  const nav = document.getElementById('sidebar-nav');
  if (filter && nav) {
    filter.addEventListener('input', () => {
      const term = filter.value.trim().toLowerCase();
      const links = nav.querySelectorAll<HTMLElement>('.nav-link');
      const sections = nav.querySelectorAll<HTMLElement>('.nav-section');
      if (!term) {
        links.forEach((a) => (a.style.display = ''));
        sections.forEach((s) => (s.style.display = ''));
        return;
      }
      links.forEach((a) => {
        a.style.display = a.textContent?.toLowerCase().includes(term) ? '' : 'none';
      });
      sections.forEach((section) => {
        let el = section.nextElementSibling as HTMLElement | null;
        let any = false;
        while (el && !el.classList.contains('nav-section')) {
          if (el.classList.contains('nav-link') && el.style.display !== 'none') any = true;
          el = el.nextElementSibling as HTMLElement | null;
        }
        section.style.display = any ? '' : 'none';
      });
    });
  }

  // Active link based on current path
  const path = location.pathname;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && path.startsWith(href.split('?')[0])) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
