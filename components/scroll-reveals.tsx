'use client';

import { useEffect } from 'react';

// Keep navigation, schedules, prices and forms immediately available.
const targets = [
  '.section-heading',
  '.about-heading',
  '.program-card',
  '.coaches > article',
  '.team-cards > article',
  '.camp-activities > article',
  '.camp-album',
  '.camp-videos > h3',
  '.camp-video-grid > figure',
  '.trial-section > div',
].map(selector => `main ${selector}`).join(',');

export function ScrollReveals() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>(targets));
    const seen = new WeakSet<HTMLElement>();
    const siblingOrder = new Map<Element, number>();

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });

    function reveal(element: HTMLElement) {
      element.dataset.reveal = 'visible';
      seen.add(element);
      observer.unobserve(element);
    }

    function reset() {
      observer.disconnect();
      for (const element of elements) {
        delete element.dataset.reveal;
        element.style.removeProperty('--reveal-delay');
      }
    }

    function prepare() {
      reset();
      if (motion.matches) return;
      siblingOrder.clear();

      for (const element of elements) {
        // Never hide the initial viewport or a section opened by a direct link.
        if (seen.has(element) || element.getBoundingClientRect().top < window.innerHeight) {
          seen.add(element);
          continue;
        }
        const parent = element.parentElement!;
        const order = siblingOrder.get(parent) ?? 0;
        siblingOrder.set(parent, order + 1);
        element.style.setProperty('--reveal-delay', `${Math.min(order, 3) * 55}ms`);
        element.dataset.reveal = 'pending';
        observer.observe(element);
      }
    }

    function onFocus(event: FocusEvent) {
      const element = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-reveal="pending"]')
        : null;
      if (element) {
        element.style.setProperty('--reveal-delay', '0ms');
        reveal(element);
      }
    }

    prepare();
    motion.addEventListener('change', prepare);
    document.addEventListener('focusin', onFocus);
    return () => {
      reset();
      motion.removeEventListener('change', prepare);
      document.removeEventListener('focusin', onFocus);
    };
  }, []);

  return null;
}
