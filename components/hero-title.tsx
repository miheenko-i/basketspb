import type { CSSProperties } from 'react';

export function HeroTitle({ id, lines, subtitle }: {
  id: string;
  lines: string[];
  subtitle?: string;
}) {
  return <h1 id={id} className="hero-title" aria-label={[...lines, subtitle].filter(Boolean).join(' ')}>
    {lines.map(line => {
      let letterIndex = 0;
      return <span className="hero-title-line" aria-hidden="true" key={line}>
        {line.split(/(\s+)/).map((word, wordIndex) => {
          if (/^\s+$/.test(word)) { letterIndex += word.length; return word; }
          return <span className="hero-title-word" key={wordIndex}>
            {Array.from(word).map((character, index) => <span
              className="hero-title-character"
              style={{ '--letter-index': letterIndex++ } as CSSProperties}
              key={index}
            >{character}</span>)}
          </span>;
        })}{' '}
      </span>;
    })}
    {subtitle && <span className="hero-audience" aria-hidden="true">{subtitle}</span>}
  </h1>;
}
