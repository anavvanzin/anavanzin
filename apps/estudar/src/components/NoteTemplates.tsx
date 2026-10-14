import { useRef, useState } from 'react';
import { Copy, Download, Printer } from 'lucide-react';
import catalog from '../data/noteTemplates.json';
import { assetPath } from '../lib/paths';

type NoteTemplate = (typeof catalog)[number];
type CopyState = 'idle' | 'copying' | 'copied' | 'manual';

function markdownFor(template: NoteTemplate) {
  return [
    `# ${template.title}`, '', template.description, '',
    `**Quando usar:** ${template.whenToUse}`, '',
    `**Como preencher:** ${template.howToUse}`, '',
    ...template.metadata.flatMap((label) => [`**${label}:**`, '']),
    ...template.sections.flatMap((section) => [
      `## ${section.label}`, '', section.hint, '', '[Escreva aqui]', '',
    ]),
  ].join('\n');
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

function htmlFor(template: NoteTemplate) {
  return `<html><body><h1>${escapeHtml(template.title)}</h1>` +
    `<p>${escapeHtml(template.description)}</p><p><strong>Quando usar:</strong> ${escapeHtml(template.whenToUse)}</p>` +
    `<p><strong>Como preencher:</strong> ${escapeHtml(template.howToUse)}</p>` +
    template.metadata.map((label) => `<p><strong>${escapeHtml(label)}:</strong> </p>`).join('') +
    template.sections.map((section) => `<h2>${escapeHtml(section.label)}</h2><p>${escapeHtml(section.hint)}</p><p>[Escreva aqui]</p>`).join('') +
    '</body></html>';
}

export default function NoteTemplates() {
  const [selectedId, setSelectedId] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('modelo');
    return catalog.some((item) => item.id === requested) ? requested! : 'cornell';
  });
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const manualRef = useRef<HTMLDetailsElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const operationRef = useRef(0);
  const template = catalog.find((item) => item.id === selectedId) ?? catalog[0];
  const markdown = markdownFor(template);

  function chooseTemplate(id: string) {
    operationRef.current += 1;
    setSelectedId(id);
    setCopyState('idle');
    if (manualRef.current) manualRef.current.open = false;
  }

  async function copyTemplate() {
    const operation = ++operationRef.current;
    setCopyState('copying');
    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([new ClipboardItem({
            'text/html': new Blob([htmlFor(template)], { type: 'text/html' }),
            'text/plain': new Blob([markdown], { type: 'text/plain' }),
          })]);
        } catch {
          await navigator.clipboard.writeText(markdown);
        }
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else {
        throw new Error('Clipboard unavailable');
      }
      if (operationRef.current === operation) setCopyState('copied');
    } catch {
      if (operationRef.current !== operation) return;
      setCopyState('manual');
      if (manualRef.current) manualRef.current.open = true;
      requestAnimationFrame(() => {
        textRef.current?.focus();
        textRef.current?.select();
      });
    }
  }

  return (
    <section id="modelos-anotacao" className="note-templates" aria-labelledby="note-templates-heading">
      <div className="template-collection-heading">
        <div>
          <h2 id="note-templates-heading">Modelos para usar.</h2>
          <p>Escolha um modelo. Copie no Craft ou leve uma folha A4 para a mesa.</p>
        </div>
        <a className="template-kit-link" href={assetPath('templates/caderno-de-modelos.pdf')} download>
          <Download size={16} aria-hidden="true" /> Baixar todos · {catalog.length} folhas
        </a>
      </div>

      <div className="template-mobile-picker">
        <label htmlFor="note-template-select">Tipo de anotação</label>
        <select id="note-template-select" value={selectedId} onChange={(event) => chooseTemplate(event.target.value)}>
          {catalog.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </div>

      <div className="template-workspace">
        <nav className="template-picker" aria-label="Tipos de modelo">
          {catalog.map((item) => (
            <button type="button" key={item.id} aria-pressed={selectedId === item.id}
              aria-controls="note-template-preview" onClick={() => chooseTemplate(item.id)}>
              <span>{item.title}</span>
              <small>{item.whenToUse}</small>
            </button>
          ))}
        </nav>

        <div id="note-template-preview" className="template-selected">
          <div className="template-selected-heading">
            <h3>{template.title}</h3>
            <p>{template.description}</p>
          </div>
          <div className="template-actions">
            <button type="button" className="template-copy" onClick={copyTemplate} disabled={copyState === 'copying'}>
              <Copy size={16} aria-hidden="true" />
              {copyState === 'copying' ? 'Copiando…' : copyState === 'copied' ? 'Copiado' : 'Copiar para o Craft'}
            </button>
            <a href={assetPath(`templates/${template.id}.pdf`)} target="_blank" rel="noopener noreferrer">
              <Printer size={16} aria-hidden="true" /> PDF para imprimir <span className="sr-only">(abre em nova aba)</span>
            </a>
            <a href={assetPath(`templates/${template.id}.md`)} download>
              <Download size={16} aria-hidden="true" /> Baixar modelo (.md)
            </a>
          </div>
          <p className="template-copy-status" role="status" aria-live="polite">
            {copyState === 'copied' ? 'Modelo copiado. Cole em um documento do Craft e preencha os campos.' :
              copyState === 'manual' ? 'A cópia automática não funcionou. O texto está selecionado abaixo: use Ctrl+C ou ⌘C.' :
              'No Craft, cole em um documento ou importe o arquivo .md. No papel, imprima o PDF A4 em tamanho real.'}
          </p>

          <div className={`template-sheet${template.layout === 'cornell' ? ' template-sheet-cornell' : ''}`} aria-label={`Prévia do modelo ${template.title}`}>
            <div className="template-sheet-title">{template.title}</div>
            <p className="template-sheet-guide"><strong>Como preencher:</strong> {template.howToUse}</p>
            <div className="template-sheet-metadata">
              {template.metadata.map((label) => <div key={label}><span>{label}</span><i aria-hidden="true" /></div>)}
            </div>
            <div className="template-sheet-sections">
              {template.sections.map((section) => (
                <div className="template-sheet-field" key={section.label}>
                  <h4>{section.label}</h4>
                  <p>{section.hint}</p>
                  <div className="template-rules" aria-hidden="true">
                    {Array.from({ length: section.weight + 1 }, (_, index) => <span key={index} />)}
                  </div>
                </div>
              ))}
            </div>
            <p className="template-sheet-footer">Prévia · PDF A4 com espaço para escrever à mão</p>
          </div>

          <details ref={manualRef} className="template-plain-text">
            <summary>Ver texto para copiar manualmente</summary>
            <label className="sr-only" htmlFor="note-template-text">Texto do modelo {template.title}</label>
            <textarea id="note-template-text" ref={textRef} value={markdown} readOnly rows={14}
              spellCheck={false} onFocus={(event) => event.currentTarget.select()} />
          </details>
        </div>
      </div>
    </section>
  );
}
