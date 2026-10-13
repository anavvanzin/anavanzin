import { useId, useState } from 'react'
import { herbariumConfig } from '../../config'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
}

export default function HerbariumExplorer() {
  const panelId = useId()
  const families = herbariumConfig.families
  const [activeId, setActiveId] = useState(families[0]?.id ?? '')
  const active = families.find((f) => f.id === activeId) ?? families[0]

  return (
    <div>
      <p style={mono}>
        Índice interativo · {families.length} famílias ·{' '}
        {families.reduce((n, f) => n + f.specimens.length, 0)} espécimes — construído sobre o Herbário do site
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.1rem' }}>
        {families.map((f) => {
          const on = f.id === active?.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveId(f.id)}
              aria-pressed={on}
              aria-controls={panelId}
              style={{
                background: on ? 'var(--text-primary)' : 'transparent',
                color: on ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: '1px solid var(--text-primary)',
                padding: '0.5rem 0.9rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {f.root}
            </button>
          )
        })}
      </div>

      {!active && <p style={{ color: 'var(--text-secondary)' }}>O herbário ainda não tem famílias disponíveis.</p>}
      {active && (
        <div id={panelId} aria-live="polite" aria-atomic="true" style={{ marginTop: '1.2rem', border: '1px solid var(--text-primary)', padding: '1.1rem 1.2rem', background: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-primary)' }}>
              {active.root}
            </span>
            <span style={mono}>
              {active.rootLang} · {active.rootMeaning}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0.7rem 0 1rem' }}>
            {active.note}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))', gap: '0.5rem' }}>
            {active.specimens.map((s) => (
              <div key={s.word} style={{ border: '1px solid var(--line)', padding: '0.6rem 0.75rem', background: 'var(--bg-tertiary)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{s.word}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {s.gloss}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <p style={{ ...mono, marginTop: '0.9rem', opacity: 0.75 }}>
        Amostra do Herbário — para as ideias afins completas de cada entrada, o livro na estante é o instrumento.
      </p>
    </div>
  )
}
