import { schoolNews } from '@/lib/news';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

export function NewsFeed() {
  return <section className="section news-section" id="news" aria-labelledby="news-title">
    <div className="section-heading">
      <h2 id="news-title">НОВОСТИ ШКОЛЫ</h2>
      <p>Тренировки, соревнования и жизнь школы.</p>
    </div>
    <div className="news-feed">
      {schoolNews.map(item => <article className="news-item" key={item.id} aria-labelledby={`news-${item.id}`}>
        <img className="news-image" src={`/basketspb/images/news/${item.id}.webp`} alt={item.imageAlt} width={item.width} height={item.height} loading="lazy" decoding="async"/>
        <div className="news-copy">
          <time dateTime={item.date}>{dateFormat.format(new Date(`${item.date}T12:00:00Z`))}</time>
          <h3 id={`news-${item.id}`}>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      </article>)}
    </div>
  </section>;
}
