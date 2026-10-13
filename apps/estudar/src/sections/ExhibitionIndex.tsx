import { useMemo } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { exhibitions } from '../lib/exhibitions';
import { getExhibitionPath } from '../lib/paths';
import { Flourish } from '../components/Ornaments';

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

interface ExhibitionIndexProps {
  query: string;
  category: string;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function ExhibitionIndex({ query, category, onQueryChange, onCategoryChange }: ExhibitionIndexProps) {
  const categories = ['Todos', ...new Set(exhibitions.map(item => item.year))];
  const filtered = useMemo(() => exhibitions.filter(item =>
    (category === 'Todos' || item.year === category) &&
    normalize(`${item.title} ${item.eyebrow} ${item.intro}`).includes(normalize(query.trim()))
  ), [query, category]);

  return (
    <section id="exhibitions" className="archive-section" aria-labelledby="archive-heading">
      <div className="section-heading">
        <div>
          <h2 id="archive-heading">O acervo.</h2>
          <p>Técnicas de estudo, gramática e etimologia. Escolha por onde começar.</p>
        </div>
        <span className="collection-count">{exhibitions.length} verbetes</span>
      </div>
      <div className="archive-tools">
        <div className="archive-filters" role="group" aria-label="Filtrar por assunto">
          {categories.map(item => (
            <button type="button" key={item} aria-pressed={category === item} onClick={() => onCategoryChange(item)}>{item}</button>
          ))}
        </div>
        <div className="archive-search">
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="archive-search">Buscar no acervo</label>
          <input id="archive-search" type="search" placeholder="Buscar no acervo" value={query} onChange={event => onQueryChange(event.target.value)} />
        </div>
      </div>
      <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? 'verbete encontrado' : 'verbetes encontrados'}</p>
      <div className="archive-list">
        {filtered.map(item => {
          const words = [item.intro, ...item.sections.map(section => `${section.heading} ${section.body}`)].join(' ').split(/\s+/).length;
          return (
            <a className="exhibition-item" key={item.slug} href={getExhibitionPath(item.slug)}>
              <span className="exhibition-category">{item.year}</span>
              <div className="exhibition-summary">
                <h3>{item.title}</h3>
                <p>{item.intro}</p>
              </div>
              <span className="exhibition-read">{Math.max(1, Math.ceil(words / 200))} min <ArrowUpRight size={23} aria-hidden="true" /></span>
            </a>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="archive-empty">
          <p>Nenhum verbete encontrado para esta busca.</p>
          <button type="button" onClick={() => { onQueryChange(''); onCategoryChange('Todos'); }}><X size={16} aria-hidden="true" /> Limpar filtros</button>
        </div>
      )}
      <Flourish width={320} style={{ marginTop: '3rem' }} />
    </section>
  );
}
