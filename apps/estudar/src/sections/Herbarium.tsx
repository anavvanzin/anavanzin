import { useState } from 'react';
import { herbariumConfig } from '../config';
import { Corners, Divider, Fleuron } from '../components/Ornaments';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default function Herbarium() {
  const [active, setActive] = useState(0);
  const family = herbariumConfig.families[active];
  if (!family) return null;

  return (
    <section
      id="herbario"
      style={{
        background: 'var(--bg-primary)',
        padding: '10rem 4vw',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* cabeçalho */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-void)',
            }}
          >
            {herbariumConfig.sectionLabel}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
            }}
          >
            {herbariumConfig.families.length} famílias ·{' '}
            {herbariumConfig.families.reduce((n, f) => n + f.specimens.length, 0)} espécimes
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '1.5rem 0 0',
          }}
        >
          {herbariumConfig.heading}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.08rem',
            lineHeight: 1.85,
            color: 'var(--text-secondary)',
            maxWidth: '62ch',
            margin: '1.75rem 0 2.5rem',
          }}
        >
          {herbariumConfig.intro}
        </p>
        <Divider width={400} style={{ margin: '0 0 3.5rem' }} />

        <div
          className="herbarium-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 280px) minmax(0, 1fr)',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* índice de famílias */}
          <nav style={{ borderTop: '1px solid var(--text-primary)' }}>
            {herbariumConfig.families.map((f, i) => {
              const isActive = i === active;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-controls="herbarium-specimen"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: isActive ? 'var(--bg-tertiary)' : 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--line)',
                    padding: '1.1rem 0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.64rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--accent-void)' : 'var(--text-secondary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span>{ROMAN[i] ?? i + 1}.</span>
                    <span>{f.specimens.length} espécimes</span>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontStyle: 'italic',
                      fontSize: '1.25rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {f.root}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* lâmina de espécime */}
          <div
            key={family.id}
            id="herbarium-specimen"
            aria-live="polite"
            style={{
              border: '1px solid var(--text-primary)',
              padding: 'clamp(1.75rem, 3.5vw, 3.5rem)',
              background: 'var(--bg-primary)',
              position: 'relative',
            }}
          >
            <Corners size={104} inset={-20} opacity={0.88} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1.5rem',
                flexWrap: 'wrap',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--line)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.64rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
              }}
            >
              <span>
                lâmina {ROMAN[active] ?? active + 1} · família {family.root}
              </span>
              <span>
                <Fleuron size={12} style={{ marginRight: '0.55rem' }} />
                raiz {family.rootLang}
              </span>
            </div>

            <div style={{ textAlign: 'center', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {family.root}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-void)',
                  margin: '1.25rem 0 0',
                }}
              >
                {family.rootLang} · “{family.rootMeaning}”
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontStyle: 'italic',
                  fontSize: '1.08rem',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  maxWidth: '52ch',
                  margin: '2rem auto 0',
                }}
              >
                {family.note}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
                borderTop: '1px solid var(--line)',
                borderLeft: '1px solid var(--line)',
              }}
            >
              {family.specimens.map((s, i) => (
                <div
                  key={s.word}
                  style={{
                    padding: '1.4rem 1.5rem',
                    borderRight: '1px solid var(--line)',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-void)',
                      margin: '0 0 0.6rem',
                    }}
                  >
                    {ROMAN[active]}.{i + 1}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {s.word}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      margin: '0.5rem 0 0',
                    }}
                  >
                    {s.gloss}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .herbarium-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
