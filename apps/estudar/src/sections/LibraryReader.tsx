import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import type { LibraryDoc, LibraryDocSection, DocBlock, InstrumentId } from '../data/libraryDocs'
import { libraryDocuments } from '../lib/library'
import { Divider, Seal } from '../components/Ornaments'
import { getLibraryPath, rootPath } from '../lib/paths'
import ThemeTester from '../components/instruments/ThemeTester'
import SavignyInterpreter from '../components/instruments/SavignyInterpreter'
import CoherenceBuilder from '../components/instruments/CoherenceBuilder'
import HerbariumExplorer from '../components/instruments/HerbariumExplorer'

const INSTRUMENTS: Record<InstrumentId, { label: string; Component: () => ReactElement }> = {
  'theme-tester': { label: 'Instrumento 1 · teste de tema', Component: ThemeTester },
  'savigny-interpreter': { label: 'Instrumento 2 · classificador savignyano', Component: SavignyInterpreter },
  'coherence-builder': { label: 'Instrumento 3 · construtor de coerência', Component: CoherenceBuilder },
  'herbarium-explorer': { label: 'Mostra · herbário de palavras', Component: HerbariumExplorer },
}

function countWords(doc: LibraryDoc): number {
  const blockText = (b: DocBlock): string => {
    switch (b.kind) {
      case 'para':
      case 'quote':
        return b.text
      case 'list':
        return b.items.join(' ')
      case 'table':
        return [b.head.join(' '), ...b.rows.map((r) => r.join(' '))].join(' ')
    }
  }
  const text = [
    doc.intro,
    doc.sourceNote,
    ...doc.sections.map((s) => `${s.title} ${s.blocks.map(blockText).join(' ')}`),
  ].join(' ')
  return text.split(/\s+/).filter(Boolean).length
}

/* ------------------------------------------------------------------ blocos */

