import { useRef } from 'react';
import { libraryConfig } from '../config';
import { getLibraryPath } from '../lib/paths';
import { Corners } from '../components/Ornaments';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export default function Library() {
  const innerRef = useRef<HTMLDivElement>(null);



  if (!libraryConfig.items.length) return null;

  return (
    <section
      id="biblioteca"
      style={{
        background: 'var(--bg-primary)',
        padding: '8rem 4vw',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div ref={innerRef} style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          data-reveal
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Biblioteca de trabalho.
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
            }}
          >
            {String(libraryConfig.items.length).padStart(2, '0')} fichas
          </span>
        </div>

        <p
          data-reveal
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            maxWidth: '62ch',
            marginBottom: '3.5rem',
          }}
        >
          {libraryConfig.intro}
        </p>

        <div
          style={{
            border: '1px solid var(--text-primary)',
            position: 'relative',
          }}
        >
          <Corners size={92} inset={-18} opacity={0.85} />
          {libraryConfig.items.map((item, i) => (
            <a
              key={item.slug}
              href={getLibraryPath(item.slug)}
              data-reveal
              className="library-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: 'clamp(1.25rem, 3vw, 3rem)',
                width: '100%',
                textAlign: 'left',
                padding: 'clamp(1.5rem, 2.5vw, 2.25rem) clamp(1.25rem, 3vw, 2.5rem)',
                borderBottom:
                  i < libraryConfig.items.length - 1 ? '1px solid var(--line)' : 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                transition: 'background 300ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: 'var(--accent-void)',
                  minWidth: '2.5rem',
                }}
              >
                {ROMAN[i] ?? String(i + 1)}.
              </span>

              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.25rem, 2.2vw, 1.9rem)',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.category} · {item.format}
                  </span>
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginTop: '0.5rem',
                    maxWidth: '68ch',
                  }}
                >
                  {item.description}
                </span>
              </span>

              <span
                className="library-link"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--accent-void)',
                  paddingBottom: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                {libraryConfig.linkLabel}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
