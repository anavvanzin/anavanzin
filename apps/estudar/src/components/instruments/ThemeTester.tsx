import { useId, useMemo, useState } from 'react'

const CRITERIA = [
  {
    id: 'duvida',
    label: 'Dúvida real',
    hint: 'Você quer mesmo a resposta, ou só o título?',
    low: 'assunto, não tema — transforme em pergunta',
  },
  {
    id: 'relevancia',
    label: 'Relevância',
    hint: 'Quem se importa com a resposta, e por quê? (teste de Booth et al.)',
    low: 'responda “quem se importa?” por escrito',
  },
  {
    id: 'originalidade',
    label: 'Originalidade',
    hint: 'O que se acrescenta ao que já está escrito?',
    low: 'mapeie o estado da arte antes de decidir',
  },
  {
    id: 'viabilidade',
    label: 'Viabilidade',
    hint: 'Idioma das fontes, acesso aos dados, tempo disponível.',
    low: 'recorte o funil: tempo, espaço, tema, método',
  },
] as const

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
}

export default function ThemeTester() {
  const fieldId = useId()
  const [tema, setTema] = useState('')
  const [scores, setScores] = useState<Record<string, number>>({
    duvida: 3,
    relevancia: 3,
    originalidade: 2,
    viabilidade: 3,
  })

  const { total, weakest } = useMemo(() => {
    const vals = CRITERIA.map((c) => scores[c.id] ?? 0)
    const total = vals.reduce((a, b) => a + b, 0)
    let weakest: (typeof CRITERIA)[number] = CRITERIA[0]
    let min = Infinity
    CRITERIA.forEach((c) => {
      const v = scores[c.id] ?? 0
      if (v < min) {
        min = v
        weakest = c
      }
    })
    return { total, weakest }
  }, [scores])

  const verdict =
    total >= 17
      ? { label: 'Autoavaliação forte', body: 'Sua autoavaliação é forte nos quatro filtros do cap. 4. Escreva a pergunta de pesquisa e confira os critérios com as fontes e um leitor crítico.', tone: 'good' as const }
      : total >= 12
        ? { label: 'Vale, mas delimite mais', body: `O tema passa no teste, com uma frente fraca: ${weakest.label.toLowerCase()} — ${weakest.low}. Corrija essa aresta antes do pré-projeto.`, tone: 'mid' as const }
        : { label: 'Volte ao funil', body: `Ainda é assunto, não tema. A frente mais fraca é ${weakest.label.toLowerCase()} — ${weakest.low}. Releia o cap. 4 antes de avançar.`, tone: 'low' as const }

  const toneColor =
    verdict.tone === 'good' ? 'var(--text-primary)' : verdict.tone === 'mid' ? 'var(--accent-void)' : 'var(--accent-void)'

  return (
    <div>
      <p style={mono}>Instrumento · os quatro filtros do cap. 4</p>
      <label style={{ ...mono, display: 'block', marginTop: '1.1rem', marginBottom: '0.4rem' }} htmlFor={`${fieldId}-tema`}>
        Tema candidato
      </label>
      <input
        id={`${fieldId}-tema`}
        className="instrument-field"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        placeholder="ex.: uso de IA generativa na fundamentação de decisões…"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--line)',
          padding: '0.7rem 0.85rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          color: 'var(--text-primary)',
        }}
      />

      <div style={{ marginTop: '1.4rem', display: 'grid', gap: '1.05rem' }}>
        {CRITERIA.map((c) => {
          const v = scores[c.id] ?? 0
          return (
            <div key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <span style={{ ...mono, color: 'var(--text-primary)', textTransform: 'none', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
                  {c.label}
                </span>
                <span style={{ ...mono, color: 'var(--accent-void)', fontVariantNumeric: 'tabular-nums' }}>
                  {v}/5
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={v}
                aria-label={c.label}
                aria-describedby={`${fieldId}-${c.id}-hint`}
                aria-valuetext={`${v} de 5`}
                onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-void)', cursor: 'pointer' }}
              />
              <span id={`${fieldId}-${c.id}-hint`} style={{ ...mono, display: 'block', marginTop: '0.3rem', textTransform: 'none', letterSpacing: '0.04em', opacity: 0.85 }}>
                {c.hint}
              </span>
            </div>
          )
        })}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          marginTop: '1.6rem',
          border: '1px solid var(--text-primary)',
          padding: '1.1rem 1.2rem',
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
          <span style={{ ...mono, color: 'var(--text-primary)' }}>Sua autoavaliação</span>
          <span style={{ ...mono, fontVariantNumeric: 'tabular-nums', color: 'var(--accent-void)' }}>
            {total}/20
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: toneColor,
            margin: '0 0 0.5rem',
          }}
        >
          {verdict.label}
          {tema.trim() ? ` — “${tema.trim().length > 60 ? tema.trim().slice(0, 60) + '…' : tema.trim()}”` : ''}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
          {verdict.body}
        </p>
      </div>
      <p style={{ ...mono, marginTop: '0.9rem', opacity: 0.75 }}>
        Atribua 0 a 5 a cada critério com base nas evidências do seu projeto. A pontuação orienta a revisão; não valida o tema.
      </p>
    </div>
  )
}
