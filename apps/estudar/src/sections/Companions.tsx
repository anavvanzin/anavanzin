import { useRef } from 'react';
import { companionsConfig } from '../config';
import { Ticks } from '../components/Ornaments';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export default function Companions() {
  const innerRef = useRef<HTMLDivElement>(null);



  return (
    <section
      id="companhia"
      style={{
        background: 'var(--bg-secondary)',
        padding: '10rem 4vw',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div ref={innerRef} style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div data-reveal style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-on-dark)',
            }}
          >
            {companionsConfig.sectionLabel}
          </span>
        </div>
        <h2
          data-reveal
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            color: 'var(--text-inverse)',
            margin: '0 0 2rem',
          }}
        >
          {companionsConfig.heading}
        </h2>
        <p
          data-reveal
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            lineHeight: 1.85,
            color: 'rgba(242, 236, 220, 0.75)',
            maxWidth: '68ch',
            marginBottom: '4.5rem',
          }}
        >
          {companionsConfig.intro}
        </p>

        {/* Games */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5rem',
            marginBottom: '8rem',
          }}
        >
          {companionsConfig.games.map((game, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={game.url}
                data-reveal
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                  gap: 'clamp(2rem, 5vw, 5rem)',
                  alignItems: 'center',
                }}
              >
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    order: reversed ? 2 : 1,
                    border: '1px solid rgba(242, 236, 220, 0.3)',
                    overflow: 'hidden',
                    lineHeight: 0,
                    position: 'relative',
                  }}
                >
                  <Ticks color="rgba(242, 236, 220, 0.6)" size={16} inset={8} />
                  <img
                    loading="lazy"
                    src={game.image}
                    alt={game.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxHeight: '420px',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                  />
                </a>
                <div style={{ order: reversed ? 1 : 2 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-on-dark)',
                    }}
                  >
                    {ROMAN[i]}. {game.platform}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
                      fontWeight: 400,
                      lineHeight: 1.1,
                      color: 'var(--text-inverse)',
                      margin: '0.9rem 0 1.25rem',
                    }}
                  >
                    {game.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(0.98rem, 1.2vw, 1.1rem)',
                      lineHeight: 1.8,
                      color: 'rgba(242, 236, 220, 0.78)',
                      margin: 0,
                    }}
                  >
                    {game.description}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
                      fontStyle: 'italic',
                      lineHeight: 1.7,
                      color: 'var(--accent-on-dark)',
                      marginTop: '1.25rem',
                    }}
                  >
                    {game.note}
                  </p>
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--text-inverse)',
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--accent-void)',
                      paddingBottom: '3px',
                      marginTop: '1.75rem',
                    }}
                  >
                    {companionsConfig.visitLabel}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timekeeper essay */}
        <div
          data-reveal
          style={{
            border: '1px solid rgba(242, 236, 220, 0.3)',
            padding: 'clamp(2rem, 5vw, 4.5rem)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--accent-on-dark)',
              }}
            >
              Nota técnica
            </span>
            <a
              href={companionsConfig.timekeeperAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-inverse)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--accent-void)',
                paddingBottom: '3px',
              }}
            >
              {companionsConfig.timekeeperAppName} — site oficial ↗
            </a>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--text-inverse)',
              margin: '0 0 2.5rem',
              maxWidth: '24ch',
            }}
          >
            {companionsConfig.timekeeperHeading}
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
            }}
          >
            {companionsConfig.timekeeperParagraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.98rem, 1.2vw, 1.1rem)',
                  lineHeight: 1.85,
                  color: 'rgba(242, 236, 220, 0.78)',
                  margin: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    color: 'var(--accent-on-dark)',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  §{i + 1}
                </span>
                {p}
              </p>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
              fontStyle: 'italic',
              lineHeight: 1.7,
              color: 'rgba(242, 236, 220, 0.6)',
              marginTop: '2.5rem',
              marginBottom: 0,
              borderTop: '1px solid rgba(242, 236, 220, 0.2)',
              paddingTop: '1.75rem',
            }}
          >
            {companionsConfig.timekeeperAppNote}
          </p>
        </div>
      </div>
    </section>
  );
}
