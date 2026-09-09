'use client';

import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schoolNews } from '@/lib/news';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

export function NewsFeed() {
  const [expanded, setExpanded] = useState(false);
  const visibleNews = expanded ? schoolNews : schoolNews.slice(0, 3);

  useEffect(() => {
    if (!expanded) return;
    document.dispatchEvent(new Event('site:content-added'));
    // Keep keyboard focus in the newly revealed content when the button disappears.
    document.getElementById(`news-${schoolNews[3].id}`)?.focus({ preventScroll: true });
  }, [expanded]);

  return <section className="section news-section" id="news" aria-labelledby="news-title">
    <div className="section-heading">
      <h2 id="news-title">НОВОСТИ ШКОЛЫ</h2>
      <p>Тренировки, соревнования и жизнь школы.</p>
    </div>
    <div className="news-feed" id="school-news-feed">
      {visibleNews.map(item => <article className="news-item" key={item.id} aria-labelledby={`news-${item.id}`}>
        <img className="news-image" src={`/basketspb/images/news/${item.id}.webp`} alt={item.imageAlt} width={item.width} height={item.height} loading="lazy" decoding="async"/>
        <div className="news-copy">
          <h3 id={`news-${item.id}`} tabIndex={-1}>{item.title}</h3>
          <p>{item.text}</p>
        </div>
        <time className="news-date" dateTime={item.date}>{dateFormat.format(new Date(`${item.date}T12:00:00Z`))}</time>
      </article>)}
    </div>
    {!expanded && <div className="news-actions">
      <Button variant="outline" className="news-more" aria-controls="school-news-feed" onClick={() => setExpanded(true)}>
        Показать ещё <ArrowDown aria-hidden="true"/>
      </Button>
    </div>}
    <p className="sr-only" aria-live="polite">{expanded ? `Показаны все ${schoolNews.length} новостей.` : ''}</p>
  </section>;
}
