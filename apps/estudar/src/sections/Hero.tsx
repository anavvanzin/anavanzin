import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { heroConfig, exhibitionsConfig, herbariumConfig } from '../config';
import { Fleuron } from '../components/Ornaments';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-grid">
        <div>
          <h1>
            {heroConfig.titleLines.map((line, index) => (
              <span key={line} className={heroConfig.italicLines.includes(index) ? 'hero-italic' : undefined}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">{heroConfig.subtitle}</p>
        </div>
        <div className="hero-introduction">
          <Fleuron size={32} />
          <p>{heroConfig.lede}</p>
          <div className="hero-actions">
            <a className="action-link action-link-primary" href="#exhibitions">
              Explorar o acervo <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a className="action-link" href="#biblioteca">
              Abrir a biblioteca <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-colophon">
        <span>Um manual de metodologia de estudo</span>
        <span>{exhibitionsConfig.items.length} verbetes <span aria-hidden="true">·</span> {herbariumConfig.families.length} famílias de palavras</span>
      </div>
    </section>
  );
}