function Block({ block }: { block: DocBlock }) {
  if (block.kind === 'para') {
    return (
      <p className="reader-paragraph" style={{ margin: '0 0 1.4rem', hyphens: 'auto' }}>
        {block.text}
      </p>
    )
  }
  if (block.kind === 'list') {
    return (
      <ul style={{ margin: '0 0 1.6rem', paddingLeft: '1.2rem', display: 'grid', gap: '0.55rem' }}>
        {block.items.map((item, i) => (
          <li key={i} style={{ paddingLeft: '0.3rem', textAlign: 'start', hyphens: 'auto' }}>
            {item}
          </li>
        ))}
      </ul>
    )
  }
  if (block.kind === 'quote') {
    return (
      <blockquote
        style={{
          margin: '0 0 1.6rem',
          padding: '0.4rem 0 0.4rem 1.2rem',
          borderLeft: '1px solid var(--accent-void)',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
        }}
      >
        <p style={{ margin: '0 0 0.4rem' }}>“{block.text}”</p>
        {block.source && (
          <cite
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontStyle: 'normal',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            {block.source}
          </cite>
        )}
      </blockquote>
    )
  }
  // table
  return (
    <figure style={{ margin: '0 0 1.8rem', breakInside: 'avoid', minWidth: 0 }}>
      <div className="reader-table-scroll" role="region" aria-label={block.caption || 'Tabela de estudo'} tabIndex={0} style={{ overflowX: 'auto', maxWidth: '100%' }}>
      <table
        style={{
          width: '100%',
          minWidth: block.head.length > 2 ? '28rem' : undefined,
          borderCollapse: 'collapse',
          fontSize: '0.86rem',
          lineHeight: 1.5,
        }}
      >
        <thead>
          <tr>
            {block.head.map((h, i) => (
              <th
                key={i}
                scope="col"
                style={{
                  textAlign: 'left',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-void)',
                  borderTop: '1px solid var(--text-primary)',
                  borderBottom: '1px solid var(--text-primary)',
                  padding: '0.55rem 0.6rem 0.55rem 0',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    borderBottom: '1px solid var(--line)',
                    padding: '0.55rem 0.6rem 0.55rem 0',
                    verticalAlign: 'top',
                    color: j === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontStyle: j === 0 ? 'italic' : 'normal',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {block.caption && (
        <figcaption
          style={{
            marginTop: '0.55rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ chrome */

function Cromo({ index, total, words }: { index: number; total: number; words: number }) {
  const minutes = Math.max(1, Math.round(words / 200))
  return (
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
        href={`${rootPath}#biblioteca`}
        style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'none', flexShrink: 0, paddingBlock: '0.5rem' }}
      >
        ← biblioteca
      </a>
      <span style={{ textAlign: 'right' }}>
        ficha nº {String(index + 1).padStart(2, '0')} / {total} · {words} palavras · leitura de {minutes} min a 200 ppm
      </span>
    </div>
  )
}

function DocHeader({ doc }: { doc: LibraryDoc }) {
  return (
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
        {doc.eyebrow}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 6vw, 5.2rem)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          margin: 0,
          textWrap: 'balance',
        }}
      >
        {doc.title}
      </h1>
      <p
        className="reader-intro"
        style={{
          fontFamily: 'var(--font-sans)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
          lineHeight: 1.45,
          color: 'var(--text-secondary)',
          margin: '1.6rem 0 0',
          maxWidth: '38ch',
        }}
      >
        <span className="drop-cap">
          {doc.intro.charAt(0)}
        </span>
        {doc.intro.slice(1)}
      </p>
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
        <span>{doc.meta}</span>
        <span>{doc.year} · método, não coach</span>
      </div>
      <p
        style={{
          margin: '1rem 0 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.1em',
          color: 'var(--text-secondary)',
          opacity: 0.85,
          maxWidth: '72ch',
          lineHeight: 1.8,
        }}
      >
        {doc.sourceNote}
      </p>
    </header>
  )
}

function DocFooter({ index, total }: { index: number; total: number }) {
  const prev = index > 0 ? libraryDocuments[index - 1] : null
  const next = index >= 0 && index < total - 1 ? libraryDocuments[index + 1] : null
  const btn = (align: 'left' | 'right'): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    padding: '0.5rem 0',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    textAlign: align,
  })
  const kicker: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  }
  const title: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontStyle: 'italic',
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
  }
  return (
    <footer style={{ padding: '0 4vw 4rem', maxWidth: '1280px', margin: '0 auto' }}>
      <nav
        className="reader-navigation"
        aria-label="Navegação da biblioteca"
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
          {prev ? (
            <a href={getLibraryPath(prev.slug)} rel="prev" style={btn('left')}>
              <span style={kicker}>← ficha anterior</span>
              <span style={title}>{prev.title}</span>
            </a>
          ) : (
            <a href={`${rootPath}#biblioteca`} style={btn('left')}>
              <span style={kicker}>← voltar</span>
              <span style={title}>índice da biblioteca</span>
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
          fim da ficha · {index + 1} de {total}
        </span>
        <div style={{ textAlign: 'right' }}>
          {next && (
            <a href={getLibraryPath(next.slug)} rel="next" style={btn('right')}>
              <span style={kicker}>próxima ficha →</span>
              <span style={{ ...title, color: 'var(--accent-void)' }}>{next.title}</span>
            </a>
          )}
        </div>
      </nav>
    </footer>
  )
}

/* ------------------------------------------------------------------ flow */

function ReaderContents({ doc }: { doc: LibraryDoc }) {
  return (
    <nav className="reader-contents" aria-label="Seções desta leitura" style={{ padding: '0 4vw', maxWidth: '1280px', margin: '2rem auto 0' }}>
      <details>
        <summary style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-void)', cursor: 'pointer', paddingBlock: '0.5rem' }}>Nesta leitura · {doc.sections.length} seções</summary>
        <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem 1.5rem', listStyle: 'none', margin: '1rem 0 0', padding: 0 }}>
          {doc.sections.map((section) => (
            <li key={section.id}><a href={`#secao-${section.id}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--accent-void)' }}>{section.title}</a></li>
          ))}
        </ol>
      </details>
    </nav>
  )
}

function SectionHeading({ section }: { section: LibraryDocSection }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.22rem',
        fontWeight: 700,
        lineHeight: 1.35,
        letterSpacing: '0.01em',
        color: 'var(--accent-void)',
        margin: '0 0 0.9rem',
        breakAfter: 'avoid',
      }}
    >
      {section.id}. {section.title}
    </h2>
  )
}

function FlowReader({ doc }: ReaderProps) {
  const index = libraryDocuments.findIndex((d) => d.slug === doc.slug)
  const instrumentSections = doc.sections.filter((s) => s.instrument)
  return (
    <div className="reader reader-body" style={{ position: 'relative', zIndex: 2 }}>
      <Cromo index={index} total={libraryDocuments.length} words={countWords(doc)} />
      <DocHeader doc={doc} />
      <Divider width={440} style={{ marginTop: '2.75rem' }} />

      <ReaderContents doc={doc} />

      <main id="conteudo" tabIndex={-1} style={{ padding: '3rem 4vw 5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="article-columns"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.02rem',
            lineHeight: 1.8,
            color: 'var(--text-primary)',
          }}
        >
          <img className="reader-float" src={doc.image} alt={`Gravura — ${doc.title}`} />
          {doc.sections.map((section) => (
<article key={section.id} id={`secao-${section.id}`} tabIndex={-1} style={{ scrollMarginTop: '2rem' }}>
              <SectionHeading section={section} />
              {section.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </article>
          ))}
        </div>

        {instrumentSections.map((s) => {
          if (!s.instrument) return null
          const { label, Component } = INSTRUMENTS[s.instrument]
          return (
            <div
              key={s.id}
              className="doc-instrument"
              style={{
                marginTop: '3rem',
                border: '1px solid var(--text-primary)',
                background: 'var(--bg-primary)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                position: 'relative',
              }}
            >
              <p
                style={{
                  margin: '0 0 1.2rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-void)',
                }}
              >
                {label} — § {s.id}
              </p>
              <Component />
            </div>
          )
        })}
      </main>

      <DocFooter index={index} total={libraryDocuments.length} />
    </div>
  )
}

/* -------------------------------------------------------------- explainer */

interface ReaderProps {
  doc: LibraryDoc
  onBack: () => void
  onNavigate: (slug: string) => void
}

function ExplainerReader({ doc }: ReaderProps) {
  const index = libraryDocuments.findIndex((d) => d.slug === doc.slug)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const stageRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState(doc.sections[0]?.id ?? '')

  const activeInstrument = useMemo(() => {
    let current: InstrumentId | null = null
    for (const s of doc.sections) {
      if (s.instrument) current = s.instrument
      if (s.id === activeSection) break
    }
    if (!current) current = doc.sections.find((section) => section.instrument)?.instrument ?? null
    return current
  }, [activeSection, doc.sections])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (stageRef.current?.contains(document.activeElement)) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id')
            if (id) setActiveSection(id)
          }
        })
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [doc.slug])

  const instrumentIds = [...new Set(doc.sections.flatMap((section) => section.instrument ? [section.instrument] : []))]

  return (
    <div className="reader reader-body" style={{ position: 'relative', zIndex: 2 }}>
      <Cromo index={index} total={libraryDocuments.length} words={countWords(doc)} />
      <DocHeader doc={doc} />
      <Divider width={440} style={{ marginTop: '2.75rem' }} />

      <ReaderContents doc={doc} />

      <main
        id="conteudo"
        tabIndex={-1}
        style={{
          padding: '3rem 4vw 5rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
        className="explainer-grid"
      >
        {/* coluna de leitura */}
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.02rem',
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            minWidth: 0,
          }}
        >
          <img
            src={doc.image}
            alt={`Gravura — ${doc.title}`}
            style={{
              width: 'min(46%, 260px)',
              float: 'right',
              margin: '0.2rem 0 1.2rem 1.6rem',
              borderRadius: '50%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              filter: 'sepia(0.18) contrast(1.02)',
            }}
          />
          {doc.sections.map((section, i) => (
            <article
              key={section.id}
              id={`secao-${section.id}`}
              tabIndex={-1}
              data-section-id={section.id}
              ref={(el) => {
                sectionRefs.current[i] = el
              }}
              style={{ marginBottom: '3rem', scrollMarginTop: '2rem' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: 'var(--accent-void)',
                  margin: '0 0 1.1rem',
                  paddingTop: '0.4rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                    marginRight: '0.7rem',
                  }}
                >
                  {section.id}
                </span>
                {section.title}
              </h2>
              {section.blocks.map((b, j) => (
                <Block key={j} block={b} />
              ))}
              {/* instrumento inline (mobile) */}
              {section.instrument && (
                <div
                  className="instrument-inline"
                  style={{
                    margin: '1.5rem 0 0',
                    border: '1px solid var(--text-primary)',
                    background: 'var(--bg-primary)',
                    padding: '1.4rem',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 1.2rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-void)',
                    }}
                  >
                    {INSTRUMENTS[section.instrument].label} — § {section.id}
                  </p>
                  {(() => {
                    const C = INSTRUMENTS[section.instrument].Component
                    return <C />
                  })()}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* painel do instrumento (desktop) */}
        <aside ref={stageRef} className="explainer-stage" aria-label="Instrumentos desta leitura" style={{ position: 'sticky', top: '2rem', minWidth: 0, maxHeight: 'calc(100svh - 4rem)', overflowY: 'auto' }}>
          <div
            style={{
              border: '1px solid var(--text-primary)',
              background: 'var(--bg-primary)',
              padding: 'clamp(1.4rem, 2.4vw, 2.2rem)',
              position: 'relative',
            }}
          >
            {instrumentIds.length > 1 && (
              <div role="group" aria-label="Escolher instrumento" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                {instrumentIds.map((id) => (
                  <button key={id} type="button" aria-pressed={id === activeInstrument} onClick={() => setActiveSection(doc.sections.find((section) => section.instrument === id)?.id ?? activeSection)} style={{ background: id === activeInstrument ? 'var(--text-primary)' : 'transparent', color: id === activeInstrument ? 'var(--bg-primary)' : 'var(--text-primary)', border: '1px solid var(--line)', padding: '0.6rem 0.7rem', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', cursor: 'pointer' }}>{INSTRUMENTS[id].label.split(' · ').slice(1).join(' · ')}</button>
                ))}
              </div>
            )}
            {instrumentIds.length ? instrumentIds.map((id) => {
              const { label, Component } = INSTRUMENTS[id]
              return (
                <section key={id} hidden={id !== activeInstrument} aria-label={label}>
                  <p style={{ margin: '0 0 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--accent-void)' }}>
                    {label} · acompanha a leitura
                  </p>
                  <Component />
                </section>
              )
            }) : (
              <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                Nenhum instrumento nesta seção.
              </p>
            )}
          </div>
        </aside>
      </main>

      <DocFooter index={index} total={libraryDocuments.length} />
    </div>
  )
}

/* ------------------------------------------------------------------ raiz */

export default function LibraryReader({ doc, onBack, onNavigate }: ReaderProps) {
  return doc.model === 'explainer' ? (
    <ExplainerReader key={doc.slug} doc={doc} onBack={onBack} onNavigate={onNavigate} />
  ) : (
    <FlowReader key={doc.slug} doc={doc} onBack={onBack} onNavigate={onNavigate} />
  )
}
