import { useRef, useMemo } from 'react';
import { dailyConfig } from '../config';
import { Ticks } from '../components/Ornaments';

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const diff = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start;
  return Math.floor(diff / 86400000);
}

export default function DailyRitual() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const { quote, word, dateLabel } = useMemo(() => {
    const now = new Date();
    const day = dayOfYear(now);
    const quote = dailyConfig.quotes[day % dailyConfig.quotes.length];
    const word = dailyConfig.words[day % dailyConfig.words.length];
    const dateLabel = now
      .toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      .replace(/^./, (c) => c.toUpperCase());
    return { quote, word, dateLabel };
  }, []);



  if (!quote || !word) return null;

  return (
    <section
      id="hoje" className="daily-section"
      ref={sectionRef}
      style={{
        background: 'var(--bg-secondary)',
        padding: '10rem 4vw',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        ref={innerRef}
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          border: '1px solid rgba(242, 236, 220, 0.28)',
          padding: 'clamp(2rem, 5vw, 4.5rem)',
          position: 'relative',
        }}
      >
        <Ticks color="rgba(242, 236, 220, 0.55)" size={20} inset={9} />
        <div
          data-reveal
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-on-dark)',
            }}
          >
            Hoje, uma ideia e uma palavra.
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(242, 236, 220, 0.72)',
            }}
          >
            {dateLabel}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(3rem, 6vw, 6rem)',
          }}
        >
          {/* Citação do dia */}
          <div data-reveal>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(242, 236, 220, 0.72)',
                marginBottom: '1.75rem',
              }}
            >
              I. {dailyConfig.quoteLabel}
            </p>
            <blockquote
              style={{
                margin: 0,
                padding: 0,
                position: 'relative',
              }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '5rem',
                  lineHeight: 1,
                  color: 'var(--accent-on-dark)',
                  display: 'block',
                  height: '0.55em',
                }}
              >
                “
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 2.6vw, 2.3rem)',
                  fontWeight: 400,
                  lineHeight: 1.35,
                  color: 'var(--text-inverse)',
                  margin: '1rem 0 0',
                }}
              >
                {quote.text}
              </p>
              <footer
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(242, 236, 220, 0.6)',
                  marginTop: '2rem',
                }}
              >
                — {quote.author}
              </footer>
            </blockquote>
          </div>

          {/* Palavra do dia */}
          <div
            data-reveal
            className="daily-word"
            style={{
              borderLeft: '1px solid rgba(242, 236, 220, 0.28)',
              paddingLeft: 'clamp(1.5rem, 4vw, 4rem)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(242, 236, 220, 0.72)',
                marginBottom: '1.75rem',
              }}
            >
              II. {dailyConfig.wordLabel}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                color: 'var(--text-inverse)',
                margin: 0,
              }}
            >
              {word.word}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-on-dark)',
                marginTop: '0.9rem',
              }}
            >
              {word.origin}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif, var(--font-display))',
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.85,
                color: 'rgba(242, 236, 220, 0.78)',
                marginTop: '1.75rem',
              }}
            >
              {word.meaning}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
