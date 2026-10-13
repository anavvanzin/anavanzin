import { manifestoConfig } from '../config';
import { Divider } from '../components/Ornaments';

export default function Manifesto() {
  return (
    <section className="manifesto-section" aria-labelledby="manifesto-heading">
      <div className="manifesto-grid">
        <div>
          <h2 id="manifesto-heading">{manifestoConfig.headingText}</h2>
          <p>{manifestoConfig.bodyText}</p>
          <Divider width={300} style={{ margin: '2.5rem 0 0' }} />
        </div>
        <figure>
          <img src={manifestoConfig.imagePath} alt="Gravura de uma carta de navegação com bússola e instrumentos de trabalho" loading="lazy" width="1024" height="1024" />
          <figcaption>A carta de trabalho</figcaption>
        </figure>
      </div>
    </section>
  );
}
