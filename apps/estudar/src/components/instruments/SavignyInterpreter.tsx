import { useId, useRef, useState } from 'react'

type Technique = 'gramatical' | 'lógica' | 'sistemática' | 'histórica'

const FRAGMENTS: { text: string; answer: Technique; why: string }[] = [
  {
    text: 'Na linguagem jurídica viva, “cláusula” designa uma estipulação contratual — e é nesse uso que o artigo a emprega.',
    answer: 'gramatical',
    why: 'A técnica gramatical fixa o sentido das palavras no uso vívido da língua jurídica — sem teoria, sem sistema: o que o termo significa.',
  },
  {
    text: 'Se o fato é definido como ato humano voluntário, então a omissão, por não ser ato, escapa à norma — conforme o pensamento posto no próprio enunciado.',
    answer: 'lógica',
    why: 'A técnica lógica reconstrói o pensamento expresso no enunciado: partem-se das suas premissas, não de desejos sobre o resultado.',
  },
  {
    text: 'O art. 421 do Código Civil não se lê sozinho: sua função social se compreende em conjunto com a presunção de paridade do art. 421-A e a boa-fé do art. 422.',
    answer: 'sistemática',
    why: 'A técnica sistemática situa o preceito na arquitetura do direito — nenhuma norma existe isolada, cada uma se liga à totalidade.',
  },
  {
    text: 'O código herdou “alimentos” do direito romano com o sentido que o ius commune lhe dava; é esse sentido histórico que vale.',
    answer: 'histórica',
    why: 'A técnica histórica reconecta o enunciado à corrente do desenvolvimento jurídico — saber quando o passado ainda vive no presente.',
  },
  {
    text: 'Neste enunciado hipotético, a escolha do verbo “poderá”, em vez de “deverá”, indica uma faculdade; a análise começa pelo sentido das palavras empregadas.',
    answer: 'gramatical',
    why: 'A técnica gramatical examina o vocabulário e a estrutura da frase. Conferir a autenticidade ou comparar versões do texto seria uma etapa anterior, não uma das quatro técnicas deste exercício.',
  },
  {
    text: 'Como o sistema penal impede criar ou agravar uma pena por analogia, um caso não previsto não pode receber a punição de outro apenas por semelhança.',
    answer: 'sistemática',
    why: 'A técnica sistemática relaciona o enunciado aos limites do próprio ordenamento. No direito penal, a analogia em prejuízo do acusado é vedada; a analogia em seu benefício pode ser admitida diante de lacuna. A distinção evita tratar toda analogia penal como proibida.',
  },
]

const TECHNIQUES: { id: Technique; label: string }[] = [
  { id: 'gramatical', label: 'Gramatical' },
  { id: 'lógica', label: 'Lógica' },
  { id: 'sistemática', label: 'Sistemática' },
  { id: 'histórica', label: 'Histórica' },
]

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
}

export default function SavignyInterpreter() {
  const fragmentId = useId()
  const fragmentRef = useRef<HTMLQuoteElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const [finished, setFinished] = useState(false)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<Technique | null>(null)
  const [hits, setHits] = useState(0)
  const [done, setDone] = useState(0)

  const frag = FRAGMENTS[index]

  const choose = (t: Technique) => {
    if (picked) return
    setPicked(t)
    setDone((d) => d + 1)
    if (t === frag.answer) setHits((h) => h + 1)
  }

  const next = () => {
    if (index === FRAGMENTS.length - 1) {
      setFinished(true)
      requestAnimationFrame(() => resultRef.current?.focus())
      return
    }
    setPicked(null)
    setIndex((i) => i + 1)
    requestAnimationFrame(() => fragmentRef.current?.focus())
  }

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setHits(0)
    setDone(0)
    setFinished(false)
    requestAnimationFrame(() => fragmentRef.current?.focus())
  }

  if (finished) {
    return (
      <div>
        <h3 ref={resultRef} tabIndex={-1} style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.4rem' }}>Rodada concluída</h3>
        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>Você acertou {hits} de {FRAGMENTS.length} fragmentos. Refaça a rodada e compare as razões de cada técnica.</p>
        <button type="button" onClick={restart} style={{ padding: '0.8rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: '1px solid var(--text-primary)', cursor: 'pointer' }}>Recomeçar rodada</button>
      </div>
    )
  }

  return (
    <div>
      <p style={mono}>
        Instrumento · classifique o fragmento — {index + 1} de {FRAGMENTS.length} · acertos {hits}/{done}
      </p>
      <blockquote
        id={fragmentId}
        ref={fragmentRef}
        tabIndex={-1}
        style={{
          margin: '1.1rem 0 0',
          padding: '1.1rem 1.2rem',
          borderLeft: '1px solid var(--accent-void)',
          background: 'var(--bg-tertiary)',
          fontFamily: 'var(--font-sans)',
          fontStyle: 'italic',
          fontSize: '0.98rem',
          lineHeight: 1.7,
          color: 'var(--text-primary)',
        }}
      >
        {frag.text}
      </blockquote>

      <div role="group" aria-label="Escolha a técnica de interpretação" aria-describedby={fragmentId} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(135px, 100%), 1fr))', gap: '0.6rem', marginTop: '1.1rem' }}>
        {TECHNIQUES.map((t) => {
          const isPicked = picked === t.id
          const isAnswer = picked && frag.answer === t.id
          const base: React.CSSProperties = {
            border: '1px solid var(--text-primary)',
            background: 'transparent',
            padding: '0.65rem 0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }
          if (isAnswer) {
            base.background = 'var(--text-primary)'
            base.color = 'var(--bg-primary)'
          } else if (isPicked) {
            base.borderColor = 'var(--accent-void)'
            base.color = 'var(--accent-void)'
          }
          return (
            <button key={t.id} type="button" onClick={() => choose(t.id)} aria-disabled={!!picked} aria-pressed={isPicked} style={base}>
              {t.label}
              <span aria-hidden="true">{isAnswer ? ' ✓' : isPicked ? ' ✗' : ''}</span>
            </button>
          )
        })}
      </div>

      {picked && (
        <div style={{ marginTop: '1rem' }}>
          <p role="status" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>{picked === frag.answer ? 'Correto.' : 'Reveja a escolha.'} Técnica: {frag.answer}.</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
            {frag.why}
          </p>
          <button
            type="button"
            onClick={next}
            style={{
              marginTop: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid var(--accent-void)',
              padding: '0 0 2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {index === FRAGMENTS.length - 1 ? 'Ver resultado da rodada →' : 'Próximo fragmento →'}
          </button>
        </div>
      )}
      <p style={{ ...mono, marginTop: '0.9rem', opacity: 0.75 }}>
        Fragmentos didáticos, não citações de Savigny. Classifique a técnica predominante: gramatical, lógica, sistemática ou histórica.
      </p>
      <p style={{ ...mono, textTransform: 'none', letterSpacing: '0.02em', lineHeight: 1.7 }}>
        Referências dos exemplos atuais: <a href="https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm" target="_blank" rel="noopener noreferrer">Código Civil (abre nova aba)</a> e <a href="https://scon.stj.jus.br/SCON/GetInteiroTeorDoAcordao?dt_publicacao=23%2F12%2F2024&num_registro=202403156692" target="_blank" rel="noopener noreferrer">STJ sobre analogia penal (abre nova aba)</a>.
      </p>
    </div>
  )
}
