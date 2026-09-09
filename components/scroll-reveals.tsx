'use client';

import { useEffect } from 'react';

// Observe individual content blocks, rather than revealing a whole long section at once.
const targets = [
  '.facts-strip',
  '.section-heading',
  '.about-heading',
  '.program-card',
  '.program-footnote',
  '.growth-steps > li',
  '.growth-section > .button',
  '.venue-anchors',
  '.venue-section',
  '.price-card',
  '.price-terms',
  '.about-grid > div:first-child',
  '.coaches > article',
  '.team-cards > article',
  '.camp-activities > article',
  '.camp-shift-list > button',
  '.camp-date-note',
  '.camp-price-table tbody > tr',
  '.camp-album > h3',
  '.camp-album > p',
  '.camp-photo',
  '.camp-videos > h3',
  '.camp-video-grid > figure',
  '.camp-booking-intro',
  '.camp-booking-form',
  '.trial-section > div',
].map(selector => `main ${selector}`).concat('.site-footer .footer-top > div', '.site-footer .footer-bottom').join(',');

export function ScrollReveals() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>(targets));
    const seen = new WeakSet<HTMLElement>();
    const siblingOrder = new Map<Element, number>();

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= .15) reveal(entry.target as HTMLElement);
      }
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });

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
        const bounds = element.getBoundingClientRect();
        // Skip blocks above a restored scroll position, including direct anchor links.
        if (seen.has(element) || bounds.bottom <= 0) {
          seen.add(element);
          continue;
        }
        const parent = element.parentElement!;
        const order = siblingOrder.get(parent) ?? 0;
        siblingOrder.set(parent, order + 1);
        element.style.setProperty('--reveal-delay', `${Math.min(order, 3) * 65}ms`);
        // Content already in view also gets a one-time entrance animation.
        if (bounds.top < window.innerHeight * .84 && bounds.bottom > 0) {
          reveal(element);
          continue;
        }
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
        element.dataset.reveal = 'instant';
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
