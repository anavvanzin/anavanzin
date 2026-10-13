import { useId, useState } from 'react'

const LINKS = [
  { id: 'tema', label: 'Tema', placeholder: 'O recorte: tempo, espaço, tema, método…' },
  { id: 'problema', label: 'Problema', placeholder: 'O que não se sabe ainda — a lacuna…' },
  { id: 'pergunta', label: 'Pergunta', placeholder: 'A dúvida de trabalho, em uma interrogação…' },
  { id: 'hipotese', label: 'Hipótese', placeholder: 'A resposta provisória e testável…' },
  { id: 'objetivos', label: 'Objetivos', placeholder: 'O que fazer para testar a hipótese…' },
  { id: 'metodo', label: 'Método', placeholder: 'Abordagem, procedimento, técnicas…' },
  { id: 'justificativa', label: 'Justificativa', placeholder: 'Por que a resposta importa…' },
] as const

type LinkId = (typeof LINKS)[number]['id']

const STOPWORDS = new Set([
  'para', 'como', 'quais', 'sobre', 'entre', 'desde', 'pelo', 'pela', 'pelos', 'pelas', 'este',
  'esta', 'esses', 'essas', 'ainda', 'onde', 'quando', 'muito', 'menos', 'mais', 'deve', 'deverá',
  'será', 'sendo', 'porque', 'assim', 'tais', 'qual', 'quem', 'cujo', 'cuja', 'isso', 'essa',
])

const OBJETIVO_VERBS = ['analisar', 'investigar', 'propor', 'examinar', 'identificar', 'avaliar', 'demonstrar', 'verificar', 'reconstruir', 'sistematizar', 'comparar']

function keywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-zà-ÿ0-9]+/)
      .filter((w) => w.length >= 5 && !STOPWORDS.has(w))
  )
}

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0
  a.forEach((w) => {
    if (b.has(w)) n++
  })
  return n
}

interface Check {
  ok: boolean
  label: string
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
}

export default function CoherenceBuilder() {
  const formId = useId()
  const [fields, setFields] = useState<Record<LinkId, string>>({
    tema: '',
    problema: '',
    pergunta: '',
    hipotese: '',
    objetivos: '',
    metodo: '',
    justificativa: '',
  })
  const [checked, setChecked] = useState(false)

  const set = (id: LinkId, v: string) => {
    setFields((f) => ({ ...f, [id]: v }))
    setChecked(false)
  }

  const checks: Check[] = checked
    ? [
        {
          ok: fields.pergunta.trim().includes('?'),
          label: 'A pergunta é uma interrogação declarada',
        },
        {
          ok: overlap(keywords(fields.problema), keywords(fields.pergunta)) >= 1,
          label: 'Pergunta e problema partilham vocabulário',
        },
        {
          ok: overlap(keywords(fields.pergunta), keywords(fields.hipotese)) >= 1,
          label: 'Hipótese responde à pergunta (termos em comum)',
        },
        {
          ok: OBJETIVO_VERBS.some((v) => fields.objetivos.toLowerCase().includes(v)),
          label: 'Objetivos contêm verbos de trabalho (analisar, propor…)',
        },
        {
          ok: fields.metodo.trim().length >= 20,
          label: 'Método declarado com abordagem, procedimento ou técnica',
        },
        {
          ok: fields.justificativa.trim().length >= 60,
          label: 'Justificativa sustenta a relevância',
        },
      ]
    : []

  const passed = checks.filter((c) => c.ok).length

  return (
    <form onSubmit={(event) => { event.preventDefault(); setChecked(true) }}>
      <p style={mono}>Instrumento · a cadeia de sete elos + teste de coerência</p>
      <div style={{ marginTop: '1.1rem', display: 'grid', gap: '0.85rem' }}>
        {LINKS.map((l, i) => (
          <div key={l.id}>
            <label htmlFor={`${formId}-${l.id}`} style={{ ...mono, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              {i + 1}. {l.label}
            </label>
            <textarea
              className="instrument-field"
              id={`${formId}-${l.id}`}
              rows={2}
              value={fields[l.id]}
              onChange={(e) => set(l.id, e.target.value)}
              placeholder={l.placeholder}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--line)',
                padding: '0.6rem 0.8rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                resize: 'vertical',
                minHeight: '5rem',
                lineHeight: 1.6,
              }}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        style={{
          marginTop: '1.2rem',
          background: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          border: '1px solid var(--text-primary)',
          padding: '0.7rem 1.4rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Testar coerência
      </button>

      {checked && (
        <div role="status" aria-live="polite" style={{ marginTop: '1.2rem', border: '1px solid var(--text-primary)', padding: '1rem 1.1rem', background: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.7rem' }}>
            <span style={{ ...mono, color: 'var(--text-primary)' }}>Resultado do teste</span>
            <span style={{ ...mono, fontVariantNumeric: 'tabular-nums', color: passed === checks.length ? 'var(--text-primary)' : 'var(--accent-void)' }}>
              {passed}/{checks.length}
            </span>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.45rem' }}>
            {checks.map((c) => (
              <li key={c.label} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', color: c.ok ? 'var(--text-primary)' : 'var(--accent-void)', display: 'flex', gap: '0.6rem' }}>
                <span aria-hidden>{c.ok ? '✓' : '!'}</span>
                <span><span className="sr-only">{c.ok ? 'Atendido: ' : 'Revisar: '}</span>{c.label}</span>
              </li>
            ))}
          </ul>
          <p style={{ ...mono, marginTop: '0.9rem', textTransform: 'none', letterSpacing: '0.04em', opacity: 0.85 }}>
            {passed === checks.length
              ? 'Os seis sinais de escrita estão presentes. Leve a cadeia à leitura crítica de um par.'
              : 'Cada alerta aponta o elo a reforçar — revise o vizinho do elo anterior também.'}
          </p>
        </div>
      )}
      <p style={{ ...mono, marginTop: '0.9rem', opacity: 0.75 }}>
        Teste heurístico de escrita — não substitui a leitura crítica de um par.
      </p>
    </form>
  )
}
