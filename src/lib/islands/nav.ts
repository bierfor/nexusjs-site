export default function initNav() {
  // Mobile drawer
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('nav-backdrop');

  function openNav() {
    sidebar?.classList.add('is-open');
    backdrop?.classList.add('is-visible');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    sidebar?.classList.contains('is-open') ? closeNav() : openNav();
  });
  backdrop?.addEventListener('click', closeNav);
  document.querySelectorAll('#sidebar-nav a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeNav();
    });
  });

  // Nav filter (improved for current markup)
  const filter = document.getElementById('nav-filter') as HTMLInputElement | null;
  const nav = document.getElementById('sidebar-nav');
  const clearBtn = document.getElementById('nav-filter-clear') as HTMLButtonElement | null;

  function applyFilter(termRaw: string) {
    const term = termRaw.trim().toLowerCase();
    const links = Array.from(nav!.querySelectorAll<HTMLElement>('.nav-link'));
    const sections = Array.from(nav!.querySelectorAll<HTMLElement>('.nav-section'));

    if (!term) {
      links.forEach((a) => a.style.display = '');
      sections.forEach((s) => s.style.display = '');
      if (clearBtn) clearBtn.classList.add('hidden');
      return;
    }

    if (clearBtn) clearBtn.classList.remove('hidden');

    // Hide non-matching links
    links.forEach((a) => {
      const match = (a.textContent || '').toLowerCase().includes(term);
      a.style.display = match ? '' : 'none';
    });

    // Hide sections that have no visible links after them
    sections.forEach((section) => {
      let el: HTMLElement | null = section.nextElementSibling as HTMLElement | null;
      let hasVisible = false;
      while (el && !el.classList.contains('nav-section')) {
        if (el.classList.contains('nav-link') && el.style.display !== 'none') {
          hasVisible = true;
        }
        el = el.nextElementSibling as HTMLElement | null;
      }
      section.style.display = hasVisible ? '' : 'none';
    });
  }

  if (filter && nav) {
    filter.addEventListener('input', () => applyFilter(filter.value));

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        filter.value = '';
        applyFilter('');
        filter.focus();
      });
    }

    // Initial state
    if (clearBtn) clearBtn.classList.add('hidden');
  }

  // Enhanced Escape handling (after filter is defined)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (filter && document.activeElement === filter && filter.value) {
        filter.value = '';
        applyFilter('');
        return;
      }
      closeNav();
    }
  });

  // Active link based on current path + highlight preceding section header
  const path = location.pathname;
  const links = document.querySelectorAll<HTMLElement>('.nav-link');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && path.startsWith(href.split('?')[0])) {
      link.classList.add('active');

      // Walk backwards to find the nearest section header and mark it
      let prev = link.previousElementSibling as HTMLElement | null;
      while (prev) {
        if (prev.classList.contains('nav-section')) {
          prev.classList.add('has-active');
          break;
        }
        if (prev.classList.contains('nav-link')) break;
        prev = prev.previousElementSibling as HTMLElement | null;
      }
    } else {
      link.classList.remove('active');
    }
  });
}
