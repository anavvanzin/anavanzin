import { pavilionsConfig } from '../config';


function ImagePlate({ image, caption }: { image: string; caption: string }) {
  return (
    <div>
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
          border: '1px solid var(--text-primary)',
        }}
      >
        <img
          src={image}
          loading="lazy"
          width="1024"
          height="576"
          alt={caption}
          className="plate-kenburns"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'sepia(0.18) contrast(1.02)',
          }}
        />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          marginTop: '1rem',
          letterSpacing: '0.04em',
        }}
      >
        {caption}
      </p>
    </div>
  );
}

export default function CinematicPavilions() {
  if (!pavilionsConfig.sectionLabel && pavilionsConfig.plates.length === 0) {
    return null;
  }

  return (
    <section
      id="pavilions"
      style={{
        background: 'var(--bg-tertiary)',
        padding: '12rem 4vw',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          marginBottom: '4rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent-void)',
        }}
      >
        {pavilionsConfig.sectionLabel}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: pavilionsConfig.plates.length > 1 ? 'repeat(2, 1fr)' : '1fr',
          gap: '3rem',
        }}
        className="plates-grid"
      >
        {pavilionsConfig.plates.map((plate) => (
          <ImagePlate key={`${plate.image}-${plate.caption}`} image={plate.image} caption={plate.caption} />
        ))}
      </div>
    </section>
  );
}
