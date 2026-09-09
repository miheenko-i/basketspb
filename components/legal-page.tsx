import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Brand, SiteFooter } from '@/components/site-shell';

export type LegalSection = { id: string; title: string; content: ReactNode };

export function LegalPage({ title, intro, sections }: { title: string; intro: ReactNode; sections: LegalSection[] }) {
  return <div id="top" className="legal-page">
    <header className="site-header legal-header"><Brand camp/><a className="legal-home-link" href="/basketspb/"><ArrowLeft size={17}/>На главную</a></header>
    <main id="main" className="section legal-main">
      <div className="legal-heading"><h1>{title}</h1><p className="legal-version">Редакция от 10 сентября 2026 года</p><div className="legal-intro">{intro}</div></div>
      <div className="legal-layout">
        <nav className="legal-toc" aria-label="Содержание документа"><ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a></li>)}</ol></nav>
        <article className="legal-copy">{sections.map((section, index) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}><h2 id={`${section.id}-title`}>{index + 1}. {section.title}</h2>{section.content}</section>)}</article>
      </div>
    </main>
    <SiteFooter camp/>
  </div>;
}
