import NoteTemplates from '../components/NoteTemplates';
import type { Exhibition } from '../lib/exhibitions';
import { exhibitions } from '../lib/exhibitions';
import { Divider, Seal } from '../components/Ornaments';
import { getExhibitionPath, rootPath } from '../lib/paths';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

interface ExhibitionDetailProps {
  exhibition: Exhibition;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

function countWords(ex: Exhibition): number {
  const text = [ex.intro, ...ex.sections.map((s) => `${s.heading} ${s.body} ${(s.items ?? []).join(' ')}`)].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export default function ExhibitionDetail({ exhibition }: ExhibitionDetailProps) {
  const hasTemplates = exhibition.slug === 'fichamento-e-cornell';
  const index = exhibitions.findIndex((ex) => ex.slug === exhibition.slug);
  const total = exhibitions.length;
  const prev = index > 0 ? exhibitions[index - 1] : null;
  const next = index >= 0 && index < total - 1 ? exhibitions[index + 1] : null;

  const words = countWords(exhibition);
  const minutes = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="reader reader-body" style={{ position: 'relative', zIndex: 2 }}>
      {/* cromo superior */}
      <div
        className="reader-chrome"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          padding: '1.1rem 4vw',
          borderBottom: '1px solid var(--line)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        <a
          href={`${rootPath}#exhibitions`}
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'none', flexShrink: 0, paddingBlock: '0.5rem' }}
        >
          ← acervo
        </a>
        <span>
          verbete nº {String(index + 1).padStart(2, '0')} / {total} · {words} palavras · leitura de {minutes} min a 200 ppm
        </span>
      </div>

      {/* cabeçalho do verbete */}
      <header style={{ padding: '4.5rem 4vw 0', maxWidth: '1280px', margin: '0 auto' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--accent-void)',
            margin: '0 0 1.6rem',
          }}
        >
          {exhibition.eyebrow}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: 0,
            textWrap: 'balance',
          }}
        >
          {exhibition.title}
        </h1>
        <p
          className="reader-intro"
          style={{
            fontFamily: 'var(--font-sans)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.15rem, 2vw, 1.7rem)',
            lineHeight: 1.4,
            color: 'var(--text-secondary)',
            margin: '1.6rem 0 0',
            maxWidth: '34ch',
          }}
        >
          <span className="drop-cap">
            {exhibition.intro.charAt(0)}
          </span>
          {exhibition.intro.slice(1)}
        </p>

        {hasTemplates && (
          <a className="reader-template-link" href="#modelos-anotacao">Escolher um modelo para copiar ou imprimir</a>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginTop: '3rem',
            padding: '0.9rem 0',
            borderTop: '1px solid var(--text-primary)',
            borderBottom: '1px solid var(--line)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          <span>Leitura do acervo</span>
          <span>{exhibition.year} · método, não coach</span>
        </div>
      </header>

      <Divider width={440} style={{ marginTop: '2.75rem' }} />

      <nav className="reader-contents" aria-label="Seções deste verbete" style={{ padding: '0 4vw', maxWidth: '1280px', margin: '2rem auto 0' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.7rem' }}>Neste verbete</p>
        <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {hasTemplates && <li><a href="#modelos-anotacao" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--accent-void)' }}>Modelos para copiar e imprimir</a></li>}
          {exhibition.sections.map((section, i) => (
            <li key={section.heading}><a href={`#secao-${i + 1}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--accent-void)' }}>{section.heading}</a></li>
          ))}
        </ol>
      </nav>

      {/* corpo em colunas, texto contornando a gravura */}
      <main id="conteudo" tabIndex={-1} style={{ padding: '3rem 4vw 5rem', maxWidth: '1280px', margin: '0 auto' }}>
        {hasTemplates && <NoteTemplates />}
        <div
          className="article-columns"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.02rem',
            lineHeight: 1.8,
            color: 'var(--text-primary)',
          }}
        >
          <img className="reader-float" src={exhibition.image} alt={`Gravura — ${exhibition.title}`} />
          {exhibition.sections.map((section, i) => (
            <article key={section.heading} id={`secao-${i + 1}`} tabIndex={-1} style={{ scrollMarginTop: '2rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.22rem',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  letterSpacing: '0.01em',
                  color: 'var(--accent-void)',
                  margin: '0 0 0.9rem',
                }}
              >
                {ROMAN[i] ?? i + 1}. {section.heading}
              </h2>
              <p style={{ margin: section.items || section.links ? '0 0 1.2rem' : '0 0 2.4rem' }}>{section.body}</p>
              {section.items && (
                <ul style={{ margin: section.links ? '0 0 1.2rem' : '0 0 2.4rem', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  {section.items.map((item) => (
                    <li key={item} style={{ marginBottom: '0.65rem', textAlign: 'start', breakInside: 'avoid' }}>{item}</li>
                  ))}
                </ul>
              )}
              {section.links && (
                <ul aria-label={`Links de ${section.heading}`} style={{ listStyle: 'none', padding: 0, margin: '0 0 2.4rem', fontSize: '0.95rem' }}>
                  {section.links.map((link) => (
                    <li key={link.href} style={{ marginBottom: '0.45rem', breakInside: 'avoid' }}>
                      <a href={link.href} style={{ color: 'var(--accent-void)', overflowWrap: 'anywhere', textDecoration: 'underline' }}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </main>

      {/* colofão + navegação entre verbetes */}
      <footer style={{ padding: '0 4vw 4rem', maxWidth: '1280px', margin: '0 auto' }}>
        <nav
          className="reader-navigation"
          aria-label="Navegação do acervo"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
            gap: '2rem',
            alignItems: 'center',
            paddingTop: '1.6rem',
            borderTop: '1px solid var(--text-primary)',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            {prev && (
              <a
                href={getExhibitionPath(prev.slug)}
                rel="prev"
                style={{ background: 'none', border: 'none', padding: '0.5rem 0', cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'left' }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  ← verbete anterior
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                    fontSize: '1.15rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {prev.title}
                </span>
              </a>
            )}
          </div>

          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            <Seal size={64} />
            fim do verbete · {index + 1} de {total}
          </span>

          <div style={{ textAlign: 'right' }}>
            {next && (
              <a
                href={getExhibitionPath(next.slug)}
                rel="next"
                style={{ background: 'none', border: 'none', padding: '0.5rem 0', cursor: 'pointer', textDecoration: 'none', display: 'block', textAlign: 'right' }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  próximo verbete →
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                    fontSize: '1.15rem',
                    color: 'var(--accent-void)',
                  }}
                >
                  {next.title}
                </span>
              </a>
            )}
          </div>
        </nav>
      </footer>
    </div>
  );
}
