import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navigationConfig } from '../config';

export default function Hud() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header className="hud">
      <a href="#hero" className="hud-brand" onClick={() => setIsOpen(false)} aria-label="Método — início">
        <b>{navigationConfig.brandName}</b>
      </a>
      <nav id="study-navigation" className={`hud-center${isOpen ? ' is-open' : ''}`} aria-label="Seções do manual">
        {navigationConfig.links.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>{item.label}</a>
        ))}
      </nav>
      <a className="hud-home" href="/">Ana Vanzin <ArrowUpRight size={13} aria-hidden="true" /></a>
      <button ref={toggleRef} type="button" className="hud-toggle" aria-controls="study-navigation"
        aria-expanded={isOpen} aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        <span>{isOpen ? 'Fechar' : 'Índice'}</span>
      </button>
    </header>
  );
}
