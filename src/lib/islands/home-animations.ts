import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function initHomeAnimations() {
  // ── Hero entrance timeline ──
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Set initial states (hide elements)
  gsap.set('.hero-badge', { opacity: 0, y: -20, scale: 0.95 });
  gsap.set('.hero-title', { opacity: 0, y: 30 });
  gsap.set('.hero-subtitle', { opacity: 0, y: 20, filter: 'blur(4px)' });
  gsap.set('.hero-cta', { opacity: 0, y: 20, scale: 0.9 });
  gsap.set('.hero-stat', { opacity: 0, y: 15 });

  // Animate in sequence
  heroTl
    .to('.hero-badge', { opacity: 1, y: 0, scale: 1, duration: 0.6 }, 0.1)
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, 0.25)
    .to('.hero-subtitle', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }, 0.45)
    .to('.hero-cta', { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12 }, 0.6)
    .to('.hero-stat', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.8);

  // ── Animated counters for stats ──
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  statNumbers.forEach((el) => {
    const text = el.textContent || '';
    const numMatch = text.match(/[\d.]+/);
    if (!numMatch) return;

    const target = parseFloat(numMatch[0]);
    const isPercent = text.includes('%');
    const isVersion = text.startsWith('v');

    if (isVersion) return; // Skip version string

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      delay: 1.0,
      ease: 'power2.out',
      onUpdate() {
        const formatted = Number.isInteger(target)
          ? Math.round(obj.val).toString()
          : obj.val.toFixed(1);
        el.textContent = isPercent ? `${formatted}%` : `${formatted} KB`;
        if (!isPercent && target >= 10) {
          el.textContent = formatted; // for "25" just show number
        }
      },
    });
  });

  // ── ScrollTrigger: Why Nexus cards ──
  gsap.utils.toArray<HTMLElement>('.why-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power3.out',
    });
  });

  // ── ScrollTrigger: Enterprise cards ──
  gsap.utils.toArray<HTMLElement>('.ent-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      x: i % 2 === 0 ? -20 : 20,
      duration: 0.7,
      delay: (i % 2) * 0.15,
      ease: 'power3.out',
    });
  });

  // ── ScrollTrigger: CTA section ──
  gsap.from('.cta-section', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
  });

  // ── Emoji bounce on card hover ──
  document.querySelectorAll('.why-card, .ent-card').forEach((card) => {
    const emoji = card.querySelector('.card-emoji');
    if (!emoji) return;

    card.addEventListener('mouseenter', () => {
      gsap.to(emoji, {
        y: -6,
        scale: 1.15,
        rotation: 5,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(emoji, {
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  });

  // ── Button glow pulse on hover ──
  document.querySelectorAll('.btn-glow').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        boxShadow: '0 0 25px rgba(37, 99, 235, 0.3), 0 0 50px rgba(139, 92, 246, 0.15)',
        duration: 0.3,
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        boxShadow: '0 0 0 rgba(37, 99, 235, 0)',
        duration: 0.3,
      });
    });
  });

  // ── Parallax on hero background ──
  const heroBg = document.querySelector('.hero-gradient-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: 80,
      scale: 1.1,
      ease: 'none',
    });
  }

  // ── Section labels slide in ──
  gsap.utils.toArray<HTMLElement>('.section-label').forEach((label) => {
    gsap.from(label, {
      scrollTrigger: {
        trigger: label,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -20,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
}
